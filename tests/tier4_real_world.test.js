/**
 * Tier 4 - Real-World End-to-End Scenarios Test Suite
 * 
 * Verifies:
 * - Complete learner walkthrough simulation from Module 0 to Module 6
 * - Executive memo generation, CoI briefing formatting, and certificate export
 * - Static syntax validation for both app.js and data.js (node --check)
 */

const assert = require('assert');
const { execSync } = require('child_process');
const path = require('path');
const { createTestEnv, TestSuite, PROJECT_ROOT } = require('./test_helpers');

function createTier4Suite() {
    const suite = new TestSuite('Tier 4: Real-World Scenarios & E2E Walkthrough');

    // 4.1 Complete Learner Walkthrough Simulation (Modules 0-6)
    suite.test('4.1 Complete learner walkthrough simulation from Module 0 to Module 6', () => {
        const env = createTestEnv();
        env.sandbox.initApp();

        // 1. Iterate through all 7 modules and 24 sections
        let visitedCount = 0;
        env.data.modules.forEach((mod, mIdx) => {
            mod.items.forEach((item, iIdx) => {
                visitedCount++;
                env.sandbox.loadSection(mIdx, iIdx);

                // Verify section header rendered
                const headerBlock = env.document.getElementById('section-header-mount');
                assert.ok(headerBlock && headerBlock.textContent.includes(item.title), `Section header must render title for ${item.id}`);

                // Mark section completed
                env.sandbox.toggleItemCompleted(item.id);
            });
        });
        assert.strictEqual(visitedCount, 24, 'Walkthrough must visit all 24 section items');
        assert.strictEqual(env.sandbox.completedItems.size, 24, 'All 24 items must be marked completed');

        // 2. Complete all 3 PBL branching challenges with optimal choices
        // pbl-1: choice 1 (win)
        // pbl-2: choice 1 (win)
        // pbl-3: choice 2 (win)
        env.window.executePblChoice('pbl-1', 1);
        env.window.executePblChoice('pbl-2', 1);
        env.window.executePblChoice('pbl-3', 2);

        const pblChoices = env.sandbox.getPblChoices();
        assert.strictEqual(pblChoices['pbl-1'], 1, 'PBL-1 choice 1 stored');
        assert.strictEqual(pblChoices['pbl-2'], 1, 'PBL-2 choice 1 stored');
        assert.strictEqual(pblChoices['pbl-3'], 2, 'PBL-3 choice 2 stored');

        // 3. Complete all 10 quizzes in q-interactive with 100% correct answers
        env.sandbox.loadSection(5, 0); // q-interactive
        env.data.full_quizzes.forEach(q => {
            env.window.handleQuizAnswer(q.id, q.ans, q.ans);
        });

        const quizState = env.sandbox.quizAnswersState;
        assert.strictEqual(Object.keys(quizState).length, 10, 'All 10 quizzes answered');
        env.data.full_quizzes.forEach(q => {
            assert.strictEqual(quizState[q.id], q.ans, `Quiz #${q.id} answer must match q.ans`);
        });

        // 4. Load dashboard-view (Module 6, Item 0) and verify final mastery
        env.sandbox.loadSection(6, 0);
        const mount = env.document.getElementById('dashboard-mount-point');
        assert.ok(mount, 'Dashboard mount point must exist');

        const dashboardText = mount.textContent;
        // Verify completion rate
        assert.ok(dashboardText.includes('24 / 24 节'), 'Dashboard must display 24/24 completed items');
        assert.ok(dashboardText.includes('100%'), 'Dashboard must display 100%');

        // Verify quiz stats: 10 / 10 (100%)
        assert.ok(dashboardText.includes('10 / 10 题'), 'Dashboard must display 10/10 quiz score');
        assert.ok(dashboardText.includes('准确率 100%'), 'Dashboard must display 100% quiz accuracy');

        // Verify PBL stats: 3 / 3 pass
        assert.ok(dashboardText.includes('3 / 3 场'), 'Dashboard must display 3/3 PBL pass count');

        // Verify Rank Title: 👑 传奇 Delta 架构师
        assert.ok(
            dashboardText.includes('传奇 Delta 架构师') || dashboardText.includes('Legendary FDE Architect'),
            'Final rank must be 👑 传奇 Delta 架构师 (Legendary FDE Architect)'
        );

        // Verify 4D Radar dimensions: all must show 100分
        assert.ok(dashboardText.includes('商业对齐力') && dashboardText.includes('100分'), 'Commercial dimension must score 100');
        assert.ok(dashboardText.includes('工程防御力') && dashboardText.includes('100分'), 'Engineering dimension must score 100');
        assert.ok(dashboardText.includes('现场应变力') && dashboardText.includes('100分'), 'Crisis dimension must score 100');
        assert.ok(dashboardText.includes('隔离合规力') && dashboardText.includes('100分'), 'Compliance dimension must score 100');
    });

    // 4.2 Executive Memo Generation & Export Formatting
    suite.test('4.2 Executive memo generation, CoI briefing formatting, and certificate export', () => {
        const env = createTestEnv();
        env.sandbox.initApp();

        // 1. CoI Calculation Executive Memo
        env.sandbox.loadSection(4, 1); // m-calc
        const staff = env.document.getElementById('coi_staff');
        const salary = env.document.getElementById('coi_salary');
        const pct = env.document.getElementById('coi_pct');
        const loss = env.document.getElementById('coi_loss');

        staff.value = '50';
        salary.value = '20000';
        pct.value = '40';
        loss.value = '120';
        env.window.executeCoICalculation();

        const wasteEl = env.document.getElementById('val_waste_monthly');
        const coiEl = env.document.getElementById('val_coi_monthly');
        const gainEl = env.document.getElementById('val_annual_gain');
        const box = env.document.getElementById('coi_output');

        // monthlyWaste: 50 * 20000 * 0.40 = 400,000
        // monthlyLoss: (120 * 10000) / 12 = 100,000
        // monthlyCoI: 500,000
        // annualGain: 500,000 * 12 * 0.85 = 5,100,000
        assert.strictEqual(wasteEl.textContent, '¥400,000', 'Monthly waste correctly formatted');
        assert.strictEqual(coiEl.textContent, '¥500,000', 'Monthly CoI correctly formatted');
        assert.strictEqual(gainEl.textContent, '¥5,100,000', 'Annual net gain correctly formatted');
        assert.ok(box.textContent.includes('建议谈判话术'), 'Briefing must contain executive talk-track');
        assert.ok(box.textContent.includes('85%'), 'Briefing must disclose 85% conservative STP baseline');

        // 2. Study Records Export Verification
        let createdBlob = null;
        let createdUrl = null;
        let clickedLink = null;

        env.window.Blob = class InterceptedBlob {
            constructor(parts, opts) {
                this.parts = parts;
                this.opts = opts;
                createdBlob = this;
            }
        };
        env.window.URL.createObjectURL = (blob) => {
            createdUrl = 'blob:test-mock-url';
            return createdUrl;
        };

        const originalCreateElement = env.document.createElement.bind(env.document);
        env.document.createElement = (tagName) => {
            const el = originalCreateElement(tagName);
            if (tagName.toLowerCase() === 'a') {
                el.click = () => { clickedLink = el; };
            }
            return el;
        };

        // Populate state before export
        env.sandbox.completedItems = new Set(['intro-1', 'intro-2', 'c-1']);
        env.sandbox.quizAnswersState = { 1: 2, 2: 1 };
        env.storage.setItem('fde_hub_pbl', JSON.stringify({ 'pbl-1': 1 }));
        env.storage.setItem('fde_hub_checklist_map', JSON.stringify({ 'sow_input_format': true }));

        env.window.exportStudyRecords();

        assert.ok(createdBlob, 'Export must create a Blob');
        assert.strictEqual(createdBlob.opts.type, 'application/json', 'Blob must be application/json');

        const exportedPayload = JSON.parse(createdBlob.parts[0]);
        assert.ok(exportedPayload.timestamp, 'Export must have timestamp');
        assert.ok(new Date(exportedPayload.timestamp).getTime() > 0, 'Timestamp must be valid ISO date');
        assert.deepStrictEqual(exportedPayload.completedItems, ['intro-1', 'intro-2', 'c-1'], 'Exported completedItems must match');
        assert.deepStrictEqual(exportedPayload.quizAnswers, { 1: 2, 2: 1 }, 'Exported quizAnswers must match');
        assert.deepStrictEqual(exportedPayload.pblChoices, { 'pbl-1': 1 }, 'Exported pblChoices must match');
        assert.strictEqual(exportedPayload.checklists.sow_input_format, true, 'Exported checklists must match');

        assert.ok(clickedLink, 'Export must trigger programmatic click on anchor');
        assert.ok(clickedLink.download.startsWith('fde-competency-cert-'), 'Downloaded file must follow naming convention');
    });

    // 4.3 Node Syntax Verification (node --check)
    suite.test('4.3 Syntax verification (node --check app.js and data.js)', () => {
        const appPath = path.join(PROJECT_ROOT, 'app.js');
        const dataPath = path.join(PROJECT_ROOT, 'data.js');

        // Check app.js syntax
        let appCheckError = null;
        try {
            execSync(`node --check "${appPath}"`, { stdio: 'pipe' });
        } catch (e) {
            appCheckError = e;
        }
        assert.strictEqual(appCheckError, null, `node --check app.js failed: ${appCheckError && appCheckError.stderr && appCheckError.stderr.toString()}`);

        // Check data.js syntax
        let dataCheckError = null;
        try {
            execSync(`node --check "${dataPath}"`, { stdio: 'pipe' });
        } catch (e) {
            dataCheckError = e;
        }
        assert.strictEqual(dataCheckError, null, `node --check data.js failed: ${dataCheckError && dataCheckError.stderr && dataCheckError.stderr.toString()}`);
    });

    return suite;
}

module.exports = { createTier4Suite };
