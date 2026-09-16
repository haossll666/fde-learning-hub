// FDE 全栈学习中心 & 交付模拟舱 交互引擎 v2.2.0

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

let currentModuleIndex = 0;
let currentItemIndex = 0;
let completedItems = new Set();
let quizAnswersState = {};

function initApp() {
    loadCompletedProgress();
    loadQuizAnswers();
    loadTheme();
    renderSidebar();
    
    // 初始化路由与深链
    handleInitialRouting();
    window.addEventListener('hashchange', handleHashRouting);

    bindGlobalEvents();
}

// 1. 路由与深链 (Hash Routing & Deep Linking)
function handleInitialRouting() {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash) {
        const target = findSectionByItemId(hash);
        if (target) {
            loadSection(target.mIdx, target.iIdx, false);
            return;
        }
    }
    loadSection(0, 0, false);
}

function handleHashRouting() {
    const hash = window.location.hash.replace('#', '').trim();
    if (!hash) return;
    const target = findSectionByItemId(hash);
    if (target) {
        if (target.mIdx !== currentModuleIndex || target.iIdx !== currentItemIndex) {
            loadSection(target.mIdx, target.iIdx, false);
        }
    }
}

function findSectionByItemId(itemId) {
    for (let mIdx = 0; mIdx < FDE_ALL_DATA.modules.length; mIdx++) {
        const mod = FDE_ALL_DATA.modules[mIdx];
        for (let iIdx = 0; iIdx < mod.items.length; iIdx++) {
            if (mod.items[iIdx].id === itemId) {
                return { mIdx, iIdx, item: mod.items[iIdx] };
            }
        }
    }
    return null;
}

// 2. 学习进度与 LocalStorage (优化 2：过滤 stale ID 防止进度虚增)
function loadCompletedProgress() {
    try {
        const saved = localStorage.getItem('fde_hub_completed');
        if (saved) {
            const rawList = JSON.parse(saved);
            // 严格过滤：仅保留当前 data.js 中合法存在的 section id
            const validList = rawList.filter(id => findSectionByItemId(id));
            completedItems = new Set(validList);
        }
    } catch (e) {
        console.error("加载学习打卡进度失败", e);
    }
    updateProgressUI();
}

function saveCompletedProgress() {
    try {
        localStorage.setItem('fde_hub_completed', JSON.stringify(Array.from(completedItems)));
    } catch (e) {
        console.error("保存学习打卡进度失败", e);
    }
    updateProgressUI();
    renderSidebar();
    
    // 如果当前在成长看板，联动刷新看板
    if (FDE_ALL_DATA.modules[currentModuleIndex]?.items[currentItemIndex]?.id === 'dashboard-view') {
        renderDashboard();
    }
}

function toggleItemCompleted(itemId) {
    if (completedItems.has(itemId)) {
        completedItems.delete(itemId);
    } else {
        completedItems.add(itemId);
    }
    saveCompletedProgress();
    updateSectionDoneButton();
}

function updateProgressUI() {
    let totalItems = 0;
    FDE_ALL_DATA.modules.forEach(m => {
        totalItems += m.items.length;
    });
    const completedCount = completedItems.size;
    const percentage = totalItems === 0 ? 0 : Math.round((completedCount / totalItems) * 100);

    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar-fill');

    if (progressText) {
        progressText.textContent = `${completedCount} / ${totalItems} 节 (${percentage}%)`;
    }
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }
}

// 3. 测验答案持久化 (优化 1：跨会话不丢失，答题记录持久化)
function loadQuizAnswers() {
    try {
        const saved = localStorage.getItem('fde_hub_quiz');
        if (saved) {
            quizAnswersState = JSON.parse(saved);
        }
    } catch (e) {
        console.error("加载测验答案失败", e);
    }
}

function saveQuizAnswers() {
    try {
        localStorage.setItem('fde_hub_quiz', JSON.stringify(quizAnswersState));
    } catch (e) {
        console.error("保存测验答案失败", e);
    }
}

// 4. 主题切换
function loadTheme() {
    const theme = localStorage.getItem('fde_hub_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeButtonUI(theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('fde_hub_theme', next);
    updateThemeButtonUI(next);
}

function updateThemeButtonUI(theme) {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.innerHTML = theme === 'dark' ? '☀️ 明亮模式' : '🌙 暗黑模式';
    }
}

// 5. 渲染侧边栏 (优化 3：检索支持标题、摘要、以及正文/黑话/代码片段全文匹配)
function renderSidebar(filterQuery = '') {
    const navContainer = document.getElementById('sidebar-nav');
    if (!navContainer) return;

    let html = '';
    const q = filterQuery.trim().toLowerCase();

    FDE_ALL_DATA.modules.forEach((mod, mIdx) => {
        let matchingItems = [];
        mod.items.forEach((item, iIdx) => {
            // 全文纯文本检索：剥离 HTML 标签后做无缝匹配
            const contentPlainText = item.content ? item.content.replace(/<[^>]+>/g, ' ').toLowerCase() : '';
            const match = !q || 
                          item.title.toLowerCase().includes(q) || 
                          item.summary.toLowerCase().includes(q) ||
                          contentPlainText.includes(q);

            if (match) {
                matchingItems.push({ item, iIdx });
            }
        });

        if (matchingItems.length > 0) {
            html += `<div class="nav-module-title">
                <span>${mod.title}</span>
                <span class="brand-badge">${mod.badge}</span>
            </div>`;

            matchingItems.forEach(({ item, iIdx }) => {
                const isActive = (mIdx === currentModuleIndex && iIdx === currentItemIndex);
                const isCompleted = completedItems.has(item.id);
                html += `
                <a href="#${item.id}" class="nav-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}" 
                   onclick="event.preventDefault(); loadSection(${mIdx}, ${iIdx});">
                    <span class="item-title">${item.title}</span>
                    <span class="item-status-icon">${isCompleted ? '✓' : '○'}</span>
                </a>`;
            });
        }
    });

    if (!html && q) {
        html = `<div style="padding: 1rem; color: var(--text-muted); font-size: 0.82rem; text-align: center;">未找到匹配的知识或代码片段</div>`;
    }

    navContainer.innerHTML = html;
}

// 6. 加载章节与动态内容
function loadSection(mIdx, iIdx, updateHash = true) {
    currentModuleIndex = mIdx;
    currentItemIndex = iIdx;

    const mod = FDE_ALL_DATA.modules[mIdx];
    const item = mod.items[iIdx];

    if (updateHash) {
        history.pushState(null, null, '#' + item.id);
    }

    // 更新面包屑
    const trail = document.getElementById('breadcrumb-trail');
    if (trail) {
        trail.innerHTML = `${mod.title} &nbsp;›&nbsp; <strong>${item.title}</strong>`;
    }

    // 更新章节头部
    const headerBlock = document.getElementById('section-header-mount');
    if (headerBlock) {
        headerBlock.innerHTML = `
            <span class="section-category-tag">${mod.badge} · ${mod.title}</span>
            <h1 class="section-title">${item.title}</h1>
            <p class="section-summary">${item.summary}</p>
            <div class="action-bar-top">
                <button id="mark-done-btn" class="mark-done-btn ${completedItems.has(item.id) ? 'is-completed' : ''}" onclick="toggleItemCompleted('${item.id}')">
                    ${completedItems.has(item.id) ? '✓ 已学完此节（点击取消）' : '○ 标记为此节已完成'}
                </button>
            </div>
        `;
    }

    // 挂载内容
    const contentMount = document.getElementById('section-content-mount');
    if (contentMount) {
        contentMount.innerHTML = item.content;
    }

    // 动态挂载特殊组件
    if (document.getElementById('quiz-mount-point')) {
        renderQuizzes();
    }
    if (document.getElementById('dashboard-mount-point')) {
        renderDashboard();
    }

    // 恢复清单勾选状态
    restoreChecklistStates();

    // 恢复 PBL 决策沙盘状态
    restorePblStates();

    // 重新高亮导航
    renderSidebar();

    // 移动端收起侧边栏
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }

    // 平滑滚动回顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateSectionDoneButton() {
    const currentItem = FDE_ALL_DATA.modules[currentModuleIndex].items[currentItemIndex];
    const btn = document.getElementById('mark-done-btn');
    if (btn) {
        if (completedItems.has(currentItem.id)) {
            btn.classList.add('is-completed');
            btn.innerHTML = '✓ 已学完此节（点击取消）';
        } else {
            btn.classList.remove('is-completed');
            btn.innerHTML = '○ 标记为此节已完成';
        }
    }
}

// 7. 事件绑定
function bindGlobalEvents() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderSidebar(e.target.value);
        });
    }

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }

    const menuBtn = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
}

// 8. 交互工具：Cost of Inaction (CoI) 商业损失计算器
window.executeCoICalculation = function() {
    const staff = parseFloat(document.getElementById('coi_staff')?.value) || 0;
    const salary = parseFloat(document.getElementById('coi_salary')?.value) || 0;
    const pct = parseFloat(document.getElementById('coi_pct')?.value) || 0;
    const loss = parseFloat(document.getElementById('coi_loss')?.value) || 0;

    const monthlyWaste = staff * salary * (pct / 100);
    const monthlyLoss = (loss * 10000) / 12;
    const monthlyCoI = monthlyWaste + monthlyLoss;
    const annualNetGain = (monthlyCoI * 12) * 0.85;

    const fmt = (num) => '¥' + Math.round(num).toLocaleString('zh-CN');

    const wasteEl = document.getElementById('val_waste_monthly');
    const coiEl = document.getElementById('val_coi_monthly');
    const gainEl = document.getElementById('val_annual_gain');
    const box = document.getElementById('coi_output');

    if (wasteEl) wasteEl.textContent = fmt(monthlyWaste);
    if (coiEl) coiEl.textContent = fmt(monthlyCoI);
    if (gainEl) gainEl.textContent = fmt(annualNetGain);
    if (box) box.classList.remove('hidden');
};

// 9. 清单持久化
function restoreChecklistStates() {
    try {
        const saved = localStorage.getItem('fde_hub_checklist_map');
        if (!saved) return;
        const checkMap = JSON.parse(saved);
        const inputs = document.querySelectorAll('input[type="checkbox"][data-check-key]');
        inputs.forEach(input => {
            const key = input.getAttribute('data-check-key');
            if (key && checkMap[key] !== undefined) {
                input.checked = Boolean(checkMap[key]);
            }
        });
    } catch (e) {
        console.error("恢复清单勾选状态失败", e);
    }
}

window.updateChecklistProgress = function() {
    try {
        let checkMap = {};
        const saved = localStorage.getItem('fde_hub_checklist_map');
        if (saved) {
            checkMap = JSON.parse(saved);
        }
        const inputs = document.querySelectorAll('input[type="checkbox"][data-check-key]');
        inputs.forEach(input => {
            const key = input.getAttribute('data-check-key');
            if (key) {
                checkMap[key] = input.checked;
            }
        });
        localStorage.setItem('fde_hub_checklist_map', JSON.stringify(checkMap));
    } catch (e) {
        console.error("更新清单状态失败", e);
    }
};

// 10. 交互题库：测验引擎 (优化 1 联动：即时持久化答题状态 + 四维标签)
function renderQuizzes() {
    const mount = document.getElementById('quiz-mount-point');
    if (!mount) return;

    let html = '';
    FDE_ALL_DATA.full_quizzes.forEach((qItem, qIdx) => {
        const state = quizAnswersState[qItem.id];
        const catBadgeColor = qItem.category === 'commercial' ? 'blue' : qItem.category === 'engineering' ? 'green' : qItem.category === 'crisis' ? 'orange' : 'purple';
        html += `
        <div class="quiz-card" id="quiz-card-${qItem.id}">
            <div class="quiz-q">
                <span class="badge ${catBadgeColor}" style="font-size: 0.72rem; margin-right: 0.5rem; vertical-align: middle;">${qItem.category_name || '实战决断'}</span>
                ${qIdx + 1}. ${qItem.q}
            </div>
            <div class="quiz-options">
                ${qItem.opts.map((opt, oIdx) => {
                    let cls = 'quiz-opt';
                    if (state !== undefined) {
                        if (oIdx === qItem.ans) cls += ' correct';
                        else if (oIdx === state) cls += ' wrong';
                    }
                    return `<button class="${cls}" onclick="handleQuizAnswer(${qItem.id}, ${oIdx}, ${qItem.ans})">${opt}</button>`;
                }).join('')}
            </div>
            <div class="quiz-exp ${state !== undefined ? '' : 'hidden'}" id="exp-${qItem.id}">
                <strong>【专家复盘解析】</strong> ${qItem.exp}
            </div>
        </div>
        `;
    });

    mount.innerHTML = html;
}

window.handleQuizAnswer = function(quizId, chosenOpt, correctOpt) {
    if (quizAnswersState[quizId] !== undefined) return;
    quizAnswersState[quizId] = chosenOpt;
    saveQuizAnswers(); // 立即存盘，刷新不丢失
    renderQuizzes();
    
    // 如果在成长看板，联动更新
    if (FDE_ALL_DATA.modules[currentModuleIndex]?.items[currentItemIndex]?.id === 'dashboard-view') {
        renderDashboard();
    }
};

// 11. PBL 抉择沙盘与代码排错交互引擎
function getPblChoices() {
    try {
        const saved = localStorage.getItem('fde_hub_pbl');
        return saved ? JSON.parse(saved) : {};
    } catch (e) {
        return {};
    }
}

function savePblChoices(choices) {
    try {
        localStorage.setItem('fde_hub_pbl', JSON.stringify(choices));
    } catch (e) {
        console.error("保存 PBL 决策记录失败", e);
    }
}

window.executePblChoice = function(scenarioId, choiceIdx) {
    const scenario = FDE_ALL_DATA.pbl_scenarios && FDE_ALL_DATA.pbl_scenarios[scenarioId];
    if (!scenario || !scenario.crossroads[choiceIdx]) return;

    const choices = getPblChoices();
    choices[scenarioId] = choiceIdx;
    savePblChoices(choices);

    renderPblOutcome(scenarioId, choiceIdx);

    // 如果在成长看板，联动更新
    if (FDE_ALL_DATA.modules[currentModuleIndex]?.items[currentItemIndex]?.id === 'dashboard-view') {
        renderDashboard();
    }
};

function renderPblOutcome(scenarioId, choiceIdx) {
    const scenario = FDE_ALL_DATA.pbl_scenarios && FDE_ALL_DATA.pbl_scenarios[scenarioId];
    if (!scenario || !scenario.crossroads[choiceIdx]) return;

    const choice = scenario.crossroads[choiceIdx];
    const outcomeBox = document.getElementById(`${scenarioId}-outcome`);
    const container = document.getElementById(`branch-${scenarioId}`);
    if (!outcomeBox) return;

    if (container) {
        const btns = container.querySelectorAll('.choice-btn');
        btns.forEach((btn, idx) => {
            btn.classList.remove('selected', 'choice-success', 'choice-fail');
            if (idx === choiceIdx) {
                btn.classList.add('selected');
                if (choice.status === 'SUCCESS') {
                    btn.classList.add('choice-success');
                } else {
                    btn.classList.add('choice-fail');
                }
            }
        });
    }

    const isSuccess = choice.status === 'SUCCESS';
    outcomeBox.className = `outcome-box ${isSuccess ? 'success' : 'fail'}`;
    outcomeBox.innerHTML = `
        <div class="outcome-header">
            <span class="badge ${isSuccess ? 'green' : 'red'}">
                ${isSuccess ? '✓ 决断通过 (Pass)' : '✕ 致命踩雷 (Incident)'}
            </span>
            <div class="impact-chips">
                <span class="impact-chip ${choice.trust >= 0 ? 'pos' : 'neg'}">客户信任度: ${choice.trust >= 0 ? '+' : ''}${choice.trust}%</span>
                <span class="impact-chip ${choice.delay === 0 ? 'pos' : 'neg'}">工期影响: ${choice.delay === 0 ? '无延误' : `延期 +${choice.delay} 天`}</span>
            </div>
        </div>
        <div class="outcome-desc">${choice.outcome}</div>
        ${!isSuccess 
            ? `<div class="outcome-retry-tip">💡 现场反思：真实交付场景无撤回机会。请反思违规/冒进原因，重新选择其他路径挽救局势。</div>` 
            : `<div class="outcome-success-tip">🎯 标杆解法：你展现了资深 FDE 的商业敏锐度与工程隔离直觉！</div>`
        }
    `;
    outcomeBox.classList.remove('hidden');
}

function restorePblStates() {
    const choices = getPblChoices();
    Object.keys(choices).forEach(scenarioId => {
        renderPblOutcome(scenarioId, choices[scenarioId]);
    });
}

// 现场实战排错挑战开关
window.toggleCodeHuntSolution = function() {
    const el = document.getElementById('code-hunt-solution');
    const btn = event?.currentTarget || document.querySelector('.code-hunt-header .copy-btn');
    if (!el) return;
    const isHidden = el.classList.contains('hidden');
    if (isHidden) {
        el.classList.remove('hidden');
        if (btn) btn.textContent = '收起诊断 ▲';
    } else {
        el.classList.add('hidden');
        if (btn) btn.textContent = '揭示专家诊断 ▼';
    }
};

// 12. 模块六：个人成长看板（四维战力模型 + PBL 沙盘认证）
function renderDashboard() {
    const mount = document.getElementById('dashboard-mount-point');
    if (!mount) return;

    let totalItems = 0;
    FDE_ALL_DATA.modules.forEach(m => totalItems += m.items.length);
    const completedCount = completedItems.size;
    const completionPct = totalItems === 0 ? 0 : Math.round((completedCount / totalItems) * 100);

    // 测验统计
    const totalQuizzes = FDE_ALL_DATA.full_quizzes.length;
    const answeredCount = Object.keys(quizAnswersState).length;
    let correctCount = 0;
    FDE_ALL_DATA.full_quizzes.forEach(q => {
        if (quizAnswersState[q.id] === q.ans) correctCount++;
    });
    const quizAccuracy = answeredCount === 0 ? 0 : Math.round((correctCount / answeredCount) * 100);

    // PBL 沙盘统计
    const pblChoices = getPblChoices();
    const pblScenarios = FDE_ALL_DATA.pbl_scenarios || {};
    let pblPassCount = 0;
    let pblAttemptCount = 0;
    const pblStatusMap = {};
    Object.keys(pblScenarios).forEach(scId => {
        const choiceIdx = pblChoices[scId];
        if (choiceIdx !== undefined) {
            pblAttemptCount++;
            const choice = pblScenarios[scId].crossroads[choiceIdx];
            if (choice && choice.status === 'SUCCESS') {
                pblPassCount++;
                pblStatusMap[scId] = 'pass';
            } else {
                pblStatusMap[scId] = 'fail';
            }
        } else {
            pblStatusMap[scId] = 'unattempted';
        }
    });

    // 四维战力计算 (Commercial, Engineering, Crisis, Compliance)
    const calcDimScore = (catKey, pblKey) => {
        const catQuizzes = FDE_ALL_DATA.full_quizzes.filter(q => q.category === catKey);
        const catTotal = catQuizzes.length;
        const catCorrect = catQuizzes.filter(q => quizAnswersState[q.id] === q.ans).length;
        const quizRatio = catTotal === 0 ? 0 : (catCorrect / catTotal);

        let pblRatio = 0;
        if (pblKey && pblChoices[pblKey] !== undefined) {
            const sc = pblScenarios[pblKey];
            const ch = sc && sc.crossroads[pblChoices[pblKey]];
            pblRatio = ch && ch.status === 'SUCCESS' ? 1.0 : 0.35;
        }

        // 加权融合
        let finalScore = 0;
        if (pblKey) {
            finalScore = Math.round((quizRatio * 0.55 + pblRatio * 0.45) * 100);
        } else {
            finalScore = Math.round(quizRatio * 100);
        }
        return Math.min(100, Math.max(0, finalScore));
    };

    const radarScores = {
        commercial: calcDimScore('commercial', 'pbl-3'),
        engineering: calcDimScore('engineering', null),
        crisis: calcDimScore('crisis', 'pbl-1'),
        compliance: calcDimScore('compliance', 'pbl-2')
    };

    // 段位综合评定
    let rankName = "初级现场实施 (Junior Operator)";
    let rankColor = "#94a3b8";
    if (completionPct >= 75 && quizAccuracy >= 80 && pblPassCount === 3) {
        rankName = "👑 传奇 Delta 架构师 (Legendary FDE Architect)";
        rankColor = "#f59e0b";
    } else if (completionPct >= 45 && quizAccuracy >= 70 && pblPassCount >= 2) {
        rankName = "🎖️ 前线交付特种兵 (Senior Forward Deployed Engineer)";
        rankColor = "#0071e3";
    } else if (completionPct >= 20 || pblPassCount >= 1) {
        rankName = "⚡ 进阶方案工程师 (Solution Architect)";
        rankColor = "#34c759";
    }

    const getDimLevel = (score) => {
        if (score >= 85) return { label: '卓越 (Master)', color: 'var(--apple-green)' };
        if (score >= 60) return { label: '达标 (Pass)', color: 'var(--apple-blue)' };
        if (score > 0) return { label: '待补强 (Alert)', color: 'var(--apple-orange)' };
        return { label: '未实测 (Untested)', color: 'var(--text-muted)' };
    };

    mount.innerHTML = `
        <div class="dashboard-container">
            <div class="rank-card">
                <div class="rank-badge" style="background: ${rankColor}18; color: ${rankColor}; border: 1px solid ${rankColor}40;">
                    ${rankName}
                </div>
                <p style="margin-top: 0.6rem; font-size: 0.88rem; color: var(--text-secondary);">
                    综合考核知识打卡覆盖率、四维战力胜率及 PBL 3 大极限实战沙盘通关情况。
                </p>
            </div>

            <div class="kpi-cards" style="margin: 1.5rem 0;">
                <div class="kpi-card success">
                    <span class="label">知识点打卡总览</span>
                    <span class="val">${completedCount} / ${totalItems} 节</span>
                    <span style="font-size: 0.78rem; color: var(--text-muted); display:block; margin-top:0.3rem;">全站完成率 ${completionPct}%</span>
                </div>
                <div class="kpi-card danger">
                    <span class="label">实战决断胜率</span>
                    <span class="val">${correctCount} / ${totalQuizzes} 题</span>
                    <span style="font-size: 0.78rem; color: var(--text-muted); display:block; margin-top:0.3rem;">准确率 ${quizAccuracy}% (已答 ${answeredCount} 题)</span>
                </div>
                <div class="kpi-card" style="background: var(--bg-surface);">
                    <span class="label">PBL 极限沙盘通过</span>
                    <span class="val">${pblPassCount} / 3 场</span>
                    <span style="font-size: 0.78rem; color: var(--text-muted); display:block; margin-top:0.3rem;">已决断 ${pblAttemptCount} 场实战</span>
                </div>
            </div>

            <div class="dashboard-section-header">
                <h3>🛡️ FDE 四维战力模型评估 (Competency Radar)</h3>
                <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 1rem;">
                    区别于普通工程师，资深 FDE 必须同时兼备商业破局、工程防线、绝境自愈与安全隔离四大闭环战力：
                </p>
            </div>

            <div class="competency-grid">
                <div class="competency-card">
                    <div class="competency-header">
                        <span class="competency-title">💼 商业对齐力 (Commercial Alignment)</span>
                        <span class="competency-level" style="color: ${getDimLevel(radarScores.commercial).color}">
                            ${getDimLevel(radarScores.commercial).label} (${radarScores.commercial}分)
                        </span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${radarScores.commercial}%; background: var(--apple-blue);"></div>
                    </div>
                    <div class="competency-tip">涵盖：CXO 财务账本折算、CoI 机会成本测算、抗击需求蠕变谈判。</div>
                </div>

                <div class="competency-card">
                    <div class="competency-header">
                        <span class="competency-title">⚙️ 工程防御力 (Engineering Defense)</span>
                        <span class="competency-level" style="color: ${getDimLevel(radarScores.engineering).color}">
                            ${getDimLevel(radarScores.engineering).label} (${radarScores.engineering}分)
                        </span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${radarScores.engineering}%; background: var(--apple-green);"></div>
                    </div>
                    <div class="competency-tip">涵盖：RAGAS 忠实度数学评估、Agent 异常重试降级、工程金标准 Kata。</div>
                </div>

                <div class="competency-card">
                    <div class="competency-header">
                        <span class="competency-title">⚡ 现场应变力 (Crisis Agility)</span>
                        <span class="competency-level" style="color: ${getDimLevel(radarScores.crisis).color}">
                            ${getDimLevel(radarScores.crisis).label} (${radarScores.crisis}分)
                        </span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${radarScores.crisis}%; background: var(--apple-orange);"></div>
                    </div>
                    <div class="competency-tip">涵盖：48h 金融闪电破局、真实脏数据突发清洗、关键演示挽救。</div>
                </div>

                <div class="competency-card">
                    <div class="competency-header">
                        <span class="competency-title">🔒 隔离合规力 (Air-Gap & Compliance)</span>
                        <span class="competency-level" style="color: ${getDimLevel(radarScores.compliance).color}">
                            ${getDimLevel(radarScores.compliance).label} (${radarScores.compliance}分)
                        </span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${radarScores.compliance}%; background: var(--apple-purple);"></div>
                    </div>
                    <div class="competency-tip">涵盖：纯离线内网 Multimodal RAG、保密物理机房排障、合规自检。</div>
                </div>
            </div>

            <div class="dashboard-section-header" style="margin-top: 2rem;">
                <h3>⚔️ PBL 极限挑战通关认证</h3>
            </div>
            <div class="pbl-summary-grid">
                <div class="pbl-summary-item ${pblStatusMap['pbl-1']}">
                    <div class="pbl-item-header">
                        <strong>场景 1：国有城商行信贷 48h 审查</strong>
                        <span class="badge ${pblStatusMap['pbl-1'] === 'pass' ? 'green' : pblStatusMap['pbl-1'] === 'fail' ? 'red' : 'gray'}">
                            ${pblStatusMap['pbl-1'] === 'pass' ? '已通关' : pblStatusMap['pbl-1'] === 'fail' ? '踩雷事故' : '未挑战'}
                        </span>
                    </div>
                    <p>内网无公网、脏扫描件遮挡，考验 Golden Test Set 真实切入战术。</p>
                </div>
                <div class="pbl-summary-item ${pblStatusMap['pbl-2']}">
                    <div class="pbl-item-header">
                        <strong>场景 2：地下车间离线排障</strong>
                        <span class="badge ${pblStatusMap['pbl-2'] === 'pass' ? 'green' : pblStatusMap['pbl-2'] === 'fail' ? 'red' : 'gray'}">
                            ${pblStatusMap['pbl-2'] === 'pass' ? '已通关' : pblStatusMap['pbl-2'] === 'fail' ? '踩雷事故' : '未挑战'}
                        </span>
                    </div>
                    <p>严禁外网 WiFi、高频传感器数据，考验特征工程降维与离线 RAG。</p>
                </div>
                <div class="pbl-summary-item ${pblStatusMap['pbl-3']}">
                    <div class="pbl-item-header">
                        <strong>场景 3：需求蝗虫防御谈判</strong>
                        <span class="badge ${pblStatusMap['pbl-3'] === 'pass' ? 'green' : pblStatusMap['pbl-3'] === 'fail' ? 'red' : 'gray'}">
                            ${pblStatusMap['pbl-3'] === 'pass' ? '已通关' : pblStatusMap['pbl-3'] === 'fail' ? '踩雷事故' : '未挑战'}
                        </span>
                    </div>
                    <p>客户高管验收前夕加码关税申报，考验柔道式锁定价值与预算引导。</p>
                </div>
            </div>

            <h3 style="margin-top: 2rem;">各模块章节进度分解</h3>
            <div class="module-progress-list">
                ${FDE_ALL_DATA.modules.map(mod => {
                    const modTotal = mod.items.length;
                    const modDone = mod.items.filter(it => completedItems.has(it.id)).length;
                    const pct = Math.round((modDone / modTotal) * 100);
                    return `
                    <div style="margin-bottom: 0.9rem; background: var(--bg-surface); padding: 0.9rem 1.1rem; border-radius: var(--radius-md); border: 0.5px solid var(--border-subtle);">
                        <div style="display:flex; justify-content:space-between; font-size: 0.86rem; margin-bottom: 0.4rem;">
                            <strong>${mod.title}</strong>
                            <span style="color: var(--text-secondary); font-size: 0.8rem;">${modDone}/${modTotal} (${pct}%)</span>
                        </div>
                        <div class="progress-bar-bg" style="height: 5px;">
                            <div class="progress-bar-fill" style="width: ${pct}%;"></div>
                        </div>
                    </div>`;
                }).join('')}
            </div>

            <div style="margin-top: 2.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                <button class="action-btn" onclick="exportStudyRecords()">📥 导出个人 FDE 战力认证报告 (JSON)</button>
                <button class="mark-done-btn" style="border-color: var(--apple-red); color: var(--apple-red);" onclick="resetStudyProgress()">⚠️ 清空重置所有记录</button>
            </div>
        </div>
    `;
}

function getChecklistActiveCount() {
    try {
        const saved = localStorage.getItem('fde_hub_checklist_map');
        if (!saved) return 0;
        const map = JSON.parse(saved);
        return Object.values(map).filter(Boolean).length;
    } catch (e) {
        return 0;
    }
}

window.exportStudyRecords = function() {
    const pblChoices = getPblChoices();
    const record = {
        timestamp: new Date().toISOString(),
        completedItems: Array.from(completedItems),
        quizAnswers: quizAnswersState,
        pblChoices: pblChoices,
        checklists: JSON.parse(localStorage.getItem('fde_hub_checklist_map') || '{}')
    };
    const blob = new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fde-competency-cert-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

window.resetStudyProgress = function() {
    if (confirm("确定要清空所有学习打卡、沙盘抉择与测验记录吗？此操作不可逆。")) {
        completedItems.clear();
        quizAnswersState = {};
        localStorage.removeItem('fde_hub_completed');
        localStorage.removeItem('fde_hub_quiz');
        localStorage.removeItem('fde_hub_checklist_map');
        localStorage.removeItem('fde_hub_pbl');
        updateProgressUI();
        renderSidebar();
        renderDashboard();
    }
};

// 13. 代码一键复制
window.copyCode = function(buttonElement) {
    const pre = buttonElement.closest('.code-header').nextElementSibling;
    if (!pre) return;
    const code = pre.querySelector('code');
    if (!code) return;

    navigator.clipboard.writeText(code.innerText).then(() => {
        const originalText = buttonElement.textContent;
        buttonElement.textContent = '已复制! ✓';
        buttonElement.style.background = 'var(--apple-green)';
        setTimeout(() => {
            buttonElement.textContent = originalText;
            buttonElement.style.background = '';
        }, 1800);
    }).catch(err => {
        console.error('复制失败', err);
    });
};
