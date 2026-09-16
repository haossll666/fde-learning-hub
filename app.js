// FDE 全栈学习中心 & 交付模拟舱 交互引擎 v2.1.0

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

let currentModuleIndex = 0;
let currentItemIndex = 0;
let completedItems = new Set();
let quizAnswersState = {};

function initApp() {
    loadCompletedProgress();
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
    // 默认加载第一小节
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

// 2. 学习进度与 LocalStorage
function loadCompletedProgress() {
    try {
        const saved = localStorage.getItem('fde_hub_completed');
        if (saved) {
            completedItems = new Set(JSON.parse(saved));
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
    
    // 如果当前在成长看板，刷新看板
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

// 3. 主题切换
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

// 4. 渲染侧边栏
function renderSidebar(filterQuery = '') {
    const navContainer = document.getElementById('sidebar-nav');
    if (!navContainer) return;

    let html = '';
    const q = filterQuery.trim().toLowerCase();

    FDE_ALL_DATA.modules.forEach((mod, mIdx) => {
        let matchingItems = [];
        mod.items.forEach((item, iIdx) => {
            const match = !q || item.title.toLowerCase().includes(q) || item.summary.toLowerCase().includes(q);
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
        html = `<div style="padding: 1rem; color: var(--text-muted); font-size: 0.85rem; text-align: center;">未找到匹配内容</div>`;
    }

    navContainer.innerHTML = html;
}

// 5. 加载章节与动态内容
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

    // 核心 Bug 修复：在 DOM 注入后立刻恢复清单勾选状态
    restoreChecklistStates();

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

// 6. 事件绑定
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

// 7. 交互工具：Cost of Inaction (CoI) 商业损失计算器（带精确 85% 折算）
window.executeCoICalculation = function() {
    const staff = parseFloat(document.getElementById('coi_staff')?.value) || 0;
    const salary = parseFloat(document.getElementById('coi_salary')?.value) || 0;
    const pct = parseFloat(document.getElementById('coi_pct')?.value) || 0;
    const loss = parseFloat(document.getElementById('coi_loss')?.value) || 0;

    // 每月纯低效人力浪费 = 人数 * 月薪 * (耗时比例 / 100)
    const monthlyWaste = staff * salary * (pct / 100);
    // 每月历史错误造成的平均损失 = (年度损失 * 10000) / 12
    const monthlyLoss = (loss * 10000) / 12;
    // 综合每月不作为成本 (CoI)
    const monthlyCoI = monthlyWaste + monthlyLoss;
    // 承诺算法修正：首年预计净释放商业价值 = monthlyCoI * 12 * 0.85 (按 85% 自动化率折算)
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

// 8. 修复后的清单持久化（采用稳定 Key 字典机制）
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

// 9. 交互题库：测验引擎
function renderQuizzes() {
    const mount = document.getElementById('quiz-mount-point');
    if (!mount) return;

    let html = '';
    FDE_ALL_DATA.full_quizzes.forEach((qItem, qIdx) => {
        const state = quizAnswersState[qItem.id];
        html += `
        <div class="quiz-card" id="quiz-card-${qItem.id}">
            <div class="quiz-q">${qIdx + 1}. ${qItem.q}</div>
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
    renderQuizzes();
    
    // 如果在成长看板，联动更新
    if (FDE_ALL_DATA.modules[currentModuleIndex]?.items[currentItemIndex]?.id === 'dashboard-view') {
        renderDashboard();
    }
};

// 10. 模块六：个人成长看板 (Personal Growth Dashboard)
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

    // 段位判定
    let rankName = "初级现场实施 (Junior Operator)";
    let rankColor = "#94a3b8";
    if (completionPct >= 80 && quizAccuracy >= 80) {
        rankName = "传奇 Delta 架构师 (Legendary FDE Architect)";
        rankColor = "#f59e0b";
    } else if (completionPct >= 50 && quizAccuracy >= 70) {
        rankName = "前线交付特种兵 (Senior Forward Deployed Engineer)";
        rankColor = "#3b82f6";
    } else if (completionPct >= 25) {
        rankName = "进阶方案工程师 (Solution Architect)";
        rankColor = "#10b981";
    }

    mount.innerHTML = `
        <div class="dashboard-container">
            <div class="rank-card">
                <div class="rank-badge" style="background: ${rankColor}20; color: ${rankColor}; border: 1px solid ${rankColor}">
                    当前交付战力段位：${rankName}
                </div>
                <p style="margin-top: 0.5rem; font-size: 0.88rem; color: var(--text-secondary);">
                    根据你的知识点打卡覆盖度与实战情境答题胜率综合核算。
                </p>
            </div>

            <div class="kpi-cards" style="margin: 1.5rem 0;">
                <div class="kpi-card success">
                    <span class="label">知识点打卡总览</span>
                    <span class="val">${completedCount} / ${totalItems} 节</span>
                    <span style="font-size: 0.78rem; color: var(--text-muted); display:block; margin-top:0.3rem;">完成率 ${completionPct}%</span>
                </div>
                <div class="kpi-card danger">
                    <span class="label">实战决断通关率</span>
                    <span class="val">${correctCount} / ${totalQuizzes} 题</span>
                    <span style="font-size: 0.78rem; color: var(--text-muted); display:block; margin-top:0.3rem;">答题正确率 ${quizAccuracy}%</span>
                </div>
                <div class="kpi-card" style="background: var(--bg-tertiary);">
                    <span class="label">双防线自检项</span>
                    <span class="val">${getChecklistActiveCount()} 项勾选</span>
                    <span style="font-size: 0.78rem; color: var(--text-muted); display:block; margin-top:0.3rem;">SOW & Air-Gap 检查项</span>
                </div>
            </div>

            <h3>各模块掌握度拆解</h3>
            <div class="module-progress-list">
                ${FDE_ALL_DATA.modules.map(mod => {
                    const modTotal = mod.items.length;
                    const modDone = mod.items.filter(it => completedItems.has(it.id)).length;
                    const pct = Math.round((modDone / modTotal) * 100);
                    return `
                    <div style="margin-bottom: 1rem; background: var(--bg-secondary); padding: 0.8rem 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
                        <div style="display:flex; justify-content:space-between; font-size: 0.86rem; margin-bottom: 0.4rem;">
                            <strong>${mod.title}</strong>
                            <span>${modDone}/${modTotal} (${pct}%)</span>
                        </div>
                        <div class="progress-bar-bg" style="height: 5px;">
                            <div class="progress-bar-fill" style="width: ${pct}%;"></div>
                        </div>
                    </div>`;
                }).join('')}
            </div>

            <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                <button class="action-btn" onclick="exportStudyRecords()">📥 导出学习成就 JSON 报告</button>
                <button class="mark-done-btn" style="border-color: var(--danger); color: var(--danger);" onclick="resetStudyProgress()">⚠️ 重置所有学习记录</button>
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
    const record = {
        timestamp: new Date().toISOString(),
        completedItems: Array.from(completedItems),
        quizAnswers: quizAnswersState,
        checklists: JSON.parse(localStorage.getItem('fde_hub_checklist_map') || '{}')
    };
    const blob = new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fde-study-record-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

window.resetStudyProgress = function() {
    if (confirm("确定要清空所有学习打卡和测试记录吗？此操作不可逆。")) {
        completedItems.clear();
        quizAnswersState = {};
        localStorage.removeItem('fde_hub_completed');
        localStorage.removeItem('fde_hub_checklist_map');
        updateProgressUI();
        renderSidebar();
        renderDashboard();
    }
};

// 11. 代码一键复制
window.copyCode = function(buttonElement) {
    const pre = buttonElement.closest('.code-header').nextElementSibling;
    if (!pre) return;
    const code = pre.querySelector('code');
    if (!code) return;

    navigator.clipboard.writeText(code.innerText).then(() => {
        const originalText = buttonElement.textContent;
        buttonElement.textContent = '已复制! ✓';
        buttonElement.style.background = 'var(--success)';
        setTimeout(() => {
            buttonElement.textContent = originalText;
            buttonElement.style.background = '';
        }, 1800);
    }).catch(err => {
        console.error('复制失败', err);
    });
};
