/**
 * Tier 1 - Feature Coverage & Content Verification Test Suite
 * 
 * Verifies:
 * - data.js structure (7 modules, 24 section items, 10+ quizzes, 3 PBL scenarios)
 * - 28 jargon glossary items with Definition, Scenario, and Pitfall
 * - E1-E3 factual integrity (Delta disambiguation, AIP Bootcamp TTV, GA OpenAI Structured Outputs)
 * - G1-G5 depth elements & Section III unsourced number annotations
 * - Structured refs arrays across all 24 section items with valid URLs
 */

const assert = require('assert');
const { loadData, TestSuite } = require('./test_helpers');

function createTier1Suite() {
    const suite = new TestSuite('Tier 1: Feature Coverage & Content Integrity');
    const data = loadData();

    // 1.1 Architecture & Core Top-Level Structure
    suite.test('1.1 Top-level data.js structure integrity', () => {
        assert.ok(data, 'FDE_ALL_DATA must be defined');
        assert.ok(data.meta, 'meta section must exist');
        assert.ok(data.meta.title && typeof data.meta.title === 'string', 'meta.title must be non-empty string');
        assert.ok(data.meta.version && typeof data.meta.version === 'string', 'meta.version must be non-empty string');
        assert.ok(data.meta.description, 'meta.description must exist');
        assert.ok(Array.isArray(data.modules), 'modules must be an array');
        assert.strictEqual(data.modules.length, 7, `Expected 7 modules (Modules 0-6), got ${data.modules.length}`);
    });

    // 1.2 Module IDs & Section Item Counts (Baseline 24)
    suite.test('1.2 Exactly 7 modules with correct IDs and 24 section items', () => {
        const expectedModuleIds = [
            'mindset',
            'campaigns',
            'engineering',
            'pbl-sandboxes',
            'tools',
            'quizzes',
            'dashboard'
        ];

        const actualModuleIds = data.modules.map(m => m.id);
        assert.deepStrictEqual([...actualModuleIds], [...expectedModuleIds], 'Module IDs must match expected progression');

        let totalItems = 0;
        data.modules.forEach(m => {
            assert.ok(m.title, `Module ${m.id} must have title`);
            assert.ok(m.badge, `Module ${m.id} must have badge`);
            assert.ok(Array.isArray(m.items), `Module ${m.id} items must be an array`);
            totalItems += m.items.length;
        });

        assert.strictEqual(totalItems, 24, `Total section items baseline must be 24, got ${totalItems}`);
    });

    // 1.3 Full Quizzes Verification (10+ Items)
    suite.test('1.3 Quizzes structure and cognitive feedback properties', () => {
        assert.ok(Array.isArray(data.full_quizzes), 'full_quizzes must be an array');
        assert.ok(data.full_quizzes.length >= 10, `Expected at least 10 quizzes, got ${data.full_quizzes.length}`);

        const validCategories = new Set(['commercial', 'engineering', 'crisis', 'compliance']);
        data.full_quizzes.forEach((q, idx) => {
            assert.ok(q.id !== undefined, `Quiz #${idx} must have id`);
            assert.ok(validCategories.has(q.category), `Quiz #${idx} category '${q.category}' must be one of 4 dimensions`);
            assert.ok(q.category_name, `Quiz #${idx} must have category_name`);
            assert.ok(q.q && q.q.length > 5, `Quiz #${idx} must have substantial question text`);
            assert.ok(Array.isArray(q.opts) && q.opts.length >= 3, `Quiz #${idx} must have at least 3 options`);
            assert.ok(typeof q.ans === 'number' && q.ans >= 0 && q.ans < q.opts.length, `Quiz #${idx} ans index must be within options range`);
            assert.ok(q.exp && q.exp.length > 10, `Quiz #${idx} must have detailed expert explanation`);
        });
    });

    // 1.4 PBL Branching Scenarios Verification (3 Scenarios)
    suite.test('1.4 PBL branching scenarios completeness', () => {
        assert.ok(data.pbl_scenarios, 'pbl_scenarios must be defined');
        const expectedScenarios = ['pbl-1', 'pbl-2', 'pbl-3'];
        expectedScenarios.forEach(scId => {
            const sc = data.pbl_scenarios[scId];
            assert.ok(sc, `Scenario ${scId} must exist`);
            assert.ok(sc.title, `Scenario ${scId} must have title`);
            assert.ok(Array.isArray(sc.crossroads), `Scenario ${scId} crossroads must be an array`);
            assert.ok(sc.crossroads.length >= 3, `Scenario ${scId} must have at least 3 decision options`);

            let hasSuccess = false;
            let hasFail = false;
            sc.crossroads.forEach((cr, optIdx) => {
                assert.ok(cr.text, `Scenario ${scId} option ${optIdx} must have text`);
                assert.ok(['SUCCESS', 'FAIL'].includes(cr.status), `Scenario ${scId} option ${optIdx} status must be SUCCESS or FAIL`);
                if (cr.status === 'SUCCESS') hasSuccess = true;
                if (cr.status === 'FAIL') hasFail = true;
                assert.ok(typeof cr.trust === 'number', `Scenario ${scId} option ${optIdx} must have numeric trust delta`);
                assert.ok(typeof cr.delay === 'number', `Scenario ${scId} option ${optIdx} must have numeric delay days`);
                assert.ok(cr.outcome && cr.outcome.length > 10, `Scenario ${scId} option ${optIdx} must have outcome description`);
            });
            assert.ok(hasSuccess, `Scenario ${scId} must have at least one SUCCESS branch`);
            assert.ok(hasFail, `Scenario ${scId} must have at least one FAIL branch`);
        });
    });

    // 1.5 Jargon Glossary: 28 Items with Definition, Scenario, Pitfall
    suite.test('1.5 Jargon glossary 28 terms with 3-part structure (Definition, Scenario, Pitfall)', () => {
        const toolsMod = data.modules.find(m => m.id === 'tools');
        assert.ok(toolsMod, 'Module tools must exist');
        const jargonItem = toolsMod.items.find(it => it.id === 'm-jargon');
        assert.ok(jargonItem, 'Item m-jargon must exist in tools module');

        const content = jargonItem.content;
        assert.ok(content, 'm-jargon content must be non-empty');

        // Check for 28 glossary cards/items
        const cardRegex = /class=["'](?:glossary-card|glossary-item)["']/g;
        const matches = content.match(cardRegex) || [];

        // Check 3-part structure requirement:
        // Definition (🎯 精准定义 or glossary-section def)
        // Scenario/Context (🏢 落地场景 or glossary-section context)
        // Pitfall (⚠️ 避坑建议/防坑建议 or glossary-section pitfall)
        const hasDef = content.includes('精准定义') || content.includes('glossary-section def');
        const hasContext = content.includes('落地场景') || content.includes('glossary-section context');
        const hasPitfall = content.includes('避坑') || content.includes('防坑') || content.includes('glossary-section pitfall');

        if (matches.length < 28 || !hasDef || !hasContext || !hasPitfall) {
            suite.defect('DEFECT-M1-G1', 'Jargon glossary incomplete or missing 3-part structure',
                `Found ${matches.length} glossary items (expected 28). Has Definition: ${hasDef}, Has Scenario: ${hasContext}, Has Pitfall: ${hasPitfall}. Worker M1 G1 expansion pending.`
            );
            assert.fail(`Jargon Glossary expected 28 terms with 3-part structure (Definition, Scenario, Pitfall), found ${matches.length} terms (hasDef=${hasDef}, hasContext=${hasContext}, hasPitfall=${hasPitfall})`);
        }
    });

    // 1.6 E1: Palantir Delta role vs Awesome-FDE-Roadmap 'The Delta'
    suite.test('1.6 E1 Fact: Palantir Delta vs Awesome-FDE-Roadmap Disambiguation', () => {
        const mindsetMod = data.modules.find(m => m.id === 'mindset');
        const intro2 = mindsetMod && mindsetMod.items.find(it => it.id === 'intro-2');
        assert.ok(intro2, 'intro-2 must exist');

        // Check intro-2 text
        const content = intro2.content;
        assert.ok(
            content.includes('Awesome-FDE-Roadmap') || content.includes('开源社区'),
            'intro-2 must cite Awesome-FDE-Roadmap / open-source community for The Delta concept'
        );
        assert.ok(
            content.includes('同源') || content.includes('Delta Force') || content.includes('工程师职衔') || content.includes('代号'),
            'intro-2 must clarify Palantir internal Delta engineer title vs community gap concept'
        );
        assert.ok(
            content.includes('经验估算') || content.includes('估算值') || content.includes('经验法则'),
            'intro-2 must tag 70/30 or 80/20 ratio as empirical estimate'
        );

        // Check full_quizzes[2] explanation disambiguation
        const quiz3 = data.full_quizzes.find(q => q.id === 3);
        assert.ok(quiz3, 'Quiz #3 must exist');
        assert.ok(
            quiz3.exp.includes('Awesome-FDE-Roadmap') || quiz3.exp.includes('代号') || quiz3.exp.includes('兼指'),
            'Quiz #3 explanation must include disambiguation between Delta role and The Delta concept'
        );
    });

    // 1.7 E2: AIP Bootcamp TTV Clarification
    suite.test('1.7 E2 Fact: AIP Bootcamp TTV 1-5 days & conversion rate qualification', () => {
        const campaignsMod = data.modules.find(m => m.id === 'campaigns');
        const c1 = campaignsMod && campaignsMod.items.find(it => it.id === 'c-1');
        assert.ok(c1, 'c-1 must exist');

        const content = c1.content;
        // Verify TTV 1-5 days compression is emphasized
        assert.ok(
            content.includes('1 到 5 天') || content.includes('1~5 天') || content.includes('1-5 天') || content.includes('5 天内'),
            'c-1 must highlight AIP Bootcamp TTV compression to 1-5 days'
        );
        // Verify 10%->75% is either removed or qualified/disclaimed
        const hasUnqualified75 = /从\s*10%\s*提升至\s*75%(?!.*(未披露|传闻|估算|非官方))/.test(content);
        assert.ok(!hasUnqualified75, 'c-1 must not present 10%->75% conversion rate as official unverified fact');
    });

    // 1.8 E3: OpenAI Structured Outputs GA Syntax
    suite.test('1.8 E3 Fact: Modern GA client.chat.completions.parse syntax in eng-2', () => {
        const engMod = data.modules.find(m => m.id === 'engineering');
        const eng2 = engMod && engMod.items.find(it => it.id === 'eng-2');
        assert.ok(eng2, 'eng-2 must exist');

        const content = eng2.content;
        assert.ok(
            content.includes('client.chat.completions.parse'),
            'eng-2 must use GA path client.chat.completions.parse'
        );
        assert.ok(
            !content.includes('client.beta.chat.completions.parse'),
            'eng-2 must NOT use deprecated beta namespace client.beta.chat.completions.parse'
        );
        assert.ok(
            content.includes('BaseModel'),
            'eng-2 must demonstrate Pydantic BaseModel'
        );
    });

    // 1.9 G2-G5 Depth Elements & Section III Annotations
    suite.test('1.9 G2-G5 Depth Elements & Section III Unsourced Numbers Verification', () => {
        const mindsetMod = data.modules.find(m => m.id === 'mindset');
        const intro1 = mindsetMod.items.find(it => it.id === 'intro-1');
        const preMortem = mindsetMod.items.find(it => it.id === 'pre-mortem-sandbox');

        const engMod = data.modules.find(m => m.id === 'engineering');
        const eng3 = engMod.items.find(it => it.id === 'eng-3');
        const eng5 = engMod.items.find(it => it.id === 'eng-5');

        const toolsMod = data.modules.find(m => m.id === 'tools');
        const mCalc = toolsMod.items.find(it => it.id === 'm-calc');

        const campaignsMod = data.modules.find(m => m.id === 'campaigns');
        const c3 = campaignsMod.items.find(it => it.id === 'c-3');
        const c4 = campaignsMod.items.find(it => it.id === 'c-4');

        // G2: intro-1 MIT NANDA details
        assert.ok(intro1.content.includes('300~400') || intro1.content.includes('$30~40B') || intro1.content.includes('300-400'), 'intro-1 must include $30-40B investment');
        assert.ok(intro1.content.includes('95%') && (intro1.content.includes('P&L') || intro1.content.includes('零回报')), 'intro-1 must cite 95% zero P&L');
        assert.ok(intro1.content.includes('Learning Gap') || intro1.content.includes('学习鸿沟'), 'intro-1 must cite Learning Gap');
        assert.ok(intro1.content.includes('EchoStar') || intro1.content.includes('Hughes'), 'intro-1 must include EchoStar case study');
        assert.ok(intro1.content.includes('Markerstudy'), 'intro-1 must include Markerstudy case study');
        assert.ok(intro1.content.includes('Lumen'), 'intro-1 must include Lumen case study');

        // G3: eng-3 MCP evolution & primitives
        assert.ok(eng3.content.includes('2024') && (eng3.content.includes('11') || eng3.content.includes('Anthropic')), 'eng-3 must cite Nov 2024 Anthropic');
        assert.ok(eng3.content.includes('2025') && (eng3.content.includes('3') || eng3.content.includes('OpenAI')), 'eng-3 must cite Mar 2025 OpenAI adoption');
        assert.ok(eng3.content.includes('Sampling'), 'eng-3 must include Sampling primitive');
        assert.ok(eng3.content.includes('Roots'), 'eng-3 must include Roots primitive');
        assert.ok(eng3.content.includes('Elicitation'), 'eng-3 must include Elicitation primitive');

        // G4: pre-mortem Gary Klein
        assert.ok(preMortem.content.includes('Gary Klein') || preMortem.content.includes('HBR'), 'pre-mortem must cite Gary Klein (HBR)');

        // G5: m-calc 85% STP basis
        assert.ok(mCalc.content.includes('85%') && (mCalc.content.includes('自动化') || mCalc.content.includes('STP') || mCalc.content.includes('保守')), 'm-calc must explain 85% automation factor basis');

        // Section III annotations
        assert.ok(c3.content.includes('90%') && (c3.content.includes('影子') || c3.content.includes('MIT') || c3.content.includes('示意')), 'c-3 must annotate 90% stat or replace with shadow AI');
        assert.ok(c4.content.includes('18~24') && (c4.content.includes('经验') || c4.content.includes('法则') || c4.content.includes('示意')), 'c-4 must tag 18-24 month exec tenure as empirical estimate');
        assert.ok(eng5.content.includes('非官方') || eng5.content.includes('建议基线') || eng5.content.includes('实战参考'), 'eng-5 must tag RAGAS baselines as non-official');
    });

    // 1.10 Structured Refs Arrays Across All 24 Section Items
    suite.test('1.10 Structured refs arrays present with valid URLs across all 24 section items', () => {
        let inspectedCount = 0;
        data.modules.forEach(mod => {
            mod.items.forEach(item => {
                inspectedCount++;
                assert.ok(
                    Array.isArray(item.refs),
                    `Section item '${item.id}' in module '${mod.id}' must have a refs array`
                );
                assert.ok(
                    item.refs.length > 0,
                    `Section item '${item.id}' in module '${mod.id}' must have at least one ref`
                );

                item.refs.forEach((ref, rIdx) => {
                    assert.ok(ref.title && ref.title.trim().length > 0, `Ref #${rIdx} in '${item.id}' must have non-empty title`);
                    assert.ok(ref.url && (ref.url.startsWith('http://') || ref.url.startsWith('https://')), `Ref #${rIdx} in '${item.id}' must have valid http(s) URL, got '${ref.url}'`);
                    // Validate URL parsing
                    try {
                        new URL(ref.url);
                    } catch (e) {
                        assert.fail(`Invalid URL format in '${item.id}' ref #${rIdx}: ${ref.url}`);
                    }
                });
            });
        });
        assert.strictEqual(inspectedCount, 24, 'All 24 items must be inspected for refs');
    });

    return suite;
}

module.exports = { createTier1Suite };
