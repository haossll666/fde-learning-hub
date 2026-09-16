// FDE 全栈学习中心 & 交付模拟舱 交互引擎

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
    loadSection(0, 0);
    bindGlobalEvents();
    initChecklistStates();
}

// 1. 学习进度与 LocalStorage
function loadCompletedProgress() {
    try {
        const saved = localStorage.getItem('fde_hub_completed');
        if (saved) {
            completedItems = new Set(JSON.parse(saved));
        }
    } catch (e) {
        console.error("加载进度失败", e);
    }
    updateProgressUI();
}

function saveCompletedProgress() {
    try {
        localStorage.setItem('fde_hub_completed', JSON.stringify(Array.from(completedItems)));
    } catch (e) {
        console.error("保存进度失败", e);
    }
    updateProgressUI();
    renderSidebar();
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

// 2. 主题切换
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

// 3. 渲染侧边栏
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
                <div class="nav-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}" 
                     onclick="loadSection(${mIdx}, ${iIdx})">
                    <span class="item-title">${item.title}</span>
                    <span class="item-status-icon">${isCompleted ? '✓' : '○'}</span>
                </div>`;
            });
        }
    });

    if (!html && q) {
        html = `<div style="padding: 1rem; color: var(--text-muted); font-size: 0.85rem; text-align: center;">未找到匹配内容</div>`;
    }

    navContainer.innerHTML = html;
}

// 4. 加载知识模块与页面内容
function loadSection(mIdx, iIdx) {
    currentModuleIndex = mIdx;
    currentItemIndex = iIdx;

    const mod = FDE_ALL_DATA.modules[mIdx];
    const item = mod.items[iIdx];

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

    // 特殊挂载：如果当前包含测验挂载点
    if (document.getElementById('quiz-mount-point')) {
        renderQuizzes();
    }

    // 重新高亮导航
    renderSidebar();

    // 移动端关闭侧边栏
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

// 5. 事件绑定
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

// 6. 交互工具：Cost of Inaction (CoI) 商业损失计算器
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
    // 首年释放净价值（假设 85% 自动化率与风险防御）
    const annualNetGain = (monthlyCoI * 12);

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

// 7. 交互工具：Checklists 状态持久化
function initChecklistStates() {
    try {
        const saved = localStorage.getItem('fde_hub_checklists');
        if (saved) {
            const checks = JSON.parse(saved);
            const checkboxes = document.querySelectorAll('.check-group input[type="checkbox"]');
            checkboxes.forEach((cb, idx) => {
                if (checks[idx]) cb.checked = true;
            });
        }
    } catch (e) {}
}

window.updateChecklistProgress = function() {
    const checkboxes = document.querySelectorAll('.check-group input[type="checkbox"]');
    const states = [];
    checkboxes.forEach(cb => states.push(cb.checked));
    try {
        localStorage.setItem('fde_hub_checklists', JSON.stringify(states));
    } catch (e) {}
};

// 8. 交互题库：测验引擎
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
    if (quizAnswersState[quizId] !== undefined) return; // 已答过不可修改
    quizAnswersState[quizId] = chosenOpt;
    renderQuizzes();
};

// 9. 代码复制功能
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
