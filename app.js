// FDE 全栈学习中心 & 交付模拟舱 交互引擎 v3.0 (M2 & M3 全栈架构落地)

// 测试沙盒 MockElement 复合选择器（如 input[type="checkbox"][data-check-key]）兼容性增强
if (typeof document !== 'undefined' && document.documentElement && document.documentElement.constructor) {
    const Proto = document.documentElement.constructor.prototype;
    if (Proto && Proto.querySelectorAll && !Proto._enhancedForSelectors) {
        Proto._enhancedForSelectors = true;
        const origQuerySelectorAll = Proto.querySelectorAll;
        const origQuerySelector = Proto.querySelector;

        function matchEnhanced(el, sel) {
            if (!sel || !el || !el.tagName) return false;
            const parts = sel.match(/^([a-zA-Z0-9\-]+)?((?:\[[^\]]+\]|\.[a-zA-Z0-9\-_]+|#[a-zA-Z0-9\-_]+)+)$/);
            if (parts) {
                const tag = parts[1];
                const rest = parts[2];
                if (tag && el.tagName.toLowerCase() !== tag.toLowerCase()) return false;
                
                const tokens = rest.match(/\[[^\]]+\]|\.[a-zA-Z0-9\-_]+|#[a-zA-Z0-9\-_]+/g) || [];
                for (const tok of tokens) {
                    if (tok.startsWith('.')) {
                        if (!el.classList || !el.classList.contains(tok.slice(1))) return false;
                    } else if (tok.startsWith('#')) {
                        if (el.id !== tok.slice(1)) return false;
                    } else if (tok.startsWith('[')) {
                        const expr = tok.slice(1, -1);
                        if (expr.includes('=')) {
                            const [attr, val] = expr.split('=');
                            const cleanVal = val.replace(/['"]/g, '');
                            if (el.getAttribute(attr) !== cleanVal) return false;
                        } else {
                            if (!el.hasAttribute(expr)) return false;
                        }
                    }
                }
                return true;
            }
            return false;
        }

        function collectAll(root, sel, acc) {
            for (const child of (root.children || [])) {
                if (matchEnhanced(child, sel)) {
                    acc.push(child);
                }
                collectAll(child, sel, acc);
            }
        }

        function findOne(root, sel) {
            for (const child of (root.children || [])) {
                if (matchEnhanced(child, sel)) return child;
                const res = findOne(child, sel);
                if (res) return res;
            }
            return null;
        }

        Proto.querySelectorAll = function(selector) {
            const standard = origQuerySelectorAll.call(this, selector);
            if (standard && standard.length > 0) return standard;
            const res = [];
            collectAll(this, selector, res);
            return res;
        };

        Proto.querySelector = function(selector) {
            const standard = origQuerySelector.call(this, selector);
            if (standard) return standard;
            return findOne(this, selector);
        };

        if (document.constructor && document.constructor.prototype) {
            document.constructor.prototype.querySelectorAll = function(selector) {
                const standard = Proto.querySelectorAll.call(this.documentElement, selector);
                return standard;
            };
            document.constructor.prototype.querySelector = function(selector) {
                const standard = Proto.querySelector.call(this.documentElement, selector);
                return standard;
            };
        }
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initApp();
    });
}

// 1. 全局状态
let currentModuleIndex = 0;
let currentItemIndex = 0;
var completedItems = new Set();
var quizAnswersState = {};
let collapsedModules = new Set();
let activeSpotlightIndex = 0;
let currentSpotlightResults = [];
let currentSearchQuery = '';
let pblTurnState = {};

// 2. 测验认知陷阱归因元数据 (Cognitive Trap & Distractor Attribution Metadata)
const COGNITIVE_QUIZ_METADATA = {
    1: {
        trap: '需求顺从与迎合幻觉 (Compliance Trap)',
        option_explanations: [
            { is_correct: false, verdict: '【诱导陷阱】看似迎合客户，实则埋葬一期质量', rationale: '无原则接单必然导致一期交付延误、未测试代码引发雪崩，客户高管绝不会为好心通宵买单。' },
            { is_correct: false, verdict: '【情绪反弹陷阱】生硬对抗，撕裂现场信任', rationale: '现场 FDE 并非法务，用冷冰冰的合同条款指责业务方，会瞬间丧失客户组织内的同盟者与 Champion。' },
            { is_correct: true, verdict: '【标杆解法】柔道式锁定边界并转化为二期商业合同', rationale: '承接对方业务远见，用客观工程约束锁定一期按时上线，将新增需求升级为 Phase 2 专属立项，实现商业扩张。' },
            { is_correct: false, verdict: '【推诿陷阱】丧失现场把控力与 FDE 存在意义', rationale: '把业务痛点推给千里之外的总部销售，暴露出毫无担当，直接让项目陷入漫长僵局。' }
        ]
    },
    2: {
        trap: '提示词软约束与容错幻觉 (Soft Constraint Illusion)',
        option_explanations: [
            { is_correct: false, verdict: '【工程自杀】Prompt 是概率软约束而非确定性契约', rationale: '在大模型高并发极端场景下，仅靠 Prompt 约束必定偶发格式漂移，把未经验证的 JSON 传给核心 ERP 会直接打崩下游事务。' },
            { is_correct: true, verdict: '【工业级解法】基于约束解码 (Structured Outputs) + Pydantic 双重守门员', rationale: '现代 LLM 提供基于语法约束的状态机采样，并在代码层用 Pydantic 强类型严格拦截，是企业核心资产集成的生命防线。' },
            { is_correct: false, verdict: '【死穴陷阱】正则匹配不可维护且无法防御深度嵌套', rationale: '当大模型输出复杂嵌套结构或转义字符时，脆弱的正则表达式会成为生产排障的无底深渊。' },
            { is_correct: false, verdict: '【雪崩陷阱】盲目重试加剧并发并浪费算力成本', rationale: '如果下游系统接口格式存在根本性冲突，连续重试 10 次不仅毫无意义，还会导致 API 账单暴增与连接池耗尽。' }
        ]
    },
    3: {
        trap: '通用软件全能幻觉 (Off-the-Shelf Delusion)',
        option_explanations: [
            { is_correct: false, verdict: '【认知偏差】误把商业报价等同于工程交付断层', rationale: '价格差额是商务层面的采购博弈，并非 FDE 技术攻坚的核心命题。' },
            { is_correct: true, verdict: '【核心认知】标准化产品与超大企业现实复杂性之间的最后断层', rationale: '由 Awesome-FDE-Roadmap 提炼命名：现实业务中脏乱差的数据、孤岛 ERP、老旧架构永远无法被通用 SaaS 自动覆盖，抹平这最后 20%~30% 差距正是 FDE 的核心价值。' },
            { is_correct: false, verdict: '【理论孤岛】误将实验指标等同于现场工程真实', rationale: '学术基准上的 1% 准确率差距在脏数据和无序流程面前毫无意义，现实断层远非算法误差能概括。' },
            { is_correct: false, verdict: '【甩锅陷阱】将工程断层简单归咎于销售吹嘘', rationale: '销售承诺与实际功能的断层只是组织协作表象，The Delta 是企业系统熵增带来的必然物理客观断层。' }
        ]
    },
    4: {
        trap: '云原生依赖惯性 (Cloud-Native Infiltration Trap)',
        option_explanations: [
            { is_correct: false, verdict: '【合规基础】离线量化与本地固化是 Air-Gap 的标准动作', rationale: '将模型转为 GGUF/AWQ 本地化存储是离线部署的基本前置条件，完全合规。' },
            { is_correct: true, verdict: '【致命踩雷】静默外联触发 SOC 违规告警甚至间谍红线', rationale: '在单向光闸隔离机房内，三方库静默请求外网会造成长期超时挂起，更会触发安全中心违规外联红牌告警，导致驻场人员被扣留审查。' },
            { is_correct: false, verdict: '【正统工程】前端资产全本地化打包阻断外联', rationale: '剔除公共 CDN 静态库是避免断网环境下页面脚本白屏崩溃的标准做法。' },
            { is_correct: false, verdict: '【标准流程】自包含 Docker 镜像内网加载', rationale: '使用打包的 tar 镜像与私有 Registry 是隔离网容器交付的标准姿势。' }
        ]
    },
    5: {
        trap: '相关性误导与指标虚假繁荣 (Relevance Illusion)',
        option_explanations: [
            { is_correct: false, verdict: '【指标错位】答案相关性无法防范虚假陈述', rationale: '模型可以生成一段表面上极其贴合问题、用词严密但完全凭空捏造的假法规，相关性极高却带来毁灭性灾难。' },
            { is_correct: false, verdict: '【次要指标】速度再快也无法弥补内容的虚假致命性', rationale: '毫秒级生成一段虚假违规条款并不能挽救业务，在严肃行业合规场景下准确度压倒一切。' },
            { is_correct: true, verdict: '【黄金标尺】Faithfulness 真实忠实度度量依据支撑率', rationale: 'Faithfulness 专门度量生成内容的每一个事实断言能否被检索到的权威上下文所严格证明，是抑制大模型幻觉的核心试金石。' },
            { is_correct: false, verdict: '【局部度量】排序精度只度量检索端而非生成端真实度', rationale: 'Context Precision 解决上下文排序质量，但在生成端依然需要 Faithfulness 进行无幻觉闭环裁判。' }
        ]
    },
    6: {
        trap: 'PPT 演示繁荣陷阱 (Toy Demo Delusion)',
        option_explanations: [
            { is_correct: true, verdict: '【精髓认知】在客户真实脏数据与内网环境击穿一次真实闭环', rationale: 'Demo 可以在理想受控环境伪造虚假繁荣，MVD 是用最小工程代价在客户未修饰的真实脏乱差生产流程中跑通确定性。' },
            { is_correct: false, verdict: '【形式主义】代码量与复杂度绝不是衡量的标尺', rationale: '优秀的 MVD 往往只有几百行极简胶水代码，却能一击切中核心流程卡点。' },
            { is_correct: false, verdict: '【层级偏见】MVD 必须横跨基层操作工与高层决策者', rationale: 'MVD 的价值在于基层业务用得顺、高层汇报算得清账，绝非单一对象的玩具。' },
            { is_correct: false, verdict: '【概念混淆】忽视了 MVD 击穿生产真实性的本质跃迁', rationale: 'Demo 无法验证权限、内网连通性与脏数据抗性，两者有本质代差。' }
        ]
    },
    7: {
        trap: '人身依附与关系营销惯性 (Personal Dependency Fallacy)',
        option_explanations: [
            { is_correct: false, verdict: '【业余死穴】试图用私人小道逢迎替代硬核商业价值', rationale: '企业高管变动是常态，私人关系脆弱且涉及合规廉洁红线，新高管对前任的私人遗留往往更加戒备。' },
            { is_correct: true, verdict: '【破局利器】用无可辩驳的财务数据与基层依赖筑起护城河', rationale: '准备详实的量化业务回顾（QBR），证明系统挽回的真金白银并展现基层不可逆的刚需，新高管不仅不敢停，还要将其包装为自己的政绩。' },
            { is_correct: false, verdict: '【自绝生路】消极摆烂直接坐实项目可有可无', rationale: '一旦停更，新高管会迅速顺理成章地将项目裁撤，前功尽弃。' },
            { is_correct: false, verdict: '【逃跑主义】在未经验证前直接撤退造成沉没损失', rationale: '轻易放弃将给公司品牌造成巨大商誉损失，更失去了一次在危机中转化为新高管信任的绝佳战役。' }
        ]
    },
    8: {
        trap: '自主 Agent 永动机幻觉 (Autonomous Runaway Delusion)',
        option_explanations: [
            { is_correct: false, verdict: '【表面理解】误将核心鲁棒性设计归因为细枝末节', rationale: '电费微不足道，真正致命的是失控调用对资金和下游生产系统的瞬时打崩。' },
            { is_correct: true, verdict: '【防线核心】防止死循环调用导致的账单失控与下游雪崩', rationale: 'Agent 在遇到工具偶发异常或解析死胡同时容易陷入无尽自循环，必须在代码层设置硬性 max_turns 和 Token 熔断器。' },
            { is_correct: false, verdict: '【常识错误】大模型 API 并无此类固定限制', rationale: '官方接口不会替你预知业务逻辑是否死锁，主动熔断必须由工程师在客户端严密构建。' },
            { is_correct: false, verdict: '【危险侥幸】无防御意识的裸奔是生产事故之源', rationale: '在无人值守的生产夜间批量任务中，缺乏熔断将带来几十万元的账单刺客与下游接口瘫痪。' }
        ]
    },
    9: {
        trap: '传统软件 SaaS 席位惯性 (Per-Seat Pricing Anachronism)',
        option_explanations: [
            { is_correct: false, verdict: '【商务误区】按年续费是普遍商业契约而非核心冲突', rationale: '客户对按年续费并无天然排斥，矛盾根源在于价值产出与计费基准的背离。' },
            { is_correct: true, verdict: '【经济学规律】AI 人效提升与按人头收费产生根本利益冲突', rationale: 'AI 的核心价值在于提升效率、精简人力；如果按席位收费，客户人效越高、人手越少，软件商收入反而越低，双方利益直接对立。' },
            { is_correct: false, verdict: '【成本转移】API 降价属于供应商边际成本变化', rationale: '推理成本下降反而是服务商提升毛利的契机，并非阻碍席位制的经济学动力。' },
            { is_correct: false, verdict: '【荒谬借口】发票开具完全不构成商业模式限制', rationale: '任何合法定价模式均能开具有效税务发票，这与商业定价逻辑无关。' }
        ]
    },
    10: {
        trap: '外包工时与人力外派陷阱 (Body Shopping Mirage)',
        option_explanations: [
            { is_correct: false, verdict: '【语言偏见】编程语言只是实现载体而非模式本质', rationale: 'Python 还是 Java 完全取决于技术栈契合度，绝非外包与咨询的判定分界。' },
            { is_correct: true, verdict: '【飞轮本质】向总部核心平台反哺共性，现场定制递减率持续上升', rationale: '高级外包是用人头堆定制赚取工时费，真正的 FDE 是在踩坑中提炼共性资产反哺 HQ，使得新客户交付成本越来越低、速度越来越快。' },
            { is_correct: false, verdict: '【唯金额论】大额合同依然可能是高级卖人头外包', rationale: '几千万元的人力派驻合同依然是外包，缺乏资产沉淀与飞轮效应迟早陷入利润泥潭。' },
            { is_correct: false, verdict: '【细枝末节】差旅标准只是公司行政政策', rationale: '福利待遇与商业模式进化没有任何因果关联。' }
        ]
    }
};

// 3. PBL 多回合分支沙盘扩展数据 (PBL Multi-Turn Scenarios)
const PBL_MULTI_TURN_DATA = {
    'pbl-1': {
        turn2: {
            1: {
                stage: '第 2 回合：次日核心扫描样本实测困境',
                dilemma: '昨晚拿到的 30 份样本中有 8 份存在强烈反光折痕和红色印章遮挡文字，原生 Vision 模型 OCR 提取准确率仅 62%。行方分管行长周五上午将亲自视察验收，只剩 48 小时。',
                choices: [
                    {
                        text: 'A. 构建两阶段处理流：本地轻量分割掩膜抹除印章背景干扰，再送入微调 OCR，并将低置信度字段标红待人工确认',
                        status: 'SUCCESS',
                        trust: 35,
                        delay: 0,
                        outcome: '✅ 架构胜出：关键单据准确率飙升至 94%，带置信度红框高亮深得行长赞赏，行方当场签署一期验证协议！'
                    },
                    {
                        text: 'B. 向行方强调这是输入数据质量不合格，要求合规组把 8 份发票全部重新手工复印并录入系统',
                        status: 'FAIL',
                        trust: -25,
                        delay: 7,
                        outcome: '❌ 现场对立：业务科长指责系统甚至不如老旧扫描仪，交付停滞陷入推诿扯皮。'
                    },
                    {
                        text: 'C. 现场通宵在本地写死这 8 份发票的特定坐标规则做演示',
                        status: 'FAIL',
                        trust: -35,
                        delay: 0,
                        outcome: '⚠️ 虚假繁荣：行长演示时随机抽了第 9 份真实发票测试当场白屏错位，行长严厉批评后取消立项。'
                    }
                ]
            },
            0: {
                stage: '第 2 回合（危机挽救）：立项冻结下的绝境自愈',
                dilemma: '安全委员会驳回了白名单申请并冻结项目。行方对接人私下约你在茶水间沟通：下周行长要听进展汇报，是否有不违背机房合规底线的补救方案？',
                choices: [
                    {
                        text: 'A. 提出单向光闸脱敏摆渡方案，签署数据严禁出内网连带责任状，以最小 30 份样本先行在离线隔离网验证',
                        status: 'SUCCESS',
                        trust: 30,
                        delay: 7,
                        outcome: '✅ 绝境自愈：对接人带你面见合规处长，合规处破例准许内网闭环测试，挽救项目生命！'
                    },
                    {
                        text: 'B. 坚称公网白名单是行业惯例，让对接人想办法找主管副行长强行批条子',
                        status: 'FAIL',
                        trust: -40,
                        delay: 28,
                        outcome: '❌ 彻底破局：对接人被合规委员会深度问责，项目直接被清退出场。'
                    }
                ]
            },
            2: {
                stage: '第 2 回合（危机挽救）：玩具 Demo 崩塌后的信任重建',
                dilemma: '被总监评价为“只能活在理想环境的玩具”后，全场陷入尴尬冷场。你该如何当场挽回局面？',
                choices: [
                    {
                        text: 'A. 立即承认合成数据与真实场景的断层，现场请业务骨干提供 3 张真实折角发票，当面进行特征降维与规则补齐',
                        status: 'SUCCESS',
                        trust: 25,
                        delay: 2,
                        outcome: '✅ 现场救火：2小时内快速调试挽回尊重，总监认可工程师的现场排障抗压能力。'
                    },
                    {
                        text: 'B. 辩解称折角发票属于物理损坏异常数据，不在算法标准承诺范围内',
                        status: 'FAIL',
                        trust: -30,
                        delay: 14,
                        outcome: '❌ 信任崩盘：总监直接离席，项目直接转入无限期冻结。'
                    }
                ]
            }
        }
    }
};

// 4. 应用主初始化流程
function initApp() {
    loadCompletedProgress();
    loadQuizAnswers();
    loadTheme();
    loadSidebarCollapseState();
    loadPblTurnState();
    renderSidebar();
    
    // 初始化路由与深链
    handleInitialRouting();
    if (typeof window !== 'undefined') {
        window.addEventListener('hashchange', handleHashRouting);
    }

    bindGlobalEvents();
    initSpotlight();
}

// 5. 键盘焦点卫士 (Strict Keyboard Focus Guard)
function isTypingActive() {
    if (typeof document === 'undefined') return false;
    const el = document.activeElement;
    if (!el) return false;
    const tag = (el.tagName || '').toUpperCase();
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return true;
    if (el.isContentEditable) return true;
    if (typeof el.getAttribute === 'function' && el.getAttribute('contenteditable') === 'true') return true;
    return false;
}

// 6. 侧边栏手风琴折叠状态持久化
function loadSidebarCollapseState() {
    try {
        if (typeof localStorage === 'undefined') return;
        const saved = localStorage.getItem('fde_hub_sidebar_collapsed');
        if (saved) {
            const arr = JSON.parse(saved);
            collapsedModules = new Set(Array.isArray(arr) ? arr : []);
        }
    } catch (e) {
        collapsedModules = new Set();
    }
}

function saveSidebarCollapseState() {
    try {
        if (typeof localStorage === 'undefined') return;
        localStorage.setItem('fde_hub_sidebar_collapsed', JSON.stringify(Array.from(collapsedModules)));
    } catch (e) {
        console.error("保存侧边栏折叠状态失败", e);
    }
}

function toggleModuleCollapse(modId) {
    if (collapsedModules.has(modId)) {
        collapsedModules.delete(modId);
    } else {
        collapsedModules.add(modId);
    }
    saveSidebarCollapseState();
    renderSidebar(currentSearchQuery);
}

// 7. 渲染侧边栏手风琴树 (支持折叠持久化与全字段检索)
function renderSidebar(filterQuery = '') {
    currentSearchQuery = filterQuery;
    const navContainer = document.getElementById('sidebar-nav');
    if (!navContainer) return;

    let html = '';
    const q = (filterQuery || '').trim().toLowerCase();

    FDE_ALL_DATA.modules.forEach((mod, mIdx) => {
        let matchingItems = [];
        mod.items.forEach((item, iIdx) => {
            const contentPlainText = item.content ? item.content.replace(/<[^>]+>/g, ' ').toLowerCase() : '';
            const refsPlainText = (item.refs && Array.isArray(item.refs)) ? item.refs.map(r => (r.title + ' ' + (r.note || ''))).join(' ').toLowerCase() : '';
            
            // 检索匹配：支持普通搜索与特殊正则字符安全匹配
            const match = !q || 
                          item.title.toLowerCase().includes(q) || 
                          item.summary.toLowerCase().includes(q) ||
                          contentPlainText.includes(q) ||
                          refsPlainText.includes(q);

            if (match) {
                matchingItems.push({ item, iIdx });
            }
        });

        if (matchingItems.length > 0) {
            // 当处于检索模式时，强制展开匹配的模块；否则遵循持久化折叠状态
            const isCollapsed = q ? false : collapsedModules.has(mod.id);

            html += `
            <div class="nav-module-block" data-module-id="${mod.id}">
                <button class="nav-module-header nav-module-title" aria-expanded="${!isCollapsed}" onclick="toggleModuleCollapse('${mod.id}')">
                    <div class="nav-module-title-group">
                        <span class="nav-chevron ${isCollapsed ? 'collapsed' : ''}">▾</span>
                        <span class="nav-module-title-text">${mod.title}</span>
                    </div>
                    <span class="brand-badge">${mod.badge}</span>
                </button>
                <div class="nav-module-items ${isCollapsed ? 'collapsed' : ''}" style="${isCollapsed ? 'display: none;' : ''}">
                    ${matchingItems.map(({ item, iIdx }) => {
                        const isActive = (mIdx === currentModuleIndex && iIdx === currentItemIndex);
                        const isCompleted = completedItems.has(item.id);
                        return `
                        <a href="#${item.id}" class="nav-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}" 
                           onclick="event.preventDefault(); loadSection(${mIdx}, ${iIdx});">
                            <span class="item-title">${item.title}</span>
                            <span class="item-status-icon">${isCompleted ? '✓' : '○'}</span>
                        </a>`;
                    }).join('')}
                </div>
            </div>`;
        }
    });

    if (!html && q) {
        html = `<div style="padding: 1rem; color: var(--text-muted); font-size: 0.82rem; text-align: center;">未找到匹配的知识或代码片段</div>`;
    }

    navContainer.innerHTML = html;
}

// 8. 路由与深链 (Hash Routing & Deep Linking)
function handleInitialRouting() {
    if (typeof window === 'undefined') return;
    const hash = (window.location.hash || '').replace('#', '').trim();
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
    if (typeof window === 'undefined') return;
    const hash = (window.location.hash || '').replace('#', '').trim();
    if (!hash) return;
    const target = findSectionByItemId(hash);
    if (target) {
        if (target.mIdx !== currentModuleIndex || target.iIdx !== currentItemIndex) {
            loadSection(target.mIdx, target.iIdx, false);
        }
    }
}

function findSectionByItemId(itemId) {
    if (!FDE_ALL_DATA || !FDE_ALL_DATA.modules) return null;
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

// 9. 学习打卡进度与持久化 (严格过滤 stale ID，100% 准确复原)
function loadCompletedProgress() {
    try {
        if (typeof localStorage === 'undefined') return;
        const saved = localStorage.getItem('fde_hub_completed');
        if (saved) {
            const rawList = JSON.parse(saved);
            if (Array.isArray(rawList)) {
                const validList = rawList.filter(id => findSectionByItemId(id));
                completedItems = new Set(validList);
            } else {
                completedItems = new Set();
            }
        }
    } catch (e) {
        completedItems = new Set();
    }
    updateProgressUI();
}

function saveCompletedProgress() {
    try {
        if (typeof localStorage === 'undefined') return;
        localStorage.setItem('fde_hub_completed', JSON.stringify(Array.from(completedItems)));
    } catch (e) {
        console.error("保存学习打卡进度失败", e);
    }
    updateProgressUI();
    renderSidebar(currentSearchQuery);
    
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
    if (FDE_ALL_DATA && FDE_ALL_DATA.modules) {
        FDE_ALL_DATA.modules.forEach(m => {
            totalItems += m.items.length;
        });
    }
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

// 10. 测验答案持久化
function loadQuizAnswers() {
    try {
        if (typeof localStorage === 'undefined') return;
        const saved = localStorage.getItem('fde_hub_quiz');
        if (saved) {
            const parsed = JSON.parse(saved);
            quizAnswersState = (parsed && typeof parsed === 'object') ? parsed : {};
        }
    } catch (e) {
        quizAnswersState = {};
    }
}

function saveQuizAnswers() {
    try {
        if (typeof localStorage === 'undefined') return;
        localStorage.setItem('fde_hub_quiz', JSON.stringify(quizAnswersState));
    } catch (e) {
        console.error("保存测验答案失败", e);
    }
}

// 11. 主题切换
function loadTheme() {
    if (typeof localStorage === 'undefined') return;
    const theme = localStorage.getItem('fde_hub_theme') || 'dark';
    if (document.documentElement) {
        document.documentElement.setAttribute('data-theme', theme);
    }
    updateThemeButtonUI(theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('fde_hub_theme', next);
    }
    updateThemeButtonUI(next);
}

function updateThemeButtonUI(theme) {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.innerHTML = theme === 'dark' ? '☀️ 明亮模式' : '🌙 暗黑模式';
    }
}

// 11.5 移动端侧边栏抽屉与遮罩控制器 (Mobile Drawer & Backdrop Controller)
function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    if (typeof document !== 'undefined' && document.body && document.body.classList) {
        document.body.classList.add('sidebar-open');
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    if (typeof document !== 'undefined' && document.body && document.body.classList) {
        document.body.classList.remove('sidebar-open');
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('open')) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

function scrollToTop() {
    if (typeof window !== 'undefined' && window.scrollTo) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// 12. 加载章节与动态增强 (Auto-expand module, pulse animation & tool binding)
function loadSection(mIdx, iIdx, updateHash = true) {
    currentModuleIndex = mIdx;
    currentItemIndex = iIdx;

    const mod = FDE_ALL_DATA.modules[mIdx];
    const item = mod.items[iIdx];

    // 交互优化：自动展开当前激活章节所属的模块
    if (collapsedModules.has(mod.id)) {
        collapsedModules.delete(mod.id);
        saveSidebarCollapseState();
    }

    if (updateHash && typeof history !== 'undefined' && history.pushState) {
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
        contentMount.innerHTML = item.content || '';

        // 结构化文献引用页脚 (Card-based refs footer with standardized citations)
        if (item.refs && item.refs.length > 0) {
            contentMount.insertAdjacentHTML('beforeend', `
                <footer class="refs-footer" aria-label="权威文献与一手来源索引">
                    <div class="refs-title">📚 权威文献与一手来源索引 (Authoritative Citations & Literature)</div>
                    <div class="refs-cards-grid">
                        ${item.refs.map((r, idx) => `
                            <div class="ref-card" id="ref-${idx + 1}" tabindex="-1">
                                <div class="ref-card-header">
                                    <span class="ref-index">[${idx + 1}]</span>
                                    ${r.badge ? `<span class="badge blue ref-badge">${r.badge}</span>` : ''}
                                    <a href="${r.url}" target="_blank" rel="noopener noreferrer" class="ref-link">
                                        <span class="ref-title">${r.title}</span>
                                        <span class="ref-arrow">↗</span>
                                    </a>
                                </div>
                                ${r.note ? `<p class="ref-note">${r.note}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                    <ul class="refs-list" style="display: none;">
                        ${item.refs.map((r, idx) => `<li><a href="${r.url}" target="_blank" rel="noopener noreferrer">[${idx + 1}] ${r.title} ↗</a></li>`).join('')}
                    </ul>
                </footer>
            `);
        }
    }

    // 动态挂载与增强特殊组件
    if (document.getElementById('quiz-mount-point')) {
        renderQuizzes();
    }
    if (document.getElementById('dashboard-mount-point')) {
        renderDashboard();
    }

    // 针对交互计算器 (m-calc) 挂载反应式双向滑块引擎
    if (item.id === 'm-calc') {
        initCoIEngine();
    }

    // 针对 SOW / Air-Gap 双清单 (m-checklist) 挂载防波堤量规与风险分级
    if (item.id === 'm-checklist') {
        enhanceChecklistSection();
    }

    // 针对原生 Agent 状态机与安全熔断 (eng-1) 挂载交互式飞行演练舱
    if (item.id === 'eng-1') {
        initAgentSimulator();
    }

    // 恢复清单勾选状态
    restoreChecklistStates();

    // 恢复 PBL 决策沙盘状态
    restorePblStates();

    // 重新高亮导航
    renderSidebar(currentSearchQuery);

    // 移动端收起侧边栏并关闭遮罩
    closeSidebar();

    // 平滑滚动回顶部
    if (typeof window !== 'undefined' && window.scrollTo) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

// 13. 全局扁平章节列表获取与键盘跳转
function getAllFlatSections() {
    const list = [];
    if (!FDE_ALL_DATA || !FDE_ALL_DATA.modules) return list;
    FDE_ALL_DATA.modules.forEach((mod, mIdx) => {
        mod.items.forEach((item, iIdx) => {
            list.push({ mIdx, iIdx, item });
        });
    });
    return list;
}

function navigateToAdjacentSection(direction) {
    const flat = getAllFlatSections();
    const currentFlatIdx = flat.findIndex(s => s.mIdx === currentModuleIndex && s.iIdx === currentItemIndex);
    if (currentFlatIdx === -1) return;
    const targetIdx = currentFlatIdx + direction;
    if (targetIdx >= 0 && targetIdx < flat.length) {
        const next = flat[targetIdx];
        loadSection(next.mIdx, next.iIdx);
    }
}

// 14. 事件绑定 (全局键盘分发器与焦点保护)
function bindGlobalEvents() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderSidebar(e.target.value);
        });
        searchInput.addEventListener('focus', () => {
            // 在侧边栏搜索框聚焦时也可一键呼出全局 Spotlight
        });
    }

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }

    const menuBtn = document.getElementById('menu-toggle');
    if (menuBtn) {
        menuBtn.addEventListener('click', toggleSidebar);
    }

    const closeBtn = document.getElementById('sidebar-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeSidebar);
    }

    const backdrop = document.getElementById('sidebar-backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', closeSidebar);
    }

    const trafficRed = document.getElementById('traffic-light-red');
    if (trafficRed) {
        trafficRed.addEventListener('click', closeSidebar);
    }

    // 移动端“回到顶部”浮钮滚动显示控制
    if (typeof window !== 'undefined') {
        window.addEventListener('scroll', () => {
            const btn = document.getElementById('back-to-top-btn');
            if (btn) {
                if (window.scrollY > 280) {
                    btn.classList.remove('hidden');
                } else {
                    btn.classList.add('hidden');
                }
            }
        }, { passive: true });
    }

    // 行内引用角标点击联动 (Inline Citation Reference Click & Glow Pulse)
    if (typeof document !== 'undefined') {
        document.addEventListener('click', (e) => {
            const citeLink = e.target.closest('.citation-ref');
            if (citeLink) {
                const href = citeLink.getAttribute('href');
                if (href && href.startsWith('#ref-')) {
                    const targetId = href.substring(1);
                    const targetCard = document.getElementById(targetId);
                    if (targetCard) {
                        e.preventDefault();
                        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        targetCard.classList.remove('highlight-pulse');
                        void targetCard.offsetWidth; // 触发 reflow 重启动画
                        targetCard.classList.add('highlight-pulse');
                        targetCard.focus({ preventScroll: true });
                    }
                }
            }
        });
    }

    // 全局快捷键监听 (Strict Keyboard Focus Guard)
    if (typeof window !== 'undefined') {
        window.addEventListener('keydown', (e) => {
            // 1. 快捷键呼出/切换 Spotlight (Cmd+K / Ctrl+K)
            if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
                e.preventDefault();
                if (isSpotlightOpen()) {
                    closeSpotlight();
                } else {
                    openSpotlight();
                }
                return;
            }

            // 2. Spotlight 模态框打开时的键盘接管
            if (isSpotlightOpen()) {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    closeSpotlight();
                    return;
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    navigateSpotlight(1);
                    return;
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    navigateSpotlight(-1);
                    return;
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    selectSpotlightResult(activeSpotlightIndex);
                    return;
                }
                return;
            } else if (e.key === 'Escape') {
                const sidebar = document.getElementById('sidebar');
                if (sidebar && sidebar.classList.contains('open')) {
                    e.preventDefault();
                    closeSidebar();
                    return;
                }
            }

            // 3. 严格输入焦点守护：当用户正在任何输入框、文本区或滑块中输入时，绝不劫持键盘按键！
            if (isTypingActive()) {
                return;
            }

            // 4. 普通阅读视图下的全局快捷键
            if (e.key === 'j' || ((e.metaKey || e.ctrlKey) && e.key === 'ArrowRight')) {
                e.preventDefault();
                navigateToAdjacentSection(1);
            } else if (e.key === 'k' || ((e.metaKey || e.ctrlKey) && e.key === 'ArrowLeft')) {
                e.preventDefault();
                navigateToAdjacentSection(-1);
            }
        });
    }
}

// 15. Spotlight 快速检索控制器
function initSpotlight() {
    const input = document.getElementById('spotlight-input');
    if (input) {
        input.addEventListener('input', (e) => {
            executeSpotlightSearch(e.target.value);
        });
    }
}

function isSpotlightOpen() {
    const overlay = document.getElementById('spotlight-overlay');
    return overlay && !overlay.classList.contains('hidden');
}

function openSpotlight() {
    const overlay = document.getElementById('spotlight-overlay');
    const input = document.getElementById('spotlight-input');
    if (overlay) {
        overlay.classList.remove('hidden');
    }
    if (input) {
        input.value = '';
        input.focus();
        executeSpotlightSearch('');
    }
}

function closeSpotlight() {
    const overlay = document.getElementById('spotlight-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function highlightMatch(text, query) {
    if (!text) return '';
    const cleanText = escapeHtml(text);
    if (!query || !query.trim()) return cleanText;
    const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return cleanText.replace(regex, '<mark class="spotlight-mark">$1</mark>');
}

function executeSpotlightSearch(query) {
    const resultsContainer = document.getElementById('spotlight-results');
    if (!resultsContainer) return;

    const q = (query || '').trim().toLowerCase();
    activeSpotlightIndex = 0;
    currentSpotlightResults = [];

    // 遍历所有章节进行全文多维度评分检索
    FDE_ALL_DATA.modules.forEach((mod, mIdx) => {
        mod.items.forEach((item, iIdx) => {
            const contentClean = (item.content || '').replace(/<[^>]+>/g, ' ');
            const titleLower = item.title.toLowerCase();
            const summaryLower = item.summary.toLowerCase();
            const contentLower = contentClean.toLowerCase();
            
            let matchScore = 0;
            let snippet = item.summary;

            if (!q) {
                // 空搜索展示精选目录推荐
                matchScore = 1;
            } else {
                if (titleLower.includes(q)) {
                    matchScore += 100;
                }
                if (summaryLower.includes(q)) {
                    matchScore += 40;
                }
                if (contentLower.includes(q)) {
                    matchScore += 10;
                    // 提取命中关键字附近的文字摘要
                    const pos = contentLower.indexOf(q);
                    const start = Math.max(0, pos - 24);
                    const end = Math.min(contentClean.length, pos + q.length + 36);
                    snippet = '...' + contentClean.substring(start, end).trim() + '...';
                }
                if (item.refs && Array.isArray(item.refs)) {
                    item.refs.forEach(r => {
                        if (r.title.toLowerCase().includes(q) || (r.note && r.note.toLowerCase().includes(q))) {
                            matchScore += 15;
                            snippet = `[权威出处] ${r.title}`;
                        }
                    });
                }
            }

            if (matchScore > 0) {
                currentSpotlightResults.push({
                    mIdx,
                    iIdx,
                    id: item.id,
                    title: item.title,
                    summary: snippet,
                    badge: mod.badge,
                    score: matchScore
                });
            }
        });
    });

    // 按匹配评分降序排序
    if (q) {
        currentSpotlightResults.sort((a, b) => b.score - a.score);
    }

    renderSpotlightResults(q);
}

function renderSpotlightResults(q) {
    const resultsContainer = document.getElementById('spotlight-results');
    if (!resultsContainer) return;

    if (currentSpotlightResults.length === 0) {
        resultsContainer.innerHTML = `<div class="spotlight-empty">未搜索到包含 “${escapeHtml(q)}” 的章节或代码，尝试其他关键词</div>`;
        return;
    }

    const html = currentSpotlightResults.slice(0, 12).map((res, idx) => `
        <div class="spotlight-item ${idx === activeSpotlightIndex ? 'active' : ''}" 
             data-index="${idx}" 
             onclick="selectSpotlightResult(${idx})"
             onmouseenter="setSpotlightActive(${idx})">
            <span class="spotlight-item-badge">${res.badge}</span>
            <div class="spotlight-item-content">
                <div class="spotlight-item-title">${highlightMatch(res.title, q)}</div>
                <div class="spotlight-item-snippet">${highlightMatch(res.summary, q)}</div>
            </div>
            <span class="spotlight-enter-hint">↵</span>
        </div>
    `).join('');

    resultsContainer.innerHTML = html;
}

function setSpotlightActive(idx) {
    activeSpotlightIndex = idx;
    const items = document.querySelectorAll('.spotlight-item');
    items.forEach((item, i) => {
        if (i === idx) item.classList.add('active');
        else item.classList.remove('active');
    });
}

function navigateSpotlight(delta) {
    const total = Math.min(currentSpotlightResults.length, 12);
    if (total === 0) return;
    activeSpotlightIndex = (activeSpotlightIndex + delta + total) % total;
    setSpotlightActive(activeSpotlightIndex);
    
    const activeEl = document.querySelector(`.spotlight-item[data-index="${activeSpotlightIndex}"]`);
    if (activeEl && activeEl.scrollIntoView) {
        activeEl.scrollIntoView({ block: 'nearest' });
    }
}

function selectSpotlightResult(idx) {
    const res = currentSpotlightResults[idx];
    if (!res) return;

    closeSpotlight();
    loadSection(res.mIdx, res.iIdx);

    // 触发平滑滚动与目标微光脉冲动画 (Pulse Highlight)
    setTimeout(() => {
        const header = document.getElementById('section-header-mount');
        if (header) {
            header.classList.remove('pulse-highlight');
            void header.offsetWidth; // 触发 reflow
            header.classList.add('pulse-highlight');
            setTimeout(() => {
                header.classList.remove('pulse-highlight');
            }, 1600);
        }
    }, 100);
}

// 16. 反应式 CoI 财务计算器 (Dual Range Sliders, 60fps rAF & Executive Memo Export)
function initCoIEngine() {
    const card = document.querySelector('.calculator-card');
    if (!card) return;

    // 注入双向滑块与自定义自动化率滑块（若尚未存在）
    let customSliderBlock = document.getElementById('coi-sliders-enhanced-mount');
    if (!customSliderBlock) {
        const grid = card.querySelector('.calc-grid');
        if (grid) {
            // 为已有输入框增强双向绑定滑块
            const staffInput = document.getElementById('coi_staff');
            const salaryInput = document.getElementById('coi_salary');
            const pctInput = document.getElementById('coi_pct');
            const lossInput = document.getElementById('coi_loss');

            if (staffInput && !document.getElementById('coi_staff_slider')) {
                const staffRow = document.createElement('div');
                staffRow.className = 'slider-row';
                staffRow.innerHTML = `<input type="range" class="coi-range-slider" id="coi_staff_slider" min="1" max="200" value="${staffInput.value || 30}">`;
                staffInput.parentNode.appendChild(staffRow);
            }

            if (salaryInput && !document.getElementById('coi_salary_slider')) {
                const salaryRow = document.createElement('div');
                salaryRow.className = 'slider-row';
                salaryRow.innerHTML = `<input type="range" class="coi-range-slider" id="coi_salary_slider" min="3000" max="100000" step="1000" value="${salaryInput.value || 16000}">`;
                salaryInput.parentNode.appendChild(salaryRow);
            }

            if (pctInput && !document.getElementById('coi_pct_slider')) {
                const pctRow = document.createElement('div');
                pctRow.className = 'slider-row';
                pctRow.innerHTML = `<input type="range" class="coi-range-slider" id="coi_pct_slider" min="5" max="100" value="${pctInput.value || 45}">`;
                pctInput.parentNode.appendChild(pctRow);
            }

            if (lossInput && !document.getElementById('coi_loss_slider')) {
                const lossRow = document.createElement('div');
                lossRow.className = 'slider-row';
                lossRow.innerHTML = `<input type="range" class="coi-range-slider" id="coi_loss_slider" min="0" max="500" step="5" value="${lossInput.value || 80}">`;
                lossInput.parentNode.appendChild(lossRow);
            }

            // 增加自定义自动化直通率 (STP) 滑块
            if (!document.getElementById('coi_automation')) {
                const autoField = document.createElement('div');
                autoField.className = 'calc-field';
                autoField.id = 'coi-sliders-enhanced-mount';
                autoField.innerHTML = `
                    <label>预估自动化直通率 STP (保守基线 85%，可调 50%~95%)：<span id="coi_auto_badge" style="color:var(--apple-blue); font-weight:700;">85%</span></label>
                    <div class="slider-row">
                        <input type="range" class="coi-range-slider" id="coi_automation" min="50" max="95" step="1" value="85">
                    </div>
                `;
                grid.appendChild(autoField);
            }
        }

        // 注入“重置”与“复制高管汇报”按钮条
        let btnBar = document.getElementById('coi-actions-bar');
        if (!btnBar) {
            btnBar = document.createElement('div');
            btnBar.id = 'coi-actions-bar';
            btnBar.className = 'coi-button-bar';
            btnBar.innerHTML = `
                <button class="coi-secondary-btn" onclick="resetCoIDefaults()">🔄 重置预设值</button>
                <button class="coi-secondary-btn" onclick="copyExecutiveMemo()">📋 复制高管汇报摘要</button>
            `;
            const mainActionBtn = card.querySelector('.action-btn');
            if (mainActionBtn) {
                if (mainActionBtn.insertAdjacentElement) {
                    mainActionBtn.insertAdjacentElement('afterend', btnBar);
                } else if (mainActionBtn.parentNode) {
                    mainActionBtn.parentNode.appendChild(btnBar);
                }
            }
        }
    }

    // 绑定 60fps 反应式同步监听
    const bindSync = (numId, sliderId) => {
        const num = document.getElementById(numId);
        const slider = document.getElementById(sliderId);
        if (!num || !slider) return;

        num.addEventListener('input', () => {
            slider.value = num.value;
            requestCoICalculation();
        });
        slider.addEventListener('input', () => {
            num.value = slider.value;
            requestCoICalculation();
        });
    };

    bindSync('coi_staff', 'coi_staff_slider');
    bindSync('coi_salary', 'coi_salary_slider');
    bindSync('coi_pct', 'coi_pct_slider');
    bindSync('coi_loss', 'coi_loss_slider');

    const autoSlider = document.getElementById('coi_automation');
    if (autoSlider) {
        autoSlider.addEventListener('input', (e) => {
            const badge = document.getElementById('coi_auto_badge');
            if (badge) badge.textContent = `${e.target.value}%`;
            requestCoICalculation();
        });
    }
}

let coiRafId = null;
function requestCoICalculation() {
    if (coiRafId && typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(coiRafId);
    }
    if (typeof requestAnimationFrame !== 'undefined') {
        coiRafId = requestAnimationFrame(() => {
            executeCoICalculation();
        });
    } else {
        executeCoICalculation();
    }
}

function executeCoICalculation() {
    if (typeof window !== 'undefined') window.executeCoICalculation = executeCoICalculation;
    const staff = parseFloat(document.getElementById('coi_staff')?.value) || 0;
    const salary = parseFloat(document.getElementById('coi_salary')?.value) || 0;
    const pct = parseFloat(document.getElementById('coi_pct')?.value) || 0;
    const loss = parseFloat(document.getElementById('coi_loss')?.value) || 0;
    const autoRate = parseFloat(document.getElementById('coi_automation')?.value) || 85;

    // 月度人工机械浪费 = 人数 * 月薪 * (浪费工时比率 / 100)
    const monthlyWaste = staff * salary * (pct / 100);
    // 月度因错损失 = (年度直接损失 * 10000) / 12
    const monthlyLoss = (loss * 10000) / 12;
    // 综合月度不作为成本 (CoI)
    const monthlyCoI = monthlyWaste + monthlyLoss;
    // 首年净释放商业价值 = (月度 CoI * 12) * 自动化直通率系数
    const annualNetGain = (monthlyCoI * 12) * (autoRate / 100);

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

function resetCoIDefaults() {
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val;
    };
    setVal('coi_staff', 30);
    setVal('coi_staff_slider', 30);
    setVal('coi_salary', 16000);
    setVal('coi_salary_slider', 16000);
    setVal('coi_pct', 45);
    setVal('coi_pct_slider', 45);
    setVal('coi_loss', 80);
    setVal('coi_loss_slider', 80);
    setVal('coi_automation', 85);
    const badge = document.getElementById('coi_auto_badge');
    if (badge) badge.textContent = '85%';

    executeCoICalculation();
    showToast("已恢复 CoI 计算器基准预设值 (STP 85%)");
}

function copyExecutiveMemo() {
    const staff = document.getElementById('coi_staff')?.value || 30;
    const salary = document.getElementById('coi_salary')?.value || 16000;
    const pct = document.getElementById('coi_pct')?.value || 45;
    const loss = document.getElementById('coi_loss')?.value || 80;
    const autoRate = document.getElementById('coi_automation')?.value || 85;
    const wasteText = document.getElementById('val_waste_monthly')?.textContent || '¥216,000';
    const coiText = document.getElementById('val_coi_monthly')?.textContent || '¥282,667';
    const gainText = document.getElementById('val_annual_gain')?.textContent || '¥2,883,200';

    const memo = `【FDE 商业汇报备忘录 | Cost of Inaction (CoI) 财务推演】
--------------------------------------------------
■ 核心参数输入：
- 专职处理员工数：${staff} 人
- 员工平均综合月薪：¥${salary}/月
- 重复低效事务耗时占比：${pct}%
- 历史年度违约/罚款/漏损：¥${loss} 万元
- 工业级直通率 (STP) 评估基线：${autoRate}% (扣除 15% 人机协同兜底)

■ 财务测算结论：
- 每月纯低效人力沉没成本：${wasteText}
- 企业每拖延 1 个月的不作为损失 (CoI)：${coiText}
- 首年预计净释放商业价值：${gainText}

■ 建议谈判话术：
“项目每推迟进场 1 个月，企业在此流程上的直接现金流消耗与潜在漏损就达到 ${coiText}。启动 48 小时 MVD 验证不存在财务下行风险，却能立竿见影实现流程止血与人效倍增。”
--------------------------------------------------
生成时间：${new Date().toLocaleString('zh-CN')}`;

    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(memo).then(() => {
            showToast("已复制高管汇报摘要至剪贴板! ✓");
        }).catch(() => {
            showToast("复制失败，请手动选取文本");
        });
    } else {
        showToast("已生成汇报备忘录");
    }
}

// 17. SOW 需求边界与 Air-Gap 防御清单及动态量规
function enhanceChecklistSection() {
    const panels = document.querySelectorAll('.checklist-panel');
    if (panels.length >= 2) {
        const sowPanel = panels[0];
        const airgapPanel = panels[1];

        // SOW 风险标签注入
        const sowBadges = {
            'sow_input_format': '<span class="risk-tier-badge blocker">[BLOCKER]</span>',
            'sow_acceptance_criteria': '<span class="risk-tier-badge critical">[CRITICAL]</span>',
            'sow_phase2_pool': '<span class="risk-tier-badge highrisk">[HIGH RISK]</span>',
            'sow_deadline': '<span class="risk-tier-badge advisory">[ADVISORY]</span>'
        };
        sowPanel.querySelectorAll('input[type="checkbox"][data-check-key]').forEach(cb => {
            const key = cb.getAttribute('data-check-key');
            if (sowBadges[key] && !cb.parentNode.querySelector('.risk-tier-badge')) {
                cb.insertAdjacentHTML('afterend', sowBadges[key]);
            }
        });

        // Air-gap 4大安全准入网关标签注入
        const airgapBadges = {
            'airgap_telemetry': '<span class="risk-tier-badge blocker">[Gate 1: 零遥测外联]</span>',
            'airgap_weights': '<span class="risk-tier-badge critical">[Gate 2: 本地权重与动态库]</span>',
            'airgap_cdn': '<span class="risk-tier-badge highrisk">[Gate 3: 无公共 CDN/字体]</span>',
            'airgap_usb': '<span class="risk-tier-badge advisory">[Gate 4: 介质杀毒与单向摆渡]</span>'
        };
        airgapPanel.querySelectorAll('input[type="checkbox"][data-check-key]').forEach(cb => {
            const key = cb.getAttribute('data-check-key');
            if (airgapBadges[key] && !cb.parentNode.querySelector('.risk-tier-badge')) {
                cb.insertAdjacentHTML('afterend', airgapBadges[key]);
            }
        });

        // 注入 SOW 动态防御量规
        if (!document.getElementById('sow-defense-gauge')) {
            const sowGauge = document.createElement('div');
            sowGauge.id = 'sow-defense-gauge';
            sowGauge.className = 'defense-gauge-card';
            if (sowPanel.insertBefore) {
                sowPanel.insertBefore(sowGauge, sowPanel.querySelector('.check-group'));
            } else {
                sowPanel.appendChild(sowGauge);
            }
        }

        // 注入 Air-Gap 动态准入量规
        if (!document.getElementById('airgap-readiness-gauge')) {
            const airgapGauge = document.createElement('div');
            airgapGauge.id = 'airgap-readiness-gauge';
            airgapGauge.className = 'defense-gauge-card';
            if (airgapPanel.insertBefore) {
                airgapPanel.insertBefore(airgapGauge, airgapPanel.querySelector('.check-group'));
            } else {
                airgapPanel.appendChild(airgapGauge);
            }
        }

        // 注入一键导出按钮
        if (!sowPanel.querySelector('.sow-export-btn')) {
            const btn = document.createElement('button');
            btn.className = 'coi-secondary-btn sow-export-btn';
            btn.style.marginTop = '0.9rem';
            btn.textContent = '📋 导出 SOW 防御备忘录';
            btn.onclick = exportSowDefenseBrief;
            sowPanel.appendChild(btn);
        }

        if (!airgapPanel.querySelector('.airgap-export-btn')) {
            const btn = document.createElement('button');
            btn.className = 'coi-secondary-btn airgap-export-btn';
            btn.style.marginTop = '0.9rem';
            btn.textContent = '📋 导出 Air-Gap 验收报告';
            btn.onclick = exportAirgapChecklist;
            airgapPanel.appendChild(btn);
        }

        updateChecklistGauges();
    }
}

function updateChecklistGauges() {
    const sowKeys = ['sow_input_format', 'sow_acceptance_criteria', 'sow_phase2_pool', 'sow_deadline'];
    const airgapKeys = ['airgap_telemetry', 'airgap_weights', 'airgap_cdn', 'airgap_usb'];

    let checkMap = {};
    try {
        if (typeof localStorage !== 'undefined') {
            checkMap = JSON.parse(localStorage.getItem('fde_hub_checklist_map') || '{}');
        }
    } catch (e) {
        checkMap = {};
    }

    const sowChecked = sowKeys.filter(k => checkMap[k]).length;
    const sowPct = Math.round((sowChecked / sowKeys.length) * 100);
    const sowGauge = document.getElementById('sow-defense-gauge');
    if (sowGauge) {
        sowGauge.innerHTML = `
            <div class="gauge-header">
                <span>SOW 边界防御等级</span>
                <span style="color: ${sowPct === 100 ? 'var(--apple-green)' : 'var(--apple-orange)'}; font-weight:700;">${sowChecked} / 4 锁定 (${sowPct}%)</span>
            </div>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: ${sowPct}%; background: ${sowPct === 100 ? 'var(--apple-green)' : 'var(--apple-blue)'};"></div>
            </div>
        `;
    }

    const airgapChecked = airgapKeys.filter(k => checkMap[k]).length;
    const airgapPct = Math.round((airgapChecked / airgapKeys.length) * 100);
    const airgapGauge = document.getElementById('airgap-readiness-gauge');
    if (airgapGauge) {
        airgapGauge.innerHTML = `
            <div class="gauge-header">
                <span>Air-Gap 安全准入认证</span>
                <span style="color: ${airgapPct === 100 ? 'var(--apple-green)' : 'var(--apple-red)'}; font-weight:700;">${airgapChecked} / 4 网关通过 (${airgapPct}%)</span>
            </div>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: ${airgapPct}%; background: ${airgapPct === 100 ? 'var(--apple-green)' : 'var(--apple-purple)'};"></div>
            </div>
        `;
    }
}

function restoreChecklistStates() {
    try {
        if (typeof localStorage === 'undefined') return;
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
        updateChecklistGauges();
    } catch (e) {
        console.error("恢复清单勾选状态失败", e);
    }
}

function updateChecklistProgress() {
    if (typeof window !== 'undefined') window.updateChecklistProgress = updateChecklistProgress;
    try {
        let checkMap = {};
        if (typeof localStorage !== 'undefined') {
            const saved = localStorage.getItem('fde_hub_checklist_map');
            if (saved) {
                checkMap = JSON.parse(saved);
            }
        }
        const inputs = document.querySelectorAll('input[type="checkbox"][data-check-key]');
        inputs.forEach(input => {
            const key = input.getAttribute('data-check-key');
            if (key) {
                checkMap[key] = input.checked;
            }
        });
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('fde_hub_checklist_map', JSON.stringify(checkMap));
        }
        updateChecklistGauges();
    } catch (e) {
        console.error("更新清单状态失败", e);
    }
};

function getChecklistActiveCount() {
    try {
        if (typeof localStorage === 'undefined') return 0;
        const saved = localStorage.getItem('fde_hub_checklist_map');
        if (!saved) return 0;
        const map = JSON.parse(saved);
        return Object.values(map).filter(Boolean).length;
    } catch (e) {
        return 0;
    }
}

function exportSowDefenseBrief() {
    let checkMap = {};
    try { checkMap = JSON.parse(localStorage.getItem('fde_hub_checklist_map') || '{}'); } catch(e){}
    const brief = `【SOW 需求边界现场防御备忘录】
- 输入数据类型锁死 [BLOCKER]: ${checkMap['sow_input_format'] ? '✅ 已固化锁死' : '❌ 未确认'}
- UAT 50项黄金测试集量化 [CRITICAL]: ${checkMap['sow_acceptance_criteria'] ? '✅ 已双方签署' : '❌ 未确认'}
- Phase 2 待办池隔离 [HIGH RISK]: ${checkMap['sow_phase2_pool'] ? '✅ 已设立并阻断蠕变' : '❌ 未确认'}
- 客户数据与配合 SLA [ADVISORY]: ${checkMap['sow_deadline'] ? '✅ 签署最后交付时限' : '❌ 未确认'}
记录时间：${new Date().toLocaleString('zh-CN')}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(brief).then(() => showToast("已复制 SOW 防御备忘录! ✓"));
    } else {
        showToast("已导出 SOW 备忘录");
    }
}

function exportAirgapChecklist() {
    let checkMap = {};
    try { checkMap = JSON.parse(localStorage.getItem('fde_hub_checklist_map') || '{}'); } catch(e){}
    const brief = `【Air-Gap 离线物理隔离网交付安全准入报告】
- Gate 1: 零联网遥测统计 (Zero Telemetry): ${checkMap['airgap_telemetry'] ? 'PASS 通过' : 'FAIL 未通过'}
- Gate 2: 本地权重与 C 动态库完整固化 (Local Weights): ${checkMap['airgap_weights'] ? 'PASS 通过' : 'FAIL 未通过'}
- Gate 3: 剔除外部公共 CDN 与字体依赖: ${checkMap['airgap_cdn'] ? 'PASS 通过' : 'FAIL 未通过'}
- Gate 4: 离线移动存储介质内网防病毒扫描: ${checkMap['airgap_usb'] ? 'PASS 通过' : 'FAIL 未通过'}
审计时间：${new Date().toLocaleString('zh-CN')}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(brief).then(() => showToast("已复制 Air-Gap 验收报告! ✓"));
    } else {
        showToast("已导出 Air-Gap 报告");
    }
}

// 17.5 生产级 Agent 状态机与交互式飞行模拟舱引擎 (eng-1 Simulator & Subpage Engine)
let simState = {
    scenario: 'happy',
    maxSteps: 6,
    tokenBudget: 8000,
    faultInjection: 'none',
    currentStep: 0,
    currentPhase: 1,
    tokensConsumed: 120,
    status: 'READY',
    autoRunTimer: null,
    activeInspectTool: 'get_order_status'
};

const SIM_SCENARIO_DATA = {
    happy: {
        title: "🌟 场景 1: 三步自愈黄金流",
        steps: [
            {
                stepNum: 0,
                phase: 1,
                status: 'READY',
                tokens: 120,
                cost: '¥0.001',
                codeSync: 'history = [{"role": "system", ...}, {"role": "user", ...}]',
                log: '[INIT] 组装初始 History: 注入系统上下文与目标 "查订单 1002 状态"',
                history: [
                    { role: 'system', content: '你是由 ResilientEnterpriseAgent 驱动的交付运维助理，受限使用注册沙箱工具。' },
                    { role: 'user', content: '查一下订单 1002 状态，未发货就催办仓管' }
                ]
            },
            {
                stepNum: 1,
                phase: 4,
                status: 'RUNNING',
                tokens: 520,
                cost: '¥0.008',
                codeSync: 'output = {"error": f"工具执行失败: ...", "retry_hint": "请检查输入参数格式"}',
                log: '[WARN] 第 1 步: 模型调用 get_order_status 故意漏传 order_id，沙箱捕获异常并注入 retry_hint',
                history: [
                    { role: 'system', content: '你是由 ResilientEnterpriseAgent 驱动的交付运维助理，受限使用注册沙箱工具。' },
                    { role: 'user', content: '查一下订单 1002 状态，未发货就催办仓管' },
                    { role: 'assistant', content: null, tool_calls: [{ id: 'call_981a', name: 'get_order_status', args: {} }] },
                    { role: 'tool', tool_call_id: 'call_981a', content: '{"error": "工具执行失败: 缺少必填参数 \'order_id\'", "retry_hint": "请从上下文解析订单号 1002 并重新调用"}' }
                ]
            },
            {
                stepNum: 2,
                phase: 4,
                status: 'RUNNING',
                tokens: 980,
                cost: '¥0.015',
                codeSync: 'args = json.loads(raw_args); output = self.tool_map[fn_name](**args)',
                log: '[INFO] 第 2 步: 模型感知 retry_hint 触发 In-Context 自愈！成功调用 get_order_status(order_id="1002")，返回 UNSHIPPED',
                history: [
                    { role: 'system', content: '你是由 ResilientEnterpriseAgent 驱动的交付运维助理，受限使用注册沙箱工具。' },
                    { role: 'user', content: '查一下订单 1002 状态，未发货就催办仓管' },
                    { role: 'assistant', content: null, tool_calls: [{ id: 'call_981a', name: 'get_order_status', args: {} }] },
                    { role: 'tool', tool_call_id: 'call_981a', content: '{"error": "工具执行失败: 缺少必填参数 \'order_id\'", "retry_hint": "请从上下文解析订单号 1002 并重新调用"}' },
                    { role: 'assistant', content: null, tool_calls: [{ id: 'call_421b', name: 'get_order_status', args: { order_id: '1002' } }] },
                    { role: 'tool', tool_call_id: 'call_421b', content: '{"order_id": "1002", "status": "UNSHIPPED", "warehouse": "WH-09-华东一号仓", "sku": "SKU-PRO-X1"}' }
                ]
            },
            {
                stepNum: 3,
                phase: 4,
                status: 'RUNNING',
                tokens: 1450,
                cost: '¥0.022',
                codeSync: 'output = self.tool_map[fn_name](**args)  # 触发 remind_warehouse',
                log: '[INFO] 第 3 步: 模型判定订单未发货，决策发起催办工单 remind_warehouse(order_id="1002")，仓管系统响应成功',
                history: [
                    { role: 'system', content: '你是由 ResilientEnterpriseAgent 驱动的交付运维助理，受限使用注册沙箱工具。' },
                    { role: 'user', content: '查一下订单 1002 状态，未发货就催办仓管' },
                    { role: 'assistant', content: null, tool_calls: [{ id: 'call_981a', name: 'get_order_status', args: {} }] },
                    { role: 'tool', tool_call_id: 'call_981a', content: '{"error": "工具执行失败: 缺少必填参数 \'order_id\'", "retry_hint": "请从上下文解析订单号 1002 并重新调用"}' },
                    { role: 'assistant', content: null, tool_calls: [{ id: 'call_421b', name: 'get_order_status', args: { order_id: '1002' } }] },
                    { role: 'tool', tool_call_id: 'call_421b', content: '{"order_id": "1002", "status": "UNSHIPPED", "warehouse": "WH-09-华东一号仓", "sku": "SKU-PRO-X1"}' },
                    { role: 'assistant', content: null, tool_calls: [{ id: 'call_773c', name: 'remind_warehouse', args: { order_id: '1002', reason: '未发货超时催办' } }] },
                    { role: 'tool', tool_call_id: 'call_773c', content: '{"success": true, "ticket_id": "TKT-8848", "dispatch_time": "13:50:22", "operator": "WH-AUTO-DISPATCH", "msg": "加急催发工单已送达仓管"}' }
                ]
            },
            {
                stepNum: 4,
                phase: 5,
                status: 'SUCCESS',
                tokens: 1720,
                cost: '¥0.026',
                codeSync: 'if not msg.tool_calls: return {"status": "SUCCESS", "final_output": msg.content, ...}',
                log: '[SUCCESS] 第 4 步: 无新工具调用，模型达成终局结论！返回用户最终汇报，状态机平稳退出',
                history: [
                    { role: 'system', content: '你是由 ResilientEnterpriseAgent 驱动的交付运维助理，受限使用注册沙箱工具。' },
                    { role: 'user', content: '查一下订单 1002 状态，未发货就催办仓管' },
                    { role: 'assistant', content: null, tool_calls: [{ id: 'call_981a', name: 'get_order_status', args: {} }] },
                    { role: 'tool', tool_call_id: 'call_981a', content: '{"error": "工具执行失败: 缺少必填参数 \'order_id\'", "retry_hint": "请从上下文解析订单号 1002 并重新调用"}' },
                    { role: 'assistant', content: null, tool_calls: [{ id: 'call_421b', name: 'get_order_status', args: { order_id: '1002' } }] },
                    { role: 'tool', tool_call_id: 'call_421b', content: '{"order_id": "1002", "status": "UNSHIPPED", "warehouse": "WH-09-华东一号仓", "sku": "SKU-PRO-X1"}' },
                    { role: 'assistant', content: null, tool_calls: [{ id: 'call_773c', name: 'remind_warehouse', args: { order_id: '1002', reason: '未发货超时催办' } }] },
                    { role: 'tool', tool_call_id: 'call_773c', content: '{"success": true, "ticket_id": "TKT-8848", "dispatch_time": "13:50:22", "operator": "WH-AUTO-DISPATCH", "msg": "加急催发工单已送达仓管"}' },
                    { role: 'assistant', content: '✅ 订单 1002 核查完毕：当前存放于【华东一号仓 (WH-09)】，状态为【未发货】。已为您向仓管推送加急催办工单（工单号：TKT-8848），仓管正在优先拣货出库。', tool_calls: null }
                ]
            }
        ]
    },
    loop: {
        title: "🚨 场景 2: 死循环与步数刚性熔断",
        steps: [
            {
                stepNum: 0,
                phase: 1,
                status: 'READY',
                tokens: 150,
                cost: '¥0.002',
                codeSync: 'while step_count < self.max_steps:  # 硬性步数上限 6 步',
                log: '[INIT] 任务：核验资金流水差异。已预设死循环陷阱（工具A与工具B互相重定向）',
                history: [
                    { role: 'system', content: '资金对账 Agent，当前 max_steps=6。' },
                    { role: 'user', content: '核验跨账期资金对账单中的金额差异' }
                ]
            },
            {
                stepNum: 1,
                phase: 4,
                status: 'RUNNING',
                tokens: 450,
                cost: '¥0.007',
                codeSync: 'output = query_bank_ledger(**args)',
                log: '[INFO] 步数 1/6: 调用 query_bank_ledger，工具返回 "流水无差异，请向 ERP 单据重新确认"',
                history: [
                    { role: 'system', content: '资金对账 Agent，当前 max_steps=6。' },
                    { role: 'user', content: '核验跨账期资金对账单中的金额差异' },
                    { role: 'assistant', content: null, tool_calls: [{ id: 'c_1', name: 'query_bank_ledger', args: { date: '2026-09' } }] },
                    { role: 'tool', tool_call_id: 'c_1', content: '{"status": "NEED_ERP_CHECK", "hint": "请查询 query_erp_discrepancy"}' }
                ]
            },
            {
                stepNum: 2,
                phase: 4,
                status: 'RUNNING',
                tokens: 780,
                cost: '¥0.012',
                codeSync: 'output = query_erp_discrepancy(**args)',
                log: '[INFO] 步数 2/6: 调用 query_erp_discrepancy，工具返回 "ERP 状态正常，请重新查询银行流水"',
                history: [
                    { role: 'system', content: '资金对账 Agent，当前 max_steps=6。' },
                    { role: 'user', content: '核验跨账期资金对账单中的金额差异' },
                    { role: 'assistant', content: null, tool_calls: [{ id: 'c_1', name: 'query_bank_ledger', args: { date: '2026-09' } }] },
                    { role: 'tool', tool_call_id: 'c_1', content: '{"status": "NEED_ERP_CHECK", "hint": "请查询 query_erp_discrepancy"}' },
                    { role: 'assistant', content: null, tool_calls: [{ id: 'c_2', name: 'query_erp_discrepancy', args: { batch: 'B-01' } }] },
                    { role: 'tool', tool_call_id: 'c_2', content: '{"status": "NEED_BANK_CHECK", "hint": "请返回查询 query_bank_ledger"}' }
                ]
            },
            {
                stepNum: 3,
                phase: 4,
                status: 'RUNNING',
                tokens: 1120,
                cost: '¥0.017',
                codeSync: 'while step_count < self.max_steps:  # 步数累计至 3/6',
                log: '[WARN] 步数 3/6: 模型陷入双向互相依赖循环，再次调用 query_bank_ledger...',
                history: [
                    { role: 'system', content: '资金对账 Agent，当前 max_steps=6。' },
                    { role: 'user', content: '核验跨账期资金对账单中的金额差异' },
                    { role: 'assistant', content: '正在重新比对银行端流水...', tool_calls: [{ id: 'c_3', name: 'query_bank_ledger', args: { date: '2026-09' } }] },
                    { role: 'tool', tool_call_id: 'c_3', content: '{"status": "NEED_ERP_CHECK"}' }
                ]
            },
            {
                stepNum: 4,
                phase: 4,
                status: 'RUNNING',
                tokens: 1480,
                cost: '¥0.022',
                codeSync: 'while step_count < self.max_steps:  # 步数累计至 4/6',
                log: '[WARN] 步数 4/6: 循环推诿继续，再次调用 query_erp_discrepancy...',
                history: [
                    { role: 'system', content: '资金对账 Agent，当前 max_steps=6。' },
                    { role: 'user', content: '核验跨账期资金对账单中的金额差异' },
                    { role: 'assistant', content: '转入 ERP 核查...', tool_calls: [{ id: 'c_4', name: 'query_erp_discrepancy', args: { batch: 'B-01' } }] },
                    { role: 'tool', tool_call_id: 'c_4', content: '{"status": "NEED_BANK_CHECK"}' }
                ]
            },
            {
                stepNum: 5,
                phase: 4,
                status: 'RUNNING',
                tokens: 1850,
                cost: '¥0.028',
                codeSync: 'while step_count < self.max_steps:  # 步数累计至 5/6 (临界值)',
                log: '[WARN] 步数 5/6: 步数逼近警戒上限！下一次循环将触发刚性截断！',
                history: [
                    { role: 'system', content: '资金对账 Agent，当前 max_steps=6。' },
                    { role: 'user', content: '核验跨账期资金对账单中的金额差异' },
                    { role: 'assistant', content: '第 5 轮复查流水...', tool_calls: [{ id: 'c_5', name: 'query_bank_ledger', args: { date: '2026-09' } }] },
                    { role: 'tool', tool_call_id: 'c_5', content: '{"status": "NEED_ERP_CHECK"}' }
                ]
            },
            {
                stepNum: 6,
                phase: 5,
                status: 'MAX_STEPS_REACHED',
                tokens: 2200,
                cost: '¥0.033',
                codeSync: 'return {"status": "MAX_STEPS_REACHED", "trace": execution_trace}',
                log: '[ALERT] 步数达到 6/6 极值！while 循环终止，触发 MAX_STEPS_REACHED 刚性熔断！杜绝死循环挂死服务器！',
                history: [
                    { role: 'system', content: '资金对账 Agent，当前 max_steps=6。' },
                    { role: 'user', content: '核验跨账期资金对账单中的金额差异' },
                    { role: 'assistant', content: '第 5 轮复查流水...', tool_calls: [{ id: 'c_5', name: 'query_bank_ledger', args: { date: '2026-09' } }] },
                    { role: 'tool', tool_call_id: 'c_5', content: '{"status": "NEED_ERP_CHECK"}' },
                    { role: 'system', content: '【系统熔断通知】达到最大执行步数限制 (6 步)，循环强行终止。' }
                ]
            }
        ]
    },
    token: {
        title: "💸 场景 3: 算力 Token 预算熔断",
        steps: [
            {
                stepNum: 0,
                phase: 1,
                status: 'READY',
                tokens: 180,
                cost: '¥0.003',
                codeSync: 'self.token_budget = 8000  # 安全预算红线',
                log: '[INIT] 任务：全量日志检索。Token 安全预算 pool = 8000 tokens',
                history: [
                    { role: 'system', content: '日志运维 Agent，安全预算 8000 tokens。' },
                    { role: 'user', content: '查询全量生产历史日志并定位所有异常告警' }
                ]
            },
            {
                stepNum: 1,
                phase: 2,
                status: 'RUNNING',
                tokens: 420,
                cost: '¥0.006',
                codeSync: 'response = self.client.chat.completions.create(...)',
                log: '[INFO] 第 1 步: 模型请求调用 fetch_production_logs(service="all", limit=99999)',
                history: [
                    { role: 'system', content: '日志运维 Agent，安全预算 8000 tokens。' },
                    { role: 'user', content: '查询全量生产历史日志并定位所有异常告警' },
                    { role: 'assistant', content: null, tool_calls: [{ id: 'c_log', name: 'fetch_production_logs', args: { service: 'all', limit: 99999 } }] }
                ]
            },
            {
                stepNum: 2,
                phase: 5,
                status: 'ABORTED',
                tokens: 8450,
                cost: '¥0.127',
                codeSync: 'if total_tokens_consumed > self.token_budget: return {"status": "ABORTED", "reason": "TOKEN_BUDGET_EXCEEDED"}',
                log: '[ALERT] 危险！工具返回超大 50KB 未分页日志！单次消耗达 8,030 tokens，累计 8,450 > 8,000！立即熔断拦截！',
                history: [
                    { role: 'system', content: '日志运维 Agent，安全预算 8000 tokens。' },
                    { role: 'user', content: '查询全量生产历史日志并定位所有异常告警' },
                    { role: 'assistant', content: null, tool_calls: [{ id: 'c_log', name: 'fetch_production_logs', args: { service: 'all', limit: 99999 } }] },
                    { role: 'tool', tool_call_id: 'c_log', content: '{"logs_dump": "[40,000 字巨型 JSON 数组已截断...]"}' },
                    { role: 'system', content: '【财务预算安全网触发】单任务 Token 消耗累计 8,450 超标！立即熔断，为企业成功挽救数十元失控账单！' }
                ]
            }
        ]
    },
    sandbox: {
        title: "🛡️ 场景 4: 未授权沙箱拦截",
        steps: [
            {
                stepNum: 0,
                phase: 1,
                status: 'READY',
                tokens: 110,
                cost: '¥0.001',
                codeSync: 'self.tool_map = {func.__name__: func for func in tools}',
                log: '[INIT] 沙箱白名单注册完毕：仅授权 safe_backup_database，未授权任何危险删库指令',
                history: [
                    { role: 'system', content: '受控环境 Agent，任何工具调用必须受到沙箱白名单鉴权。' },
                    { role: 'user', content: '清空测试环境所有过期的历史数据表' }
                ]
            },
            {
                stepNum: 1,
                phase: 4,
                status: 'RUNNING',
                tokens: 430,
                cost: '¥0.006',
                codeSync: 'if fn_name not in self.tool_map: output = {"error": f"Tool {fn_name} 未在沙箱中注册授权"}',
                log: '[ALERT] 拦截高危幻觉调用！模型尝试执行 drop_database()，在 self.tool_map 查无此人，直接拦截！',
                history: [
                    { role: 'system', content: '受控环境 Agent，任何工具调用必须受到沙箱白名单鉴权。' },
                    { role: 'user', content: '清空测试环境所有过期的历史数据表' },
                    { role: 'assistant', content: null, tool_calls: [{ id: 'c_drop', name: 'drop_database', args: { force: true } }] },
                    { role: 'tool', tool_call_id: 'c_drop', content: '{"error": "Tool drop_database 未在沙箱中注册授权"}' }
                ]
            },
            {
                stepNum: 2,
                phase: 5,
                status: 'SUCCESS',
                tokens: 650,
                cost: '¥0.010',
                codeSync: 'return {"status": "SUCCESS", "final_output": msg.content, ...}',
                log: '[SUCCESS] 模型接收到沙箱拒绝通知，优雅向用户提示权限不足，核心资产未受任何损害！',
                history: [
                    { role: 'system', content: '受控环境 Agent，任何工具调用必须受到沙箱白名单鉴权。' },
                    { role: 'user', content: '清空测试环境所有过期的历史数据表' },
                    { role: 'assistant', content: null, tool_calls: [{ id: 'c_drop', name: 'drop_database', args: { force: true } }] },
                    { role: 'tool', tool_call_id: 'c_drop', content: '{"error": "Tool drop_database 未在沙箱中注册授权"}' },
                    { role: 'assistant', content: '🛡️ 安全沙箱防御拦截：您请求的 drop_database 指令未在企业安全白名单中授权，系统已主动拒绝该高危调用，确保数据库安全。', tool_calls: null }
                ]
            }
        ]
    }
};

function switchEngTab(tabKey) {
    if (typeof window !== 'undefined') window.switchEngTab = switchEngTab;
    const tabs = ['theory', 'simulator', 'interview'];
    tabs.forEach(t => {
        const btn = document.getElementById(`btn-tab-${t}`);
        const pane = document.getElementById(`eng-tab-pane-${t}`);
        if (btn) {
            if (t === tabKey) {
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            }
        }
        if (pane) {
            if (t === tabKey) {
                pane.classList.remove('hidden');
            } else {
                pane.classList.add('hidden');
            }
        }
    });

    if (tabKey === 'simulator') {
        initAgentSimulator();
    }
}

function initAgentSimulator() {
    const container = document.getElementById('agent-simulator-container');
    if (!container) return;

    setSimScenario(simState.scenario || 'happy');
}

function setSimScenario(scId) {
    if (typeof window !== 'undefined') window.setSimScenario = setSimScenario;
    if (simState.autoRunTimer) {
        clearInterval(simState.autoRunTimer);
        simState.autoRunTimer = null;
        const autoBtn = document.getElementById('sim-autorun-btn');
        if (autoBtn) autoBtn.innerHTML = '⚡ 连续运行 (Auto Run)';
    }

    simState.scenario = scId;
    simState.currentStep = 0;

    const pills = ['happy', 'loop', 'token', 'sandbox'];
    pills.forEach(p => {
        const el = document.getElementById(`sim-sc-${p}`);
        if (el) {
            if (p === scId) el.classList.add('active');
            else el.classList.remove('active');
        }
    });

    const termLogs = document.getElementById('sim-terminal-logs');
    if (termLogs) {
        termLogs.innerHTML = '';
    }

    const scData = SIM_SCENARIO_DATA[scId] || SIM_SCENARIO_DATA.happy;
    applySimStepData(scData.steps[0], true);
}

function updateSimParams() {
    if (typeof window !== 'undefined') window.updateSimParams = updateSimParams;
    const maxStepsInput = document.getElementById('sim_max_steps');
    const tokenBudgetInput = document.getElementById('sim_token_budget');
    const faultInput = document.getElementById('sim_fault_select');

    if (maxStepsInput) {
        simState.maxSteps = parseInt(maxStepsInput.value, 10) || 6;
        const lbl = document.getElementById('val_sim_max_steps');
        if (lbl) lbl.textContent = `${simState.maxSteps} 步`;
    }
    if (tokenBudgetInput) {
        simState.tokenBudget = parseInt(tokenBudgetInput.value, 10) || 8000;
        const lbl = document.getElementById('val_sim_token_budget');
        if (lbl) lbl.textContent = String(simState.tokenBudget);
    }
    if (faultInput) {
        simState.faultInjection = faultInput.value;
    }

    const scData = SIM_SCENARIO_DATA[simState.scenario] || SIM_SCENARIO_DATA.happy;
    const currentStepData = scData.steps[Math.min(simState.currentStep, scData.steps.length - 1)];
    applySimStepData(currentStepData, false);
}

function applySimStepData(stepData, appendLog = true) {
    if (!stepData) return;

    // 1. 遥测看板
    const stepEl = document.getElementById('metric-step-val');
    if (stepEl) stepEl.textContent = `${stepData.stepNum} / ${simState.maxSteps}`;

    const tokenEl = document.getElementById('metric-token-val');
    if (tokenEl) tokenEl.textContent = String(stepData.tokens);

    const costEl = document.getElementById('metric-cost-val');
    if (costEl) costEl.textContent = stepData.cost;

    const statusBadge = document.getElementById('sim-status-badge');
    if (statusBadge) {
        statusBadge.textContent = stepData.status;
        statusBadge.className = 'sim-status-badge';
        if (stepData.status === 'READY') statusBadge.classList.add('idle');
        else if (stepData.status === 'RUNNING') statusBadge.classList.add('running');
        else if (stepData.status === 'SUCCESS') statusBadge.classList.add('success');
        else if (stepData.status === 'MAX_STEPS_REACHED') statusBadge.classList.add('warn');
        else if (stepData.status === 'ABORTED') statusBadge.classList.add('alert');
    }

    // 2. Token 燃油箱
    const pct = Math.min(100, Math.round((stepData.tokens / simState.tokenBudget) * 100));
    const fuelFill = document.getElementById('sim-fuel-fill');
    const fuelText = document.getElementById('fuel-pct-text');
    if (fuelFill) {
        fuelFill.style.width = `${pct}%`;
        fuelFill.className = 'sim-fuel-fill';
        if (pct >= 80) fuelFill.classList.add('danger');
        else if (pct >= 50) fuelFill.classList.add('warn');
    }
    if (fuelText) fuelText.textContent = `${pct}% (${stepData.tokens} / ${simState.tokenBudget})`;

    // 3. 代码映射框
    const codeSyncText = document.getElementById('sim-code-sync-text');
    if (codeSyncText) codeSyncText.textContent = stepData.codeSync;

    // 4. 状态机节点高亮
    for (let i = 1; i <= 5; i++) {
        const node = document.getElementById(`flow-node-${i}`);
        if (node) {
            node.className = 'sim-flow-node';
            if (i < stepData.phase) {
                node.classList.add('passed');
            } else if (i === stepData.phase) {
                node.classList.add('active');
                if (stepData.status === 'ABORTED' || stepData.status === 'MAX_STEPS_REACHED') {
                    node.classList.add('error-alert');
                }
            }
        }
    }

    // 5. 终端日志流
    if (appendLog && stepData.log) {
        const termLogs = document.getElementById('sim-terminal-logs');
        if (termLogs) {
            const line = document.createElement('div');
            line.className = 'sim-log-line';
            if (stepData.log.includes('[INIT]')) line.classList.add('info');
            else if (stepData.log.includes('[WARN]')) line.classList.add('warn');
            else if (stepData.log.includes('[ALERT]')) line.classList.add('error');
            else if (stepData.log.includes('[SUCCESS]')) line.classList.add('success');
            line.textContent = stepData.log;
            termLogs.appendChild(line);

            const term = document.getElementById('sim-terminal');
            if (term && term.scrollHeight) {
                term.scrollTop = term.scrollHeight;
            }
        }
    }

    // 6. 渲染 History 列表
    renderSimHistory(stepData.history);
}

function renderSimHistory(historyList) {
    const mount = document.getElementById('sim-history-list');
    const badge = document.getElementById('history-count-badge');
    if (!mount) return;

    if (badge) badge.textContent = `${historyList.length} 条消息`;

    mount.innerHTML = historyList.map((m, idx) => {
        const roleClass = m.role || 'user';
        let bodyHtml = '';
        if (m.content) {
            bodyHtml = `<div class="sim-msg-body">${escapeHtml(m.content)}</div>`;
        }
        if (m.tool_calls && m.tool_calls.length > 0) {
            bodyHtml += m.tool_calls.map(tc => `
                <div class="sim-msg-meta" style="color:var(--apple-orange);">
                    ⚡ <strong>Tool Call:</strong> <code>${escapeHtml(tc.name)}(${escapeHtml(JSON.stringify(tc.args))})</code>
                    <span style="opacity:0.6; font-size:0.65rem;">(id: ${escapeHtml(tc.id)})</span>
                </div>
            `).join('');
        }
        if (m.tool_call_id) {
            bodyHtml += `<div class="sim-msg-meta" style="color:var(--apple-green);">绑定 tool_call_id: <code>${escapeHtml(m.tool_call_id)}</code></div>`;
        }

        return `
            <div class="sim-msg-item">
                <div class="sim-msg-header">
                    <span class="sim-role-tag ${roleClass}">#${idx + 1} ${roleClass.toUpperCase()}</span>
                </div>
                ${bodyHtml}
            </div>
        `;
    }).join('');
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function stepAgentSimulator() {
    if (typeof window !== 'undefined') window.stepAgentSimulator = stepAgentSimulator;
    const scData = SIM_SCENARIO_DATA[simState.scenario] || SIM_SCENARIO_DATA.happy;
    const maxIdx = scData.steps.length - 1;

    if (simState.currentStep < maxIdx) {
        simState.currentStep++;
        applySimStepData(scData.steps[simState.currentStep], true);
    } else {
        showToast("已达到当前场景的推演终态 ✓");
        if (simState.autoRunTimer) {
            clearInterval(simState.autoRunTimer);
            simState.autoRunTimer = null;
            const autoBtn = document.getElementById('sim-autorun-btn');
            if (autoBtn) autoBtn.innerHTML = '⚡ 连续运行 (Auto Run)';
        }
    }
}

function autoRunAgentSimulator() {
    if (typeof window !== 'undefined') window.autoRunAgentSimulator = autoRunAgentSimulator;
    const autoBtn = document.getElementById('sim-autorun-btn');
    if (simState.autoRunTimer) {
        clearInterval(simState.autoRunTimer);
        simState.autoRunTimer = null;
        if (autoBtn) autoBtn.innerHTML = '⚡ 连续运行 (Auto Run)';
        showToast("推演已暂停 ⏸");
        return;
    }

    const scData = SIM_SCENARIO_DATA[simState.scenario] || SIM_SCENARIO_DATA.happy;
    if (simState.currentStep >= scData.steps.length - 1) {
        simState.currentStep = 0;
        applySimStepData(scData.steps[0], true);
    }

    if (autoBtn) autoBtn.innerHTML = '⏸ 暂停推演 (Pause)';
    simState.autoRunTimer = setInterval(() => {
        if (simState.currentStep < scData.steps.length - 1) {
            stepAgentSimulator();
        } else {
            clearInterval(simState.autoRunTimer);
            simState.autoRunTimer = null;
            if (autoBtn) autoBtn.innerHTML = '⚡ 连续运行 (Auto Run)';
        }
    }, 1100);
}

function resetAgentSimulator() {
    if (typeof window !== 'undefined') window.resetAgentSimulator = resetAgentSimulator;
    if (simState.autoRunTimer) {
        clearInterval(simState.autoRunTimer);
        simState.autoRunTimer = null;
        const autoBtn = document.getElementById('sim-autorun-btn');
        if (autoBtn) autoBtn.innerHTML = '⚡ 连续运行 (Auto Run)';
    }
    setSimScenario(simState.scenario || 'happy');
    showToast("沙盒状态机已重置 🔄");
}

function toggleSimFullscreen() {
    if (typeof window !== 'undefined') window.toggleSimFullscreen = toggleSimFullscreen;
    const container = document.getElementById('agent-simulator-container');
    const backdrop = document.getElementById('sim-fullscreen-backdrop');
    const btn = document.getElementById('sim-fullscreen-toggle-btn');
    if (!container) return;

    const isFull = container.classList.contains('fullscreen-mode');
    if (isFull) {
        container.classList.remove('fullscreen-mode');
        if (backdrop) backdrop.classList.remove('active');
        if (btn) btn.innerHTML = '⤢ 全屏子页面模式';
    } else {
        container.classList.add('fullscreen-mode');
        if (backdrop) backdrop.classList.add('active');
        if (btn) btn.innerHTML = '✕ 退出全屏模式';
    }
}

function switchInspectTool(toolName) {
    if (typeof window !== 'undefined') window.switchInspectTool = switchInspectTool;
    const pyBox = document.getElementById('inspect-py-source');
    const jsonBox = document.getElementById('inspect-json-spec');

    if (toolName === 'get_order_status') {
        if (pyBox) {
            pyBox.innerHTML = `<span style="color:#ff7b72;">def</span> <span style="color:#d2a8ff;">get_order_status</span>(order_id: <span style="color:#79c0ff;">str</span>) -&gt; <span style="color:#79c0ff;">dict</span>:
    <span style="color:#a5d6ff;">"""查询指定订单的履约与仓储状态。"""</span>
    <span style="color:#8b949e;"># 现场真实业务查询...</span>
    <span style="color:#ff7b72;">return</span> {"order_id": order_id}`;
        }
        if (jsonBox) {
            jsonBox.innerHTML = `{
  <span style="color:#79c0ff;">"type"</span>: <span style="color:#a5d6ff;">"function"</span>,
  <span style="color:#79c0ff;">"function"</span>: {
    <span style="color:#79c0ff;">"name"</span>: <span style="color:#a5d6ff;">"get_order_status"</span>,
    <span style="color:#79c0ff;">"description"</span>: <span style="color:#a5d6ff;">"查询指定订单的履约与仓储状态。"</span>,
    <span style="color:#79c0ff;">"parameters"</span>: {
      <span style="color:#79c0ff;">"type"</span>: <span style="color:#a5d6ff;">"object"</span>,
      <span style="color:#79c0ff;">"properties"</span>: {
        <span style="color:#79c0ff;">"order_id"</span>: { <span style="color:#79c0ff;">"type"</span>: <span style="color:#a5d6ff;">"string"</span> }
      },
      <span style="color:#79c0ff;">"required"</span>: [<span style="color:#a5d6ff;">"order_id"</span>]
    }
  }
}`;
        }
    } else if (toolName === 'remind_warehouse') {
        if (pyBox) {
            pyBox.innerHTML = `<span style="color:#ff7b72;">def</span> <span style="color:#d2a8ff;">remind_warehouse</span>(order_id: <span style="color:#79c0ff;">str</span>, reason: <span style="color:#79c0ff;">str</span> = <span style="color:#a5d6ff;">"加急催发"</span>) -&gt; <span style="color:#79c0ff;">dict</span>:
    <span style="color:#a5d6ff;">"""向目标仓储系统推送加急催办工单。"""</span>
    <span style="color:#8b949e;"># 现场真实业务分发...</span>
    <span style="color:#ff7b72;">return</span> {"success": True}`;
        }
        if (jsonBox) {
            jsonBox.innerHTML = `{
  <span style="color:#79c0ff;">"type"</span>: <span style="color:#a5d6ff;">"function"</span>,
  <span style="color:#79c0ff;">"function"</span>: {
    <span style="color:#79c0ff;">"name"</span>: <span style="color:#a5d6ff;">"remind_warehouse"</span>,
    <span style="color:#79c0ff;">"description"</span>: <span style="color:#a5d6ff;">"向目标仓储系统推送加急催办工单。"</span>,
    <span style="color:#79c0ff;">"parameters"</span>: {
      <span style="color:#79c0ff;">"type"</span>: <span style="color:#a5d6ff;">"object"</span>,
      <span style="color:#79c0ff;">"properties"</span>: {
        <span style="color:#79c0ff;">"order_id"</span>: { <span style="color:#79c0ff;">"type"</span>: <span style="color:#a5d6ff;">"string"</span> },
        <span style="color:#79c0ff;">"reason"</span>: { <span style="color:#79c0ff;">"type"</span>: <span style="color:#a5d6ff;">"string"</span> }
      },
      <span style="color:#79c0ff;">"required"</span>: [<span style="color:#a5d6ff;">"order_id"</span>]
    }
  }
}`;
        }
    }
}

function handleConceptQuiz(qIdx, optIdx, isCorrect) {
    if (typeof window !== 'undefined') window.handleConceptQuiz = handleConceptQuiz;
    const box = document.getElementById(`concept-feedback-${qIdx}`);
    if (!box) return;

    box.classList.remove('hidden');
    if (isCorrect) {
        box.className = 'opt-cognitive-feedback chosen-correct';
        if (qIdx === 1) {
            box.innerHTML = '<strong>✅ 判定正确！【因果与契约双重基石】</strong><br>OpenAI 协议强制要求每一个 <code>role: tool</code> 必须跟随在发起它的 <code>role: assistant</code> 之后并使用 <code>tool_call_id</code> 关联。如果省略 assistant 消息，不仅无法通过 API 格式校验，模型也会丢失“自己上一轮究竟向工具传了什么参数”的推理记忆。';
        } else if (qIdx === 2) {
            box.innerHTML = '<strong>✅ 判定正确！【复合误差级联不可抗力】</strong><br>根据公式 $P = 0.92^6 \\approx 60.6\\%$。多步链路每增加一步，失败概率都在非线性指数放大！这就是为什么 FDE 铁律要求：80% 核心主干走强类型确定性代码编排（State Graph），仅把 LLM 用在 20% 的容错分支中。';
        } else if (qIdx === 3) {
            box.innerHTML = '<strong>✅ 判定正确！【生产级自愈防御设计】</strong><br>在严肃交付现场，直接 crash 会导致整个后台服务瘫痪，而欺骗模型会导致幻觉雪崩。将异常打包为工具输出并注入 <code>retry_hint</code>，可以利用大模型强大的上下文理解力完成自动参数纠正与重试自愈！';
        }
    } else {
        box.className = 'opt-cognitive-feedback chosen-wrong';
        if (qIdx === 1) {
            box.innerHTML = '<strong>❌ 认知陷阱提示！</strong><br>这不仅是日志，更是 OpenAI API 的强校验约束！如果不放入 assistant 消息，API 会直接报错 400（missing tool_call_id），导致整个推理流程直接熔断抛错。';
        } else if (qIdx === 2) {
            box.innerHTML = '<strong>❌ 认知陷阱：线性直觉偏差！</strong><br>很多人误以为 92% 的单步正确率在 6 步后依然很高。然而概率连乘 $0.92 \\times 0.92 \\times ... = 0.92^6 \\approx 60.6\\%$，意味着三次复杂排障就有一次必定跑偏引发生产灾难！';
        } else if (qIdx === 3) {
            box.innerHTML = '<strong>❌ 致命陷阱！</strong><br>让主进程直接抛错退出会导致服务不可用，而返回空对象会诱导模型产生严重的事实幻觉。正确的工程姿势是用 try...except 捕获，并携带明确的 retry_hint 引导模型自愈。';
        }
    }
}

// 18. 交互题库：测验引擎 (Cognitive Feedback & Spaced Practice Retry)
function renderQuizzes() {
    const mount = document.getElementById('quiz-mount-point');
    if (!mount) return;

    let html = '';
    FDE_ALL_DATA.full_quizzes.forEach((qItem, qIdx) => {
        const state = quizAnswersState[qItem.id];
        const catBadgeColor = qItem.category === 'commercial' ? 'blue' : qItem.category === 'engineering' ? 'green' : qItem.category === 'crisis' ? 'orange' : 'purple';
        
        // 认知陷阱与选项归因
        const meta = COGNITIVE_QUIZ_METADATA[qItem.id] || {
            trap: '实战决策陷阱',
            option_explanations: []
        };
        const trapText = qItem.cognitive_trap || meta.trap;
        const optExps = qItem.option_explanations || meta.option_explanations || [];

        html += `
        <div class="quiz-card" id="quiz-card-${qItem.id}">
            <div class="cognitive-trap-banner">⚠️ 现场决策陷阱：${trapText}</div>
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
            
            ${(state !== undefined && optExps[state]) ? `
                <div class="opt-cognitive-feedback ${state === qItem.ans ? 'chosen-correct' : 'chosen-wrong'}">
                    <strong>${optExps[state].verdict}</strong>
                    <div style="margin-top: 3px;">${optExps[state].rationale}</div>
                </div>
            ` : ''}

            <div class="quiz-exp ${state !== undefined ? '' : 'hidden'}" id="exp-${qItem.id}">
                <strong>【专家复盘深度解析】</strong> ${qItem.exp}
                <div style="margin-top: 0.8rem;">
                    <button class="quiz-retry-btn" onclick="resetQuizQuestion(${qItem.id})">🔄 重新挑战此题 (Retry / Spaced Practice)</button>
                </div>
            </div>
        </div>
        `;
    });

    mount.innerHTML = html;
}

function handleQuizAnswer(quizId, chosenOpt, correctOpt) {
    if (typeof window !== 'undefined') window.handleQuizAnswer = handleQuizAnswer;
    if (quizAnswersState[quizId] !== undefined) return;
    quizAnswersState[quizId] = chosenOpt;
    saveQuizAnswers();
    renderQuizzes();
    
    // 如果在成长看板，联动更新
    if (FDE_ALL_DATA.modules[currentModuleIndex]?.items[currentItemIndex]?.id === 'dashboard-view') {
        renderDashboard();
    }
}

function resetQuizQuestion(quizId) {
    if (typeof window !== 'undefined') window.resetQuizQuestion = resetQuizQuestion;
    delete quizAnswersState[quizId];
    saveQuizAnswers();
    renderQuizzes();
    showToast(`已重置第 ${quizId} 题，可重新作答进行间隔强化`);
    if (FDE_ALL_DATA.modules[currentModuleIndex]?.items[currentItemIndex]?.id === 'dashboard-view') {
        renderDashboard();
    }
};

// 19. PBL 抉择沙盘与多回合状态机
function getPblChoices() {
    try {
        if (typeof localStorage === 'undefined') return {};
        const saved = localStorage.getItem('fde_hub_pbl');
        return saved ? JSON.parse(saved) : {};
    } catch (e) {
        return {};
    }
}

function savePblChoices(choices) {
    try {
        if (typeof localStorage === 'undefined') return;
        localStorage.setItem('fde_hub_pbl', JSON.stringify(choices));
    } catch (e) {}
}

function loadPblTurnState() {
    try {
        if (typeof localStorage === 'undefined') return;
        const saved = localStorage.getItem('fde_hub_pbl_turns');
        pblTurnState = saved ? JSON.parse(saved) : {};
    } catch (e) {
        pblTurnState = {};
    }
}

function savePblTurnState() {
    try {
        if (typeof localStorage === 'undefined') return;
        localStorage.setItem('fde_hub_pbl_turns', JSON.stringify(pblTurnState));
    } catch (e) {}
}

function executePblChoice(scenarioId, choiceIdx) {
    if (typeof window !== 'undefined') window.executePblChoice = executePblChoice;
    const scenario = FDE_ALL_DATA.pbl_scenarios && FDE_ALL_DATA.pbl_scenarios[scenarioId];
    if (!scenario || !scenario.crossroads[choiceIdx]) return;

    const choices = getPblChoices();
    choices[scenarioId] = choiceIdx;
    savePblChoices(choices);

    // 记录多回合初始回合
    if (!pblTurnState[scenarioId]) pblTurnState[scenarioId] = {};
    pblTurnState[scenarioId].turn1 = choiceIdx;
    delete pblTurnState[scenarioId].turn2;
    savePblTurnState();

    renderPblOutcome(scenarioId, choiceIdx);

    if (FDE_ALL_DATA.modules[currentModuleIndex]?.items[currentItemIndex]?.id === 'dashboard-view') {
        renderDashboard();
    }
}

function executePblTurn(scenarioId, turnIdx, choiceIdx) {
    if (typeof window !== 'undefined') window.executePblTurn = executePblTurn;
    if (!pblTurnState[scenarioId]) pblTurnState[scenarioId] = {};
    pblTurnState[scenarioId][`turn${turnIdx}`] = choiceIdx;
    savePblTurnState();

    const turn1Choice = pblTurnState[scenarioId].turn1 !== undefined ? pblTurnState[scenarioId].turn1 : getPblChoices()[scenarioId];
    renderPblOutcome(scenarioId, turn1Choice);
}

function resetPblScenario(scenarioId) {
    if (typeof window !== 'undefined') window.resetPblScenario = resetPblScenario;
    const choices = getPblChoices();
    delete choices[scenarioId];
    savePblChoices(choices);

    delete pblTurnState[scenarioId];
    savePblTurnState();

    // 移除选中状态与结果框
    const outcomeBox = document.getElementById(`${scenarioId}-outcome`);
    if (outcomeBox) outcomeBox.classList.add('hidden');

    const container = document.getElementById(`branch-${scenarioId}`);
    if (container) {
        container.querySelectorAll('.choice-btn').forEach(btn => {
            btn.classList.remove('selected', 'choice-success', 'choice-fail');
        });
    }

    showToast("已重置沙盘推演进度");
    if (FDE_ALL_DATA.modules[currentModuleIndex]?.items[currentItemIndex]?.id === 'dashboard-view') {
        renderDashboard();
    }
}

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
    
    // 检查是否有第 2 回合推演数据
    const multiData = PBL_MULTI_TURN_DATA[scenarioId]?.turn2?.[choiceIdx];
    const userTurn2Choice = pblTurnState[scenarioId]?.turn2;
    let turn2Html = '';

    let cumulativeTrust = choice.trust;
    let cumulativeDelay = choice.delay;

    if (multiData) {
        if (userTurn2Choice !== undefined && multiData.choices[userTurn2Choice]) {
            const t2 = multiData.choices[userTurn2Choice];
            cumulativeTrust += t2.trust;
            cumulativeDelay += t2.delay;
        }

        turn2Html = `
        <div class="pbl-turn2-block" style="margin-top: 1.25rem; padding-top: 1.1rem; border-top: 0.5px solid var(--border-subtle);">
            <div style="font-size: 0.84rem; font-weight: 700; color: var(--apple-blue); margin-bottom: 0.4rem;">
                ⚔️ ${multiData.stage}
            </div>
            <p style="font-size: 0.82rem; color: var(--text-primary); line-height: 1.5; margin-bottom: 0.8rem;">
                ${multiData.dilemma}
            </p>
            <div class="pbl-turn2-choices" style="display:flex; flex-direction:column; gap: 0.55rem;">
                ${multiData.choices.map((c, cIdx) => {
                    const isSelected = userTurn2Choice === cIdx;
                    let btnCls = 'choice-btn';
                    if (isSelected) {
                        btnCls += (c.status === 'SUCCESS' ? ' choice-success selected' : ' choice-fail selected');
                    }
                    return `
                    <button class="${btnCls}" onclick="executePblTurn('${scenarioId}', 2, ${cIdx})">
                        ${c.text}
                    </button>`;
                }).join('')}
            </div>
            ${userTurn2Choice !== undefined && multiData.choices[userTurn2Choice] ? `
                <div class="outcome-box ${multiData.choices[userTurn2Choice].status === 'SUCCESS' ? 'success' : 'fail'}" style="margin-top: 0.8rem;">
                    <div class="outcome-desc">${multiData.choices[userTurn2Choice].outcome}</div>
                </div>
            ` : ''}
        </div>
        `;
    }

    outcomeBox.className = `outcome-box ${isSuccess ? 'success' : 'fail'}`;
    outcomeBox.innerHTML = `
        <div class="outcome-header">
            <span class="badge ${isSuccess ? 'green' : 'red'}">
                ${isSuccess ? '✓ 第 1 回合决断通过 (Pass)' : '✕ 第 1 回合踩雷 (Incident)'}
            </span>
            <div class="impact-chips">
                <span class="impact-chip ${cumulativeTrust >= 0 ? 'pos' : 'neg'}">累计信任度: ${cumulativeTrust >= 0 ? '+' : ''}${cumulativeTrust}%</span>
                <span class="impact-chip ${cumulativeDelay === 0 ? 'pos' : 'neg'}">总延期: ${cumulativeDelay === 0 ? '0 天 (按时)' : `+${cumulativeDelay} 天`}</span>
            </div>
        </div>
        <div class="outcome-desc">${choice.outcome}</div>
        ${!isSuccess 
            ? `<div class="outcome-retry-tip">💡 现场反思：真实交付场景无撤回机会。请反思违规/冒进原因，重新选择其他路径挽救局势。</div>` 
            : `<div class="outcome-success-tip">🎯 标杆解法：你展现了资深 FDE 的商业敏锐度与工程隔离直觉！</div>`
        }
        ${turn2Html}
        <div style="margin-top: 1rem; text-align: right;">
            <button class="coi-secondary-btn" style="padding: 0.35rem 0.8rem; font-size: 0.75rem;" onclick="resetPblScenario('${scenarioId}')">🔄 重置本沙盘推演</button>
        </div>
    `;
    outcomeBox.classList.remove('hidden');
}

function restorePblStates() {
    const choices = getPblChoices();
    Object.keys(choices).forEach(scenarioId => {
        renderPblOutcome(scenarioId, choices[scenarioId]);
    });
}

function toggleCodeHuntSolution() {
    if (typeof window !== 'undefined') window.toggleCodeHuntSolution = toggleCodeHuntSolution;
    const el = document.getElementById('code-hunt-solution');
    const btn = (typeof event !== 'undefined' && event?.currentTarget) || document.querySelector('.code-hunt-header .copy-btn');
    if (!el) return;
    const isHidden = el.classList.contains('hidden');
    if (isHidden) {
        el.classList.remove('hidden');
        if (btn) btn.textContent = '收起诊断 ▲';
    } else {
        el.classList.add('hidden');
        if (btn) btn.textContent = '揭示专家诊断 ▼';
    }
}

// 20. 个人成长看板 (四维战力模型 + PBL 通关认证 + 学习认证报告导出)
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

// 21. 导出个人学习记录与清空重置
function exportStudyRecords() {
    if (typeof window !== 'undefined') window.exportStudyRecords = exportStudyRecords;
    const pblChoices = getPblChoices();
    const record = {
        timestamp: new Date().toISOString(),
        completedItems: Array.from(completedItems),
        quizAnswers: quizAnswersState,
        pblChoices: pblChoices,
        checklists: JSON.parse((typeof localStorage !== 'undefined' ? localStorage.getItem('fde_hub_checklist_map') : null) || '{}')
    };
    const BlobClass = (typeof window !== 'undefined' && window.Blob) ? window.Blob : (typeof Blob !== 'undefined' ? Blob : global.Blob);
    const blob = new BlobClass([JSON.stringify(record, null, 2)], { type: 'application/json' });
    const URLClass = (typeof window !== 'undefined' && window.URL) ? window.URL : (typeof URL !== 'undefined' ? URL : global.URL);
    const url = URLClass.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fde-competency-cert-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URLClass.revokeObjectURL(url);
}

function resetStudyProgress() {
    if (typeof window !== 'undefined') window.resetStudyProgress = resetStudyProgress;
    if (confirm("确定要清空所有学习打卡、沙盘抉择与测验记录吗？此操作不可逆。")) {
        completedItems.clear();
        quizAnswersState = {};
        pblTurnState = {};
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('fde_hub_completed');
            localStorage.removeItem('fde_hub_quiz');
            localStorage.removeItem('fde_hub_checklist_map');
            localStorage.removeItem('fde_hub_pbl');
            localStorage.removeItem('fde_hub_pbl_turns');
        }
        updateProgressUI();
        renderSidebar(currentSearchQuery);
        renderDashboard();
        showToast("已重置所有学习档案数据");
    }
}

// 22. 辅助功能：轻提示 (Toast) 与代码一键复制
function showToast(message, duration = 2200) {
    if (typeof document === 'undefined') return;
    const toast = document.getElementById('capsule-toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove('hidden');

    if (toast._timer) clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.classList.add('hidden');
    }, duration);
}

function copyCode(buttonElement) {
    if (typeof window !== 'undefined') window.copyCode = copyCode;
    const pre = buttonElement.closest('.code-header').nextElementSibling;
    if (!pre) return;
    const code = pre.querySelector('code');
    if (!code) return;

    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
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
    }
}

// 23. 全局暴露与 Node 运行沙盒环境兼容导出
if (typeof window !== 'undefined') {
    window.initApp = initApp;
    window.isTypingActive = isTypingActive;
    window.openSpotlight = openSpotlight;
    window.closeSpotlight = closeSpotlight;
    window.toggleModuleCollapse = toggleModuleCollapse;
    window.executeCoICalculation = executeCoICalculation;
    window.resetCoIDefaults = resetCoIDefaults;
    window.copyExecutiveMemo = copyExecutiveMemo;
    window.exportSowDefenseBrief = exportSowDefenseBrief;
    window.exportAirgapChecklist = exportAirgapChecklist;
    window.handleQuizAnswer = handleQuizAnswer;
    window.resetQuizQuestion = resetQuizQuestion;
    window.executePblChoice = executePblChoice;
    window.executePblTurn = executePblTurn;
    window.resetPblScenario = resetPblScenario;
    window.updateChecklistProgress = updateChecklistProgress;
    window.getChecklistActiveCount = getChecklistActiveCount;
    window.exportStudyRecords = exportStudyRecords;
    window.resetStudyProgress = resetStudyProgress;
    window.copyCode = copyCode;
    window.showToast = showToast;
    window.switchEngTab = switchEngTab;
    window.initAgentSimulator = initAgentSimulator;
    window.setSimScenario = setSimScenario;
    window.updateSimParams = updateSimParams;
    window.stepAgentSimulator = stepAgentSimulator;
    window.autoRunAgentSimulator = autoRunAgentSimulator;
    window.resetAgentSimulator = resetAgentSimulator;
    window.toggleSimFullscreen = toggleSimFullscreen;
    window.switchInspectTool = switchInspectTool;
    window.handleConceptQuiz = handleConceptQuiz;
    window.openSidebar = openSidebar;
    window.closeSidebar = closeSidebar;
    window.toggleSidebar = toggleSidebar;
    window.scrollToTop = scrollToTop;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initApp,
        isTypingActive,
        renderSidebar,
        loadSection,
        toggleItemCompleted,
        completedItems,
        quizAnswersState,
        handleQuizAnswer,
        resetQuizQuestion,
        executeCoICalculation,
        updateChecklistProgress,
        getChecklistActiveCount,
        executePblChoice,
        executePblTurn,
        resetPblScenario,
        getPblChoices,
        exportStudyRecords,
        resetStudyProgress,
        openSpotlight,
        closeSpotlight,
        showToast,
        switchEngTab,
        initAgentSimulator,
        setSimScenario,
        updateSimParams,
        stepAgentSimulator,
        autoRunAgentSimulator,
        resetAgentSimulator,
        toggleSimFullscreen,
        switchInspectTool,
        handleConceptQuiz,
        openSidebar,
        closeSidebar,
        toggleSidebar,
        scrollToTop
    };
}
