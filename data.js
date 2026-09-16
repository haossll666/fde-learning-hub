const FDE_ALL_DATA = {
  "meta": {
    "title": "FDE 全栈学习中心 | Forward Deployed Engineer Knowledge & Flight Simulator",
    "version": "2.0.0",
    "description": "专为企业级大模型落地打造的 FDE 完整知识体系、交付战役方法论、硬核工程代码与沙盒演练平台。"
  },
  "modules": [
    {
      "id": "intro",
      "title": "模块〇：FDE 的诞生、崛起与核心心智",
      "badge": "认知地基",
      "icon": "compass",
      "items": [
        {
          "id": "intro-1",
          "title": "0.1 为什么硅谷 FDE 需求激增 7 倍？麻省理工 95% 阵亡率报告",
          "summary": "模型能力商品化时代的残酷真相：没有交付，模型价值归零。",
          "content": "\n<div class=\"prose\">\n    <h3>一、数百万美元是如何在企业现场死掉的？</h3>\n    <p>2024~2025 年，麻省理工学院（MIT）NANDA 实验室发布了一份震动整个科技界的里程碑报告——<strong>《生成式人工智能的鸿沟》(The GenAI Divide)</strong>。该报告指出：全球财富 2000 强企业在生成式 AI 探索上投入了数百亿美元，然而<strong>高达 95% 的 PoC（概念验证）项目最终沦为无法产生任何财务价值的“科技玩具”，死在了发布会之后的生产上线前夜</strong>。</p>\n    \n    <div class=\"callout danger\">\n        <strong>95% 阵亡率的三个致命伤：</strong>\n        <ol>\n            <li><strong>“可用”与“可用作生产”的鸿沟：</strong>在 Jupyter Notebook 里 85% 准确率看起来很酷；但在银行反洗钱或医院处方审查现场，15% 的错误率足以引发上千万的监管罚单或灾难性医疗事故。</li>\n            <li><strong>数据沼泽（The Data Swamp）：</strong>企业真正的业务逻辑不在干净的训练集里，而散落在经过 15 年打补丁的 Oracle 库、命名混乱且缺失外键的 SAP 字段、甚至部门总监私人维护的加密 Excel 里。</li>\n            <li><strong>组织政治与抵触情绪：</strong>业务部门担心被 AI 取代或凭空增加审核负担，表面点头配合，实际拒绝提供真实标注样本与落地接口。</li>\n        </ol>\n    </div>\n\n    <p>与此同时，硅谷的招聘市场上，OpenAI、Anthropic、Palantir、Scale AI 以及 Y Combinator 孵化器里数百家头部 AI 公司，对同一个岗位的招聘需求在一年内飙升了 <strong>700% 以上</strong>——这个岗位就是 <strong>前线部署工程师（Forward Deployed Engineer，简称 FDE）</strong>。</p>\n\n    <div class=\"callout tip\">\n        <strong>核心公理：</strong>在开源与闭源基础模型几乎以每周为单位卷平跑分的时代，<strong>“模型已经不再稀缺，能把模型无损塞进客户真实业务流水线、为客户算清账本的人，才极度稀缺。”</strong>\n    </div>\n</div>\n"
        },
        {
          "id": "intro-2",
          "title": "0.2 Palantir 的核心哲学：“The Delta”与“产品化咨询”",
          "summary": "通用软件与脏乱差现实之间的最后 20%~30% 断层，以及如何避免沦为外包奴隶。",
          "content": "\n<div class=\"prose\">\n    <h3>一、什么是 “The Delta”（现场断层）？</h3>\n    <p>FDE 这个岗位不是 AI 时代凭空发明的，它的始祖是硅谷最具神秘色彩的大数据与情报软件巨头 <strong>Palantir</strong>。在为美国国防部、中央情报局以及摩根大通部署系统时，Palantir 总结出一个残酷的软件工程公理：</p>\n    \n    <div class=\"quote-box\">\n        “没有任何一款开箱即用的标准企业软件（COTS），可以直接无缝融入超大型企业的实际业务流程中。总部（HQ）研发的核心平台通常只能覆盖 70%~80% 的通用能力，而剩下的 20%~30% 则是极其肮脏、充斥着历史遗留包袱与特殊规则的现实断层。这段无法靠通用软件消除的差距，就是 <strong>The Delta</strong>。”\n    </div>\n\n    <p>传统软件公司的做法通常是两种极端：</p>\n    <ul>\n        <li><strong>传统 SaaS 巨头：</strong>拒绝修改底层代码，强迫客户重构自己的业务流程去迁就软件。结果是项目陷入长达数年的集成扯皮。</li>\n        <li><strong>传统外包/系统集成商（SI）：</strong>毫无原则地为客户进行定制化硬编码（Hard-coding），导致项目越多、代码越臃肿，技术债务滚雪球，边际交付成本递增。</li>\n    </ul>\n\n    <h3>二、Palantir 的破局解法：Productized Consulting（产品化咨询）</h3>\n    <p>FDE 的神圣职责不是做一次性外包，而是践行 <strong>产品化咨询（Productized Consulting）</strong>：</p>\n    <div class=\"diagram-card\">\n        <div class=\"flow-step\">\n            <span class=\"step-num\">Step 1</span>\n            <strong>深入现场</strong>\n            <p>FDE 拿到客户工卡与内网权限，坐进客户工位，在现场用代码抹平 Delta。</p>\n        </div>\n        <div class=\"flow-arrow\">➔</div>\n        <div class=\"flow-step\">\n            <span class=\"step-num\">Step 2</span>\n            <strong>抽象共性</strong>\n            <p>当连续在 3 个不同客户现场遇到相似的 Delta（如特定数据库 Connector、特定票据格式校验器）时，坚决抽象成标准化模块。</p>\n        </div>\n        <div class=\"flow-arrow\">➔</div>\n        <div class=\"flow-step\">\n            <span class=\"step-num\">Step 3</span>\n            <strong>反哺总部核心</strong>\n            <p>将抽象后的模块合并进公司核心平台（Core Product），让下一次交付该类客户时成本递减 50% 以上。</p>\n        </div>\n    </div>\n    \n    <div class=\"callout note\">\n        <strong>衡量 FDE 团队健康度的终极指标：定制递减率（Decaying Customization Rate）</strong><br>\n        交付第 1 个客户时，现场代码占比 30%；交付第 5 个客户时，现场代码占比必须压到 10% 以下。如果交付第 10 个客户依然需要大量重新手写业务逻辑，说明 FDE 组织正在堕落为低毛利的外包作坊。\n    </div>\n</div>\n"
        },
        {
          "id": "intro-3",
          "title": "0.3 岗位全景对比：FDE vs SWE vs SA vs 售前 vs 实施",
          "summary": "一张表彻底理清权责边界、核心产出与不可替代性。",
          "content": "\n<div class=\"prose\">\n    <div class=\"table-container\">\n        <table class=\"data-table\">\n            <thead>\n                <tr>\n                    <th>岗位角色</th>\n                    <th>工作主战场</th>\n                    <th>核心交付物</th>\n                    <th>考核北极星指标</th>\n                    <th>核心技能组合</th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr>\n                    <td><strong>后方研发 (SWE)</strong></td>\n                    <td>总部工位 / Git 仓库</td>\n                    <td>标准功能特性、底层架构、API 接口</td>\n                    <td>系统稳定性、吞吐量、代码覆盖率</td>\n                    <td>算法、分布式系统、代码重构</td>\n                </tr>\n                <tr>\n                    <td><strong>售前顾问 / 售前专家</strong></td>\n                    <td>客户会议室 / 投标现场</td>\n                    <td>方案 PPT、投标白皮书、商务报价</td>\n                    <td>商机线索签约率、签约合同金额</td>\n                    <td>公众演讲、客户商务公关、PPT 架构编排</td>\n                </tr>\n                <tr>\n                    <td><strong>解决方案架构师 (SA)</strong></td>\n                    <td>客户中高层会议 / 评审会</td>\n                    <td>技术白皮书、拓扑架构图、技术选型方案</td>\n                    <td>云资源消耗量（ARR / Consumption）</td>\n                    <td>云原生产品矩阵理解、高可用架构设计</td>\n                </tr>\n                <tr>\n                    <td><strong>传统实施运维工程师</strong></td>\n                    <td>客户机房 / 运维现场</td>\n                    <td>安装介质部署、网络调优、日常工单响应</td>\n                    <td>SLA 可用率、故障恢复时长 (MTTR)</td>\n                    <td>Linux 运维、网络配置、Shell 脚本编写</td>\n                </tr>\n                <tr class=\"highlight-row\">\n                    <td><strong>前线部署工程师 (FDE)</strong></td>\n                    <td><strong>直接坐进客户业务前线战壕</strong></td>\n                    <td><strong>端到端跑通的生产级 Agent / Pipeline + 财务价值闭环</strong></td>\n                    <td><strong>首次见效时间 (TTV)、PoC 转签约率、客户业务指标改善率</strong></td>\n                    <td><strong>双语翻译（业务↔代码）、48h 原生敏捷打法、防反弹抗 Scope Creep、企业合规攻坚</strong></td>\n                </tr>\n            </tbody>\n        </table>\n    </div>\n</div>\n"
        }
      ]
    },
    {
      "id": "campaigns",
      "title": "模块一：FDE 全生命周期交付六大关键战役",
      "badge": "实战战役",
      "icon": "shield",
      "items": [
        {
          "id": "c-1",
          "title": "1. 战役一：解决正确的问题与解剖 PoC 坟墓",
          "summary": "为什么绝大多数 AI 试点做着做着就死了？如何用 MVD 破局？",
          "content": "\n<div class=\"prose\">\n    <h3>一、概念验证坟墓（PoC Purgatory）的解剖病历</h3>\n    <p>企业级软件交付最可怕的结局不是客户在第一天拒绝你，而是<strong>双方热热闹闹地开工，做了 6 个月原型，最终没有一个人拍板买单，项目在无尽的推诿与冷处理中无疾而终</strong>——这就是行业内常说的“概念验证坟墓”。</p>\n    \n    <div class=\"callout warning\">\n        <strong>PoC 坟墓的三大病理特征：</strong>\n        <ul>\n            <li><strong>无终局指标：</strong>立项时只写了“探索大模型在智能合同审查中的应用”，没有量化指标。验收时客户业务负责人一句“我觉得还不够聪明”就能将项目永久搁置。</li>\n            <li><strong>缺乏内部冠军（Internal Champion）：</strong>对接人是一个没有预算权、也没有背负实际业务 KPI 的边缘技术研究员。项目做得再好，无法上达董事会。</li>\n            <li><strong>伪痛点挂帅：</strong>客户提出“我们想要一个能和员工闲聊企业文化的虚拟人”。这种只满足领导面子、无法削减成本或增加营收的需求，一旦遇到预算紧缩第一批被砍。</li>\n        </ul>\n    </div>\n\n    <h3>二、破局神器：MVD（最小可行部署）与训练营机制</h3>\n    <p>Palantir 解决 PoC 坟墓的杀手锏是 <strong>AIP 训练营（Bootcamp）模式</strong>，它彻底颠覆了长达数月的漫长试点：</p>\n    <div class=\"code-box\">\n        <strong>训练营法则：</strong><br>\n        1. 客户必须带 <strong>真实业务数据与真实操作员</strong> 入场；<br>\n        2. 周期严格压缩在 <strong>1 到 5 天以内</strong>；<br>\n        3. 目标只有一个：<strong>在现场跑通一个最小可行部署（MVD），当场让客户业务决策者看到真实价值发生。</strong>\n    </div>\n    <p>通过这种高强度、确定性的闪电验证，Palantir 将 PoC 转付费合同的转化率从早期的 10% 暴拉至 <strong>75% 以上</strong>。</p>\n</div>\n"
        },
        {
          "id": "c-2",
          "title": "2. 战役二：赢得客户、灯塔法则与警惕“需求蝗虫”",
          "summary": "挑选具有标杆行业信号的客户，坚决击退吸干团队又不产生复利的需求蝗虫。",
          "content": "\n<div class=\"prose\">\n    <h3>一、灯塔客户（Lighthouse Customer）的选择标准</h3>\n    <p>在开拓新行业或新领域时，第一个拿下谁，决定了未来两年的发展速度。优秀的 FDE 团队在进场前会严格审视客户属性：</p>\n    <ul>\n        <li><strong>高信号声誉（High Signal）：</strong>该客户是行业公认的标杆（如金融业的摩根士丹利、工业制造的空中客车）。一旦上线成功，其背书价值远超合同本身的金额。</li>\n        <li><strong>痛点剧烈（Acute Pain）：</strong>现有流程已经到了不改就会被监管重罚或被对手挤垮的生死边缘，改革阻力最小。</li>\n        <li><strong>高层坚定赞助（Executive Sponsorship）：</strong>有一号位或核心副总裁亲自站台，能够强力扫除跨部门数据调用的政治阻碍。</li>\n    </ul>\n\n    <h3>二、致命陷阱：警惕“需求蝗虫”（Scope Locust）</h3>\n    <div class=\"callout danger\">\n        <strong>什么是“需求蝗虫”客户？</strong><br>\n        这类客户通常预算充足、商务谈判热情极高，但在实际交付中会提出成百上千条极其奇葩、完全无法复用的定制化需求。他们会派出一整个委员会天天给 FDE 开会提修改意见，吸干公司最精锐工程师的所有时间与精力。但这些代码换到第二家客户那里，复用度为 0。\n    </div>\n    <p><strong>FDE 的战略定力：</strong>对于需求蝗虫客户，宁可丢单，也绝不能让其绑架整个产品演进路线。严格用 SOW（工作说明书）将需求划定在核心价值区。</p>\n</div>\n"
        },
        {
          "id": "c-3",
          "title": "3. 战役三：激活部署、首日魔咒与热修复文化",
          "summary": "上线不等于激活！如何用 5 分钟极速破冰解除一线员工的抵触？",
          "content": "\n<div class=\"prose\">\n    <h3>一、企业软件的“首日魔咒”</h3>\n    <p>很多技术人员以为系统成功部署到客户服务器、接口返回 HTTP 200 就大功告成了。然而现实是残酷的：<strong>90% 的企业员工在面对新上线的 AI 工具时，首日打开一次后便将其彻底遗忘，继续用回原来熟悉的笨办法。</strong></p>\n    \n    <div class=\"callout tip\">\n        <strong>FDE 激活三板斧：</strong>\n        <ol>\n            <li><strong>首日 5 分钟即时正反馈（Instant Gratification）：</strong>绝不要让用户面对一个空荡荡的输入框。必须预置真实业务场景中最常见、最棘手的模板（如“点击一键生成昨日本省信贷异常分析报告”），让操作员只需点一次鼠标，即可在 5 秒内看到震撼的业务结果。</li>\n            <li><strong>影子工作法（Shadowing）：</strong>FDE 必须搬着笔记本直接坐到最一线的操作员（如客服、审核员）身旁，静静观察他们一整天的真实操作，记录他们在哪一步皱眉、在哪一步切屏。那些最微小的摩擦点（Friction Point），正是决定采纳率的关键。</li>\n            <li><strong>部署期热修复文化（Hotfix Velocity）：</strong>当一线用户在内网反馈“这个按钮位置不方便”或“这个字段没解析出来”时，FDE 的响应速度必须以<strong>小时</strong>计算。当场修好发版，这种“神级响应速度”能瞬间将怀疑者转化为最坚定的内部拥护者。</li>\n        </ol>\n    </div>\n</div>\n"
        },
        {
          "id": "c-4",
          "title": "4. 战役四：守住续约、冠军流失与“有损服务”",
          "summary": "如何在客户关键人离职后保住阵地？面对极端异常时如何优雅退化？",
          "content": "\n<div class=\"prose\">\n    <h3>一、最危险的黑天鹅：内部冠军流失（Champion Churn）</h3>\n    <p>B2B 采购最残酷的规律是：<strong>买软件的高管与用软件的操作员不是同一批人，而且高管平均每 18~24 个月就会换岗或跳槽。</strong></p>\n    <p>如果你的项目高度依赖原赞助高管的个人信任（单点依赖），一旦该高管调任，继任者往往为了证明自己的新政，第一件事就是彻查并取消前任立项的所有外部采购。</p>\n    \n    <div class=\"callout warning\">\n        <strong>FDE 防翻车对策：</strong>\n        <ul>\n            <li><strong>向基层扎根：</strong>让系统真正嵌入每天 100 名基层员工的日常肌肉记忆中，做到“一旦停服，业务部门当天无法结账或下班”。</li>\n            <li><strong>建立季度量化价值账本（QBR Dashboard）：</strong>不要用口头汇报，定期向新任高管提交冰冷无情的财务事实：“过去一年，该系统为贵部门自动处理了 140 万份单据，抵御了 42 次合规风险，累计释放人力成本折合约 380 万元”。</li>\n        </ul>\n    </div>\n\n    <h3>二、工程防线：“有损服务”（Graceful Degradation）</h3>\n    <p>在面对企业高峰流量、大模型原厂 API 超时宕机、或客户底层网络断连时，系统绝不能直接弹出一行刺眼的 <code>Internal Server Error 500</code>。</p>\n    <p>FDE 必须设计多层退化兜底机制：<strong>当大模型不可用时，自动降级为基于规则与正则表达式的传统解析引擎；当外部向量库超时，降级为本地精确关键词搜索</strong>。宁可牺牲 10% 的智能化体验，也必须确保核心业务流永不中断。</p>\n</div>\n"
        },
        {
          "id": "c-5",
          "title": "5. 战役五：扩大收入、按结果收费与存量深耕",
          "summary": "从一个边缘部门渗透进一张企业级大网，重塑 B2B 软件定价心理学。",
          "content": "\n<div class=\"prose\">\n    <h3>一、按结果收费（Outcome-Based Pricing）的降维打击</h3>\n    <p>传统的按人头席位收费（Per-Seat License）在 AI 时代正在崩塌——因为 AI 的本质是<strong>提高效率、减少人头</strong>。如果按席位收费，客户效率越高、使用人数越少，软件厂商赚的钱反而越少，这形成了利益冲突。</p>\n    <div class=\"callout tip\">\n        <strong>Anthropic / Palantir 式定价创新：</strong>\n        <ul>\n            <li><strong>不为软件买单，为“被解决的业务事件”买单：</strong>例如每成功自动处理并闭环一份复杂报关单收取 2 美元；每成功追回一笔疑似欺诈交易，抽取挽回资金的 5%。</li>\n            <li><strong>双赢结构：</strong>客户没有任何前期高额采购顾虑，只在实际产生业务增益时支付分成。厂商凭借极高的系统稳定性与准确率获得极度可观的利润空间。</li>\n        </ul>\n    </div>\n\n    <h3>二、存量深耕的“海星扩张战术”</h3>\n    <p>FDE 的突破口往往是客户内部最苦、最累、其他部门都不愿意碰的边缘脏活（例如退货物流异常标记）。一旦在这个点上打透并建立极高口碑，FDE 迅速顺藤摸瓜：</p>\n    <p>从退货单 ➔ 进销存数据 ➔ 采购供应链对账 ➔ 财务审计风控。<strong>最终将单个点状的 PoC 扩展为横跨企业三大核心部门的核心数据操作系统。</strong></p>\n</div>\n"
        },
        {
          "id": "c-6",
          "title": "6. 战役六：规模化复制、Playbook 沉淀与产品化打磨",
          "summary": "打赢一场战役是偶然，打赢十场战役靠标准化打法手册。",
          "content": "\n<div class=\"prose\">\n    <h3>一、从“英雄主义”走向“工业化交付”</h3>\n    <p>优秀的 FDE 早期往往依靠极强的个人综合素质（全栈编码能力 + 敏锐商业直觉 + 极高抗压心理）力挽狂澜。但如果一家公司全靠“特种兵个人英雄主义”，交付团队一旦扩张到 50 人以上就会发生严重的质量稀释与管理失控。</p>\n    \n    <div class=\"callout note\">\n        <strong>必须标准化的三大交付资产（Playbook）：</strong>\n        <ol>\n            <li><strong>行业数据本体模板（Vertical Ontology Kits）：</strong>针对金融、医疗、智能制造等特定垂直行业，预置标准的数据对象、关系图谱和常用工具集。</li>\n            <li><strong>标准审查通关包（Security & Compliance Fast-Pass）：</strong>将所有法务部门高频刁难的合规条款、网络架构图、渗透测试报告、DLP 审计预设打包成标准化文档库，将原本需要 3 个月的安全审查压缩至 3 天。</li>\n            <li><strong>自动化 Golden Test Set 生成流水线：</strong>入场后自动根据客户历史日志生成评测基线集，降低人工准备测试集的门槛。</li>\n        </ol>\n    </div>\n</div>\n"
        }
      ]
    },
    {
      "id": "engineering",
      "title": "模块二：FDE 硬核工程手艺武器库（无黑盒实战）",
      "badge": "原生工程",
      "icon": "code",
      "items": [
        {
          "id": "eng-1",
          "title": "1. 生产级 ReAct 循环与状态机：为什么我们要删掉 LangChain？",
          "summary": "用纯原生代码构建可观察、可调试、带熔断保护的 Agent 决策引擎。",
          "content": "\n<div class=\"prose\">\n    <h3>一、为什么成熟的生产环境正在全面摒弃重型黑盒框架？</h3>\n    <p>在企业级 SLA（99.9% 稳定性）面前，许多开源重量级框架暴露出了致命缺点：过度抽象导致的重试黑盒、难以注入自定义审计追踪日志、版本频繁更新引发的 Breaking Changes，以及无法精准控制的上下文膨胀。</p>\n    <p>现代生产级 FDE 推崇<strong>“用原生 Python/TypeScript + 状态机模式（Finite State Machine）实现极其透明的 Agent 控制流”</strong>。</p>\n\n    <div class=\"code-header\">\n        <span>Python: 企业级带状态守卫与熔断控制的 Agent 引擎</span>\n        <button class=\"copy-btn\" onclick=\"copyCode(this)\">复制代码</button>\n    </div>\n    <pre><code class=\"language-python\">import json\nimport logging\nfrom typing import Dict, Any, List, Callable\n\nlogger = logging.getLogger(\"EnterpriseAgent\")\n\nclass ResilientEnterpriseAgent:\n    def __init__(self, client, tools: List[Callable], max_steps: int = 6, token_budget: int = 8000):\n        self.client = client\n        self.tool_map = {func.__name__: func for func in tools}\n        self.max_steps = max_steps\n        self.token_budget = token_budget\n\n    def execute(self, user_intent: str, system_context: str) -> Dict[str, Any]:\n        history = [\n            {\"role\": \"system\", \"content\": system_context},\n            {\"role\": \"user\", \"content\": user_intent}\n        ]\n        \n        step_count = 0\n        total_tokens_consumed = 0\n        execution_trace = []\n\n        while step_count < self.max_steps:\n            step_count += 1\n            logger.info(f\"==> 执行第 {step_count}/{self.max_steps} 步推理循环\")\n\n            try:\n                response = self.client.chat.completions.create(\n                    model=\"gpt-4o\",\n                    messages=history,\n                    tools=[self._build_tool_spec(t) for t in self.tool_map.values()],\n                    tool_choice=\"auto\",\n                    temperature=0.1 # 生产环境强调确定性，低温运行\n                )\n            except Exception as net_err:\n                logger.error(f\"模型调用网络异常: {net_err}\")\n                return {\"status\": \"FAILED\", \"reason\": \"API_TIMEOUT\", \"trace\": execution_trace}\n\n            msg = response.choices[0].message\n            history.append(msg)\n            \n            # 统计消耗与安全预算熔断\n            if hasattr(response, 'usage') and response.usage:\n                total_tokens_consumed += response.usage.total_tokens\n                if total_tokens_consumed > self.token_budget:\n                    logger.warning(\"触发 Token 预算熔断拦截\")\n                    return {\"status\": \"ABORTED\", \"reason\": \"TOKEN_BUDGET_EXCEEDED\"}\n\n            # 判定：模型认为无需再调工具，给出最终结论\n            if not msg.tool_calls:\n                return {\n                    \"status\": \"SUCCESS\",\n                    \"final_output\": msg.content,\n                    \"steps\": step_count,\n                    \"tokens\": total_tokens_consumed\n                }\n\n            # 受控执行工具并捕获任何异常，严禁进程崩溃\n            for call in msg.tool_calls:\n                fn_name = call.function.name\n                call_id = call.id\n                raw_args = call.function.arguments\n\n                if fn_name not in self.tool_map:\n                    output = {\"error\": f\"Tool {fn_name} 未在沙箱中注册授权\"}\n                else:\n                    try:\n                        args = json.loads(raw_args)\n                        output = self.tool_map[fn_name](**args)\n                    except Exception as exec_err:\n                        logger.error(f\"工具 {fn_name} 现场运行崩溃: {exec_err}\")\n                        output = {\"error\": f\"工具执行失败: {str(exec_err)}\", \"retry_hint\": \"请检查输入参数类型\"}\n\n                execution_trace.append({\"step\": step_count, \"tool\": fn_name, \"status\": \"executed\"})\n                history.append({\n                    \"role\": \"tool\",\n                    \"tool_call_id\": call_id,\n                    \"content\": json.dumps(output, ensure_ascii=False)\n                })\n\n        return {\"status\": \"MAX_STEPS_REACHED\", \"trace\": execution_trace}\n</code></pre>\n</div>\n"
        },
        {
          "id": "eng-2",
          "title": "2. 结构化输出（Structured Outputs）：基于 Pydantic 的刚性防御",
          "summary": "消除不可靠的字符串截取，让 LLM 与企业下游数据库实现 100% 格式对齐。",
          "content": "\n<div class=\"prose\">\n    <h3>一、下游服务对格式漂移的“零容忍”</h3>\n    <p>在面对客户传统的 Oracle 数据库或 SAP 接口时，字段命名大小写错误、日期从 <code>YYYY-MM-DD</code> 突变成 <code>YYYY/MM/DD</code>、或者把浮点数包裹成字符串，都会直接导致下游批处理任务全线崩溃。</p>\n    \n    <div class=\"callout tip\">\n        <strong>FDE 核心法宝：基于约束解码（Constrained Decoding）与 Pydantic 强类型的刚性校验</strong>\n    </div>\n\n    <div class=\"code-header\">\n        <span>Python: 企业级强类型审查防御示例</span>\n        <button class=\"copy-btn\" onclick=\"copyCode(this)\">复制代码</button>\n    </div>\n    <pre><code class=\"language-python\">from pydantic import BaseModel, Field, field_validator\nfrom typing import List, Literal\nfrom datetime import datetime\n\nclass DiscrepancyItem(BaseModel):\n    field_name: str = Field(description=\"出现不一致的字段名称\")\n    contract_val: str = Field(description=\"合同原文表述\")\n    invoice_val: str = Field(description=\"发票记载数值\")\n    severity: Literal[\"HIGH\", \"MEDIUM\", \"LOW\"] = Field(description=\"风险等级\")\n\nclass SettlementAuditSchema(BaseModel):\n    batch_number: str = Field(description=\"严格格式: BATCH-YYYYMMDD-XXXX\")\n    vendor_tax_id: str = Field(description=\"18位统一社会信用代码\")\n    total_reconciled_amount: float = Field(ge=0, description=\"对账总金额，必须大于等于0\")\n    discrepancies: List[DiscrepancyItem] = Field(default_factory=list)\n    final_disposition: Literal[\"APPROVE\", \"REJECT\", \"ESCALATE_TO_HUMAN\"]\n\n    @field_validator(\"batch_number\")\n    def validate_batch_format(cls, v):\n        if not v.startswith(\"BATCH-\"):\n            raise ValueError(\"批次号前缀格式不符\")\n        return v\n\n# 原生调用保障 100% JSON Schema 一致性\nresponse = client.beta.chat.completions.parse(\n    model=\"gpt-4o\",\n    messages=[\n        {\"role\": \"system\", \"content\": \"进行结算对账严格审计。遵守所有字段规则。\"},\n        {\"role\": \"user\", \"content\": raw_unstructured_audit_text}\n    ],\n    response_format=SettlementAuditSchema\n)\nclean_record: SettlementAuditSchema = response.choices[0].message.parsed\nprint(f\"安全解析结果，最终决策: {clean_record.final_disposition}\")\n</code></pre>\n</div>\n"
        },
        {
          "id": "eng-3",
          "title": "3. Anthropic MCP（Model Context Protocol）企业实战协议",
          "summary": "如何用行业标准协议将企业数据源与工具无缝插拔？",
          "content": "\n<div class=\"prose\">\n    <h3>一、MCP 解决了什么历史难题？</h3>\n    <p>过去，每当要让模型连接企业内部的 GitLab、PostgreSQL 或 Jira，工程师都需要针对不同的 LLM SDK 手工手写一套适配层工具。当工具扩展到数十个时，代码维护陷入噩梦。</p>\n    <p><strong>MCP（Model Context Protocol，由 Anthropic 发起并开源）</strong>定义了一套基于 JSON-RPC 2.0 的客户端-服务端协议标准。企业只需要为自己的内部数据源开发一次 MCP Server，任何支持 MCP 的 Agent 即可即插即用。</p>\n\n    <div class=\"callout note\">\n        <strong>MCP 架构的三大核心能力：</strong>\n        <ul>\n            <li><strong>Resources（静态只读数据上下文）：</strong>例如将内网的文件、API 架构文档作为类似文件的资源暴露给模型。</li>\n            <li><strong>Prompts（受控提示词模板）：</strong>预置企业批准的高质量交互提示词。</li>\n            <li><strong>Tools（可执行函数与动态行为）：</strong>模型可调用的业务操作（如执行 SQL 查询、创建审批工单）。</li>\n        </ul>\n    </div>\n</div>\n"
        },
        {
          "id": "eng-4",
          "title": "4. 绝密基线：Air-Gapped 物理隔离网部署全景指南",
          "summary": "单向光闸、脱机私有化部署、零网络遥测防泄漏（DLP）实战规范。",
          "content": "\n<div class=\"prose\">\n    <h3>一、最硬核的现场：没有外网连接的世界</h3>\n    <p>很多初级工程师习惯了 <code>pip install</code>、<code>docker pull</code> 以及通过公网请求 OpenAI API。但一旦踏入国家电网、军工集团或四大国有银行核心机房，你面临的将是 <strong>完全物理断网（Air-Gapped）的环境</strong>。</p>\n    \n    <div class=\"callout danger\">\n        <strong>Air-Gapped 部署的四大红线与避坑法则：</strong>\n        <ol>\n            <li><strong>严禁动态依赖拉取：</strong>所有容器必须打包为完整的 <code>.tar</code> 离线镜像；所有 Python 依赖必须预先下载成包含完整 C 绑定的 <code>.whl</code> 离线目录（通过 <code>pip download --platform manylinux...</code> 准备）。</li>\n            <li><strong>单向光闸（Data Diode）数据摆渡：</strong>数据只能单向流入，严禁反向回传。代码更新需要经过漫长的移动存储介质杀毒与多重保密审批。</li>\n            <li><strong>零遥测（Zero-Telemetry）彻底排查：</strong>很多流行开源库（包括某些大模型 SDK、数据分析库甚至前端框架）默认内置了 Google Analytics、Sentry 或 GitHub 版本检查。在隔离网内，这些请求会导致系统长时间超时卡死，更会触发客户安全运营中心（SOC）的违规外联红灯。<strong>部署前必须全局 Grep 并彻底封杀所有外联请求。</strong></li>\n            <li><strong>本地轻量化模型推理引擎：</strong>配置经过硬件加速优化的本地推理后端（如 vLLM、Ollama、TensorRT-LLM），并做好显存与并发量压测基线。</li>\n        </ol>\n    </div>\n</div>\n"
        },
        {
          "id": "eng-5",
          "title": "5. Evals 驱动开发：RAGAS 体系与自动评测流水线",
          "summary": "把评测作为主骨架：Faithfulness、Relevance、Precision、Recall 数学定义与代码实操。",
          "content": "\n<div class=\"prose\">\n    <h3>一、拒绝玄学，用确定性标尺打赢质量验收</h3>\n    <p>当客户业务主管说“你们的回答好像有点问题”时，业余团队会盲目修改 Prompt，结果往往拆东墙补西墙。顶尖 FDE 团队在入场第 1 周就会建立 <strong>自动化评测指标看板（Evaluation Harness）</strong>。</p>\n\n    <div class=\"table-container\">\n        <table class=\"data-table\">\n            <thead>\n                <tr>\n                    <th>评测维度</th>\n                    <th>核心评估意图</th>\n                    <th>计算机制 / 数学逻辑</th>\n                    <th>及格基准线</th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr>\n                    <td><strong>Faithfulness (忠实度)</strong></td>\n                    <td>衡量输出内容是否 100% 来自检索到的上下文证据，严查无依据的幻觉</td>\n                    <td>(模型输出中可由检索上下文证明的命题数量) / (输出中包含的事实命题总数)</td>\n                    <td><strong>&gt; 95%</strong> (金融/医疗必须 100%)</td>\n                </tr>\n                <tr>\n                    <td><strong>Answer Relevance (相关性)</strong></td>\n                    <td>衡量回答是否切中用户问题的核心，有无车轱辘废话</td>\n                    <td>通过 Embedding 向量相似度比对生成回答与原始提问的语义契合度</td>\n                    <td><strong>&gt; 88%</strong></td>\n                </tr>\n                <tr>\n                    <td><strong>Context Precision (排序精度)</strong></td>\n                    <td>衡量检索返回的 Top-K 文档切片中，真正有价值的信息是否靠前</td>\n                    <td>类似信息检索中的平均精度均值（Mean Average Precision）</td>\n                    <td><strong>&gt; 85%</strong></td>\n                </tr>\n                <tr>\n                    <td><strong>Context Recall (召回率)</strong></td>\n                    <td>衡量回答该问题所必需的客观事实，切片是否全部覆盖到位</td>\n                    <td>(检索内容中命中的黄金答案事实点数量) / (黄金事实点总数)</td>\n                    <td><strong>&gt; 90%</strong></td>\n                </tr>\n            </tbody>\n        </table>\n    </div>\n</div>\n"
        }
      ]
    },
    {
      "id": "practice",
      "title": "模块三：实战沙盒演练与原子手艺 Kata（项目制 PBL）",
      "badge": "动手淬炼",
      "icon": "zap",
      "items": [
        {
          "id": "pbl-1",
          "title": "1. 沙盒挑战 1：48小时极速搞定金融报表合规审查 Agent",
          "summary": "【项目制演练】模拟真实复杂现场，克服缺失主键、扫描件反光与单向网络约束。",
          "content": "\n<div class=\"prose\">\n    <div class=\"challenge-banner\">\n        <span class=\"badge red\">PBL 模拟实战</span>\n        <h4>任务背景：某国有城商行信贷合规部</h4>\n    </div>\n    <p><strong>业务痛点：</strong>信贷部每天接收上百家中小微企业提交的审计报告与财务完税证明。过去依靠 8 名初级专员人工对照央行最新防范洗钱与虚假开票规范，每份耗时 45 分钟，漏检率约 12%，且因审核堆积导致贷款审批周期长达 5 天。</p>\n    \n    <div class=\"callout warning\">\n        <strong>恶劣约束条件：</strong>\n        <ul>\n            <li>客户内网严禁连接公网，仅提供本地配备单张 A100 GPU 的物理服务器；</li>\n            <li>历史财务报表大量为倾斜、存在印章遮挡的 PDF 扫描件；</li>\n            <li>必须在周五下午向信贷部总监进行现场实操演示（距当前仅剩 48 小时）。</li>\n        </ul>\n    </div>\n\n    <h4>【通关步骤指引】</h4>\n    <ol>\n        <li><strong>第 1 阶段（现场数据采样，4小时）：</strong>绝不试图通吃所有材料，让合规组长挑出最痛苦的 30 份典型样本（10 份合规、10 份明显造假、10 份处于灰色边缘争议案件），构建初始 Golden Test Set。</li>\n        <li><strong>第 2 阶段（本地离线多模态流水线，14小时）：</strong>部署本地量化版视觉大模型（如 Qwen2-VL / MiniCPM-V），结合 PaddleOCR 引擎，只提取三张表（资产负债表、利润表、现金流量表）的钩稽关系核心字段。</li>\n        <li><strong>第 3 阶段（刚性规则+大模型双核引擎，16小时）：</strong>数字计算严禁让大模型心算，提取出纯结构化 JSON 后，交由 Python 规则引擎进行毫厘不差的财务平衡验算；大模型仅负责对审计师附注中的“重大未决诉讼与关联交易”进行语义级风险标注。</li>\n        <li><strong>第 4 阶段（高保真对比 UI，10小时）：</strong>制作轻量级 Web UI，左侧显示原始 PDF 并自动高亮可疑红框，右侧显示自动生成的合规审查意见书与风险引用锚点。周五当场演示 10 秒识别偷逃税蛛丝马迹，直接拿下正式采购批文。</li>\n    </ol>\n</div>\n"
        },
        {
          "id": "pbl-2",
          "title": "2. 原子手艺 Kata：30分钟手写防御型 Agent 循环（刻意练习）",
          "summary": "【代码肌肉记忆】不看文档、脱离框架，徒手实现带状态机与安全熔断的 Agent。",
          "content": "\n<div class=\"prose\">\n    <p><strong>训练目标：</strong>请打开一个空白终端，在 30 分钟内徒手用 Python 编写满足以下要求的生产级 Agent 循环：</p>\n    <div class=\"checklist-card\">\n        <label><input type=\"checkbox\"> 1. 包含 <code>max_turns</code> 最大轮数硬限制，防止死循环无限消耗费用</label>\n        <label><input type=\"checkbox\"> 2. 具备工具执行异常捕获，并在 tool message 中以友好方式回传错误原因供模型自行纠偏</label>\n        <label><input type=\"checkbox\"> 3. 具备 Token 消耗累加器，当单次任务消耗超过预设阀值时立即安全熔断</label>\n        <label><input type=\"checkbox\"> 4. 支持最终结论的 Pydantic 强类型格式化输出解析</label>\n    </div>\n    <div class=\"callout tip\">\n        <strong>评估标准：</strong>代码无需任何三方 Agent 框架，仅依赖官方基础 SDK 与标准库，能够在不稳定的弱网环境下稳健运行且无内存泄漏。\n    </div>\n</div>\n"
        }
      ]
    },
    {
      "id": "metrics",
      "title": "模块四：常用指标库、行业黑话与交互工具箱",
      "badge": "量化工具",
      "icon": "calculator",
      "items": [
        {
          "id": "m-jargon",
          "title": "1. FDE 交付现场 24+ 核心黑话词典（范冰原著完整收录）",
          "summary": "每词一句人话，彻底消除与硅谷及行业专家的沟通代沟。",
          "content": "\n<div class=\"prose\">\n    <div class=\"glossary-grid\">\n        <div class=\"glossary-item\">\n            <strong>本体（Ontology）</strong>\n            <p>把企业混乱的数据库表、业务逻辑和员工日常操作，翻译重组成大模型能够理解的统一语义层与对象关系网。</p>\n        </div>\n        <div class=\"glossary-item\">\n            <strong>训练营（Bootcamp）</strong>\n            <p>客户带着真实业务数据来，在 1 到 5 天内做出能用的端到端原型，高管现场敲定采购预算。</p>\n        </div>\n        <div class=\"glossary-item\">\n            <strong>回声 / 三角洲（Echo / Delta）</strong>\n            <p>Palantir 经典双人特种组合：Echo（业务领航员）负责读懂客户潜台词与组织政治；Delta（技术特种兵）负责现场敲代码解决技术死结。</p>\n        </div>\n        <div class=\"glossary-item\">\n            <strong>概念验证坟墓（PoC Purgatory）</strong>\n            <p>无限期、无清晰量化指标、无裁决拍板人的无休止试点，做着做着就死在半路上。</p>\n        </div>\n        <div class=\"glossary-item\">\n            <strong>最小可行部署（MVD）</strong>\n            <p>用最精简的工程投入，在最真实的客户环境里完整验证一次真实价值的发生。</p>\n        </div>\n        <div class=\"glossary-item\">\n            <strong>影子工作法（Shadowing）</strong>\n            <p>搬把椅子坐在真实业务用户身旁，静静观察并记录他度过完整的一天，洞察真实摩擦。</p>\n        </div>\n        <div class=\"glossary-item\">\n            <strong>灯塔客户（Lighthouse Customer）</strong>\n            <p>具有强烈行业风向标意义的标杆客户，其行业示范与公信力背书价值远超合同本身。</p>\n        </div>\n        <div class=\"glossary-item\">\n            <strong>需求蝗虫（Scope Locust）</strong>\n            <p>预算看似充裕但需求极度个性化杂乱、吸干团队全部精力却不产生任何可复用复利的客户。</p>\n        </div>\n        <div class=\"glossary-item\">\n            <strong>定制递减率（Decaying Customization）</strong>\n            <p>交付第 N 个客户时现场编写的代码量应显著低于第 1 个客户；如果不降反升，说明已经沦落为传统外包。</p>\n        </div>\n        <div class=\"glossary-item\">\n            <strong>有损服务（Graceful Degradation）</strong>\n            <p>在核心模型服务不可用时，系统自动降级为规则匹配或离线索引，保障客户核心业务绝不宕机中断。</p>\n        </div>\n    </div>\n</div>\n"
        },
        {
          "id": "m-calc",
          "title": "2. 交互式现场核武器：Cost of Inaction (CoI) 商业价值测算器",
          "summary": "输入客户实际业务数据，一键测算拖延上线的真实财务沉没损失。",
          "content": "\n<div class=\"prose\">\n    <p>在向客户高层汇报时，谈“Prompt 调优和召回率”会被认为是技术炫技，谈<strong>“由于低效流程，贵司每天在无形中亏损多少钱”</strong>才能瞬间触动灵魂：</p>\n    \n    <div class=\"calculator-card\">\n        <div class=\"calc-grid\">\n            <div class=\"calc-field\">\n                <label>该业务线专职处理员工数（人）：</label>\n                <input type=\"number\" id=\"coi_staff\" value=\"30\" min=\"1\">\n            </div>\n            <div class=\"calc-field\">\n                <label>员工平均综合用工月成本（元/人/月）：</label>\n                <input type=\"number\" id=\"coi_salary\" value=\"16000\" min=\"1000\">\n            </div>\n            <div class=\"calc-field\">\n                <label>每日在重复机械性事务上的耗时比例（%）：</label>\n                <input type=\"number\" id=\"coi_pct\" value=\"45\" min=\"5\" max=\"100\">\n            </div>\n            <div class=\"calc-field\">\n                <label>过去一年因人工处理错误导致的违约/罚款/漏损总额（万元）：</label>\n                <input type=\"number\" id=\"coi_loss\" value=\"80\" min=\"0\">\n            </div>\n        </div>\n        <button class=\"action-btn\" onclick=\"executeCoICalculation()\">🚀 立即生成高管商业说服报告</button>\n\n        <div id=\"coi_output\" class=\"result-box hidden\">\n            <h4>📊 测算推演报告 (Executive Briefing)：</h4>\n            <div class=\"kpi-cards\">\n                <div class=\"kpi-card danger\">\n                    <span class=\"label\">每月纯低效人力沉没成本</span>\n                    <span class=\"val\" id=\"val_waste_monthly\">¥216,000</span>\n                </div>\n                <div class=\"kpi-card danger\">\n                    <span class=\"label\">企业每拖延 1 个月的综合不作为成本 (CoI)</span>\n                    <span class=\"val\" id=\"val_coi_monthly\">¥282,667</span>\n                </div>\n                <div class=\"kpi-card success\">\n                    <span class=\"label\">系统部署首年预计净释放商业价值</span>\n                    <span class=\"val\" id=\"val_annual_gain\">¥3,392,000</span>\n                </div>\n            </div>\n            <div class=\"talk-track\">\n                <strong>💡 建议谈判话术：</strong>\n                <p>“张总，我们这个项目哪怕晚签约进场 2 个月，贵司在此期间因为重复劳动消耗和潜在合规错误造成的直接现金流损失就超过 56 万元。现在启动 48 小时 MVD 验证，您没有任何财务下行风险，却能立即止血。”</p>\n            </div>\n        </div>\n    </div>\n</div>\n"
        },
        {
          "id": "m-checklist",
          "title": "3. 现场交付防波堤：SOW 边界与 Air-Gap 交付双清单",
          "summary": "进场前与离线部署前的必备检查项，逐一勾选确保零事故。",
          "content": "\n<div class=\"prose\">\n    <div class=\"dual-checklist\">\n        <div class=\"checklist-panel\">\n            <h4>📋 SOW 需求边界防御清单</h4>\n            <div class=\"check-group\">\n                <label><input type=\"checkbox\" onchange=\"updateChecklistProgress()\"> 1. 是否在合同中严格锁死输入数据类型（如仅支持文字类 PDF，不支持手写模糊复印件）？</label>\n                <label><input type=\"checkbox\" onchange=\"updateChecklistProgress()\"> 2. 是否明确量化了验收指标（如“在 200 份标准集上准确率≥92% 即视为通过 UAT”）？</label>\n                <label><input type=\"checkbox\" onchange=\"updateChecklistProgress()\"> 3. 是否设置了“Phase 2 待办池”，所有现场新增想法一律打入二期预算？</label>\n                <label><input type=\"checkbox\" onchange=\"updateChecklistProgress()\"> 4. 是否明确了客户配合人与数据提供的最后时限（防止客户拖延交付）？</label>\n            </div>\n        </div>\n        <div class=\"checklist-panel\">\n            <h4>🔒 Air-Gap 离线内网排雷清单</h4>\n            <div class=\"check-group\">\n                <label><input type=\"checkbox\" onchange=\"updateChecklistProgress()\"> 1. 是否全代码排查并移除了所有默认联网 Telemetry 统计代码？</label>\n                <label><input type=\"checkbox\" onchange=\"updateChecklistProgress()\"> 2. 容器镜像是否已固化所有本地模型权重与动态 C 动态库？</label>\n                <label><input type=\"checkbox\" onchange=\"updateChecklistProgress()\"> 3. 前端 UI 是否完全剔除了外部公共 CDN 字体与 JS 引用？</label>\n                <label><input type=\"checkbox\" onchange=\"updateChecklistProgress()\"> 4. 离线移动存储介质是否已提前通过客户内网防病毒合规扫描？</label>\n            </div>\n        </div>\n    </div>\n</div>\n"
        }
      ]
    },
    {
      "id": "quizzes",
      "title": "模块五：实战考场与综合能力通关演练",
      "badge": "通关测验",
      "icon": "award",
      "items": [
        {
          "id": "q-interactive",
          "title": "1. 现场实战决策全景题库（带深度裁判与解析）",
          "summary": "10 道高保真现场困境单选/多选题，检验你的 FDE 综合决策段位。",
          "content": "\n<div class=\"prose\">\n    <div id=\"quiz-mount-point\">\n        <!-- 动态渲染题目 -->\n    </div>\n</div>\n"
        }
      ]
    }
  ],
  "full_quizzes": [
    {
      "id": 1,
      "q": "【场景题：面对 Scope Creep】在为一家银行交付合同智能比对 Agent 的第 3 周，业务主管非常兴奋，要求在下周验收演示中顺便加上“对企业财报数据的自动提取与风控打分功能”。作为主导 FDE，以下哪种做法最专业？",
      "opts": [
        "A. 客户是上帝，熬夜加班把财报提取功能做出来，争取在演示中给领导一个巨大惊喜。",
        "B. 明确拒绝并指责客户违背契约，搬出法律条款告知这完全不在原定工作范围内。",
        "C. 认可业务价值，指出为了保障一期核心指标按时高质量验收上线，建议将财报风控列入 Phase 2 专属规划，并在 SOW 变更备忘录中做好记录。",
        "D. 让客户去找公司总部的销售重新谈合同，自己现场完全不过问。"
      ],
      "ans": 2,
      "exp": "优秀 FDE 必须兼顾‘客户关系维护’与‘项目防波堤’。无原则顺从会导致一期交付延误、质量崩塌；生硬拒绝破坏客户信任。最专业的做法是‘承接意图、锁定一期边界、导向二期商业合同’。"
    },
    {
      "id": 2,
      "q": "【架构题：防下游系统崩溃】在将大语言模型生成的结算数据对接入客户核心 ERP（SAP）系统时，为了避免下游接口解析崩溃，以下哪项设计最具防御性？",
      "opts": [
        "A. 在 Prompt 里强调‘你必须输出标准 JSON，严禁输出 markdown 代码块’。",
        "B. 使用带有 Pydantic 强类型严格校验的 Structured Outputs，并在调用下游 API 前增加二次 Schema 校验守门员。",
        "C. 写一套复杂的正则表达式去截取字符串中的数字和括号。",
        "D. 遇到格式不匹配时，自动重试调用大模型 10 次直到格式正确。"
      ],
      "ans": 1,
      "exp": "Prompt 提示词是软约束，在极端并发下仍有概率漂移。基于约束解码（Constrained Decoding）与 Pydantic 强类型 Schema 是企业生产集成的生命线。"
    },
    {
      "id": 3,
      "q": "【商业常识：Palantir 哲学】Palantir 强调的‘The Delta’在企业工程实践中本质是指什么？",
      "opts": [
        "A. 客户预算和公司报价之间的价格差额。",
        "B. 标准化通用产品与客户脏乱差的现实业务、老旧系统之间客观存在的最后 20%~30% 断层。",
        "C. 模型的理论准确率与实际准确率之间的数学误差。",
        "D. 销售承诺的功能和工程师实际交付功能之间的差距。"
      ],
      "ans": 1,
      "exp": "The Delta 是标准化通用软件与企业现实复杂性之间的客观物理鸿沟。FDE 的核心价值就是以极高的效率抹平它，并将现场沉淀出的共性模块反哺回 HQ 核心平台。"
    },
    {
      "id": 4,
      "q": "【安全合规：物理隔离网】在 Air-Gapped（完全不联网的绝密机房）进行私有化部署时，以下哪项操作会导致致命灾难？",
      "opts": [
        "A. 提前将所有模型权重固化为本地量化格式（如 GGUF 或 AWQ）。",
        "B. 引入的三方开源库在 import 时默认尝试向外网发送版本检测或匿名 Telemetry 数据。",
        "C. 将前端资产全部本地打包，不调用外部公共 CDN 静态库。",
        "D. 将服务完整打包为独立的本地 Docker tar 镜像并使用私有 Registry 导入。"
      ],
      "ans": 1,
      "exp": "在单向光闸隔离网内，静默的外联请求会造成长时间超时卡死，更会触发客户安全运营中心（SOC）的违规外联红牌告警。"
    },
    {
      "id": 5,
      "q": "【质量度量：RAGAS 评测】在客户反映‘机器人经常信口雌黄、编造政策法规’时，FDE 应当优先重点优化评估体系中的哪一项核心指标？",
      "opts": [
        "A. Answer Relevance（答案相关性）",
        "B. Latency（第一字输出延迟）",
        "C. Faithfulness（真实忠实度/无幻觉率）",
        "D. Context Precision（上下文排序精度）"
      ],
      "ans": 2,
      "exp": "Faithfulness 专门度量生成内容能被参考依据严格证明的比例，是抑制和诊断大模型幻觉的最核心标尺。"
    },
    {
      "id": 6,
      "q": "【交付战略：MVD 理念】关于‘最小可行部署（MVD）’与传统‘Demo 演示’的区别，以下理解最准确的是？",
      "opts": [
        "A. Demo 是在干净的测试集上给客户展示可能，MVD 是在客户真实脏数据与内网环境里跑通一次确定的真实价值。",
        "B. Demo 代码量比 MVD 更多、功能更全面。",
        "C. MVD 只给基层看，Demo 只给领导看。",
        "D. 两者没有本质区别，只是换了个名词包装。"
      ],
      "ans": 0,
      "exp": "Demo 可以在理想环境伪造繁荣，但无法证明在真实生产环境中的可用性。MVD 是用最小工程投入在客户真实环境里击穿确定性。"
    },
    {
      "id": 7,
      "q": "【客户维系：单点依赖】项目中力推 AI 项目的副总裁突然离职，新上任的高管对该项目态度冷淡。作为主导 FDE，以下哪种措施最有效？",
      "opts": [
        "A. 托关系打听新高管的私人喜好，送礼拉近私人关系。",
        "B. 准备一份详实的量化业务价值回顾报告（QBR），展示系统为业务带来的真实人效提升与挽回损失，并证明一线基层业务已对系统形成刚需依赖。",
        "C. 立即停止系统更新维护，消极对待。",
        "D. 给公司高层汇报，建议直接终止合作退出该客户。"
      ],
      "ans": 1,
      "exp": "对抗‘冠军流失（Champion Churn）’最强有力的护城河是‘无法辩驳的财务与业务事实’加上‘底层员工已沉淀的不可替代刚需’。"
    },
    {
      "id": 8,
      "q": "【工程手艺：Agent 熔断】在设计生产级自主 Agent 时，为什么要严格设定 `max_turns` 和 Token 消耗预算？",
      "opts": [
        "A. 为了节约服务器电费。",
        "B. 当模型遇到死循环调用或解析错误时，防止费用无限失控激增与线程挂死雪崩。",
        "C. 大模型官方 API 规定每次任务不得超过 3 次调用。",
        "D. 纯属个人代码习惯，在生产环境中并不必要。"
      ],
      "ans": 1,
      "exp": "Agent 在遇到外部接口偶发异常时容易陷入‘尝试-失败-再尝试’的无尽循环，没有硬预算与轮数熔断会导致账单天价爆炸甚至把下游系统打崩。"
    },
    {
      "id": 9,
      "q": "【商业模式：定价心理学】为什么说 AI 时代传统的‘按人头席位计费（Per-Seat）’会产生利益冲突？",
      "opts": [
        "A. 因为客户不喜欢按年续费。",
        "B. 因为 AI 的核心价值是提高效率减少人手；按席位计费意味着客户效率越高、使用人头越少，软件商赚的钱反而越少。",
        "C. 因为大模型 API 价格每年都在降低。",
        "D. 因为按席位计费无法开具增值税专用发票。"
      ],
      "ans": 1,
      "exp": "按席位收费违背了 AI 替代/增强人力的经济学规律。按成果收费（Outcome-based Pricing，如按处理单量或挽回金额）才能实现甲乙双方利益完全绑定。"
    },
    {
      "id": 10,
      "q": "【组织进化：产品化咨询】如何判断一个 FDE 团队是在做‘高级外包’还是在践行真正的‘产品化咨询’？",
      "opts": [
        "A. 看工程师写代码时用的是 Python 还是 Java。",
        "B. 看向总部核心产品反哺通用模块的频率，以及新客户交付时现场定制代码所占比例（定制递减率）是否持续下降。",
        "C. 看客户现场支付的合同金额大小。",
        "D. 看团队出差的差旅补贴标准。"
      ],
      "ans": 1,
      "exp": "真正的 FDE 组织是‘飞轮效应’：从前线踩坑中淬炼共性，反哺 HQ 核心平台，使后续客户交付的成本递减、交付速度递增。"
    }
  ]
};
