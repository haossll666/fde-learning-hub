/**
 * Tier 3 - Cross-Feature Combinations Test Suite
 * 
 * Verifies:
 * - Module completion synchronization with total progress calculations
 * - SOW and Air-gap checklist state persistence & defense score calculations
 * - Keyboard focus guard logic verification (isTypingActive semantics)
 */

const assert = require('assert');
const { createTestEnv, TestSuite } = require('./test_helpers');

function createTier3Suite() {
    const suite = new TestSuite('Tier 3: Cross-Feature State Synchronization');

    // 3.1 Module Completion Synchronization & Progress Computation
    suite.test('3.1 Module completion synchronization with total progress calculations', () => {
        const env = createTestEnv();
        env.sandbox.initApp();

        const progressText = env.document.getElementById('progress-text');
        const progressBar = env.document.getElementById('progress-bar-fill');

        assert.ok(progressText && progressBar, 'Progress DOM elements must exist');

        // Baseline: 0 items completed
        assert.strictEqual(progressText.textContent, '0 / 24 节 (0%)');
        assert.strictEqual(progressBar.style.width, '0%');

        // Step 1: Complete intro-1
        env.sandbox.loadSection(0, 0); // intro-1
        env.sandbox.toggleItemCompleted('intro-1');

        assert.strictEqual(env.sandbox.completedItems.size, 1);
        assert.strictEqual(progressText.textContent, '1 / 24 节 (4%)');
        assert.strictEqual(progressBar.style.width, '4%');

        // Button state check
        const markBtn = env.document.getElementById('mark-done-btn');
        assert.ok(markBtn && markBtn.classList.contains('is-completed'), 'Mark button must reflect completed state');
        assert.ok(markBtn.innerHTML.includes('已学完此节'), 'Button text must show completed checkmark');

        // Step 2: Un-complete intro-1
        env.sandbox.toggleItemCompleted('intro-1');
        assert.strictEqual(env.sandbox.completedItems.size, 0);
        assert.strictEqual(progressText.textContent, '0 / 24 节 (0%)');
        assert.strictEqual(progressBar.style.width, '0%');
        assert.ok(!markBtn.classList.contains('is-completed'), 'Mark button must remove completed class');

        // Step 3: Complete 12 items (50%)
        const allItems = [];
        env.data.modules.forEach(m => m.items.forEach(it => allItems.push(it.id)));

        for (let i = 0; i < 12; i++) {
            env.sandbox.toggleItemCompleted(allItems[i]);
        }
        assert.strictEqual(env.sandbox.completedItems.size, 12);
        assert.strictEqual(progressText.textContent, '12 / 24 节 (50%)');
        assert.strictEqual(progressBar.style.width, '50%');

        // Step 4: Complete remaining 12 items (100%)
        for (let i = 12; i < 24; i++) {
            env.sandbox.toggleItemCompleted(allItems[i]);
        }
        assert.strictEqual(env.sandbox.completedItems.size, 24);
        assert.strictEqual(progressText.textContent, '24 / 24 节 (100%)');
        assert.strictEqual(progressBar.style.width, '100%');

        // Step 5: Dashboard module breakdown synchronization
        env.sandbox.loadSection(6, 0); // dashboard-view
        const dashboardMount = env.document.getElementById('dashboard-mount-point');
        assert.ok(dashboardMount, 'Dashboard mount point must exist');
        assert.ok(dashboardMount.textContent.includes('24 / 24 节'), 'Dashboard KPI must display 24/24 items');
        assert.ok(dashboardMount.textContent.includes('全站完成率 100%'), 'Dashboard KPI must display 100% completion');
    });

    // 3.2 SOW & Air-Gap Checklist State Persistence & Defense Score
    suite.test('3.2 SOW and Air-gap checklist persistence and defense score calculations', () => {
        const env = createTestEnv();
        env.sandbox.initApp();
        env.sandbox.loadSection(4, 2); // m-checklist

        const content = env.document.getElementById('section-content-mount');
        assert.ok(content, 'section-content-mount must exist');

        // Query all checkboxes with data-check-key
        const checkboxes = content.querySelectorAll('input[type="checkbox"][data-check-key]');
        assert.ok(checkboxes.length >= 8, `Expected at least 8 checklist items (4 SOW + 4 Air-Gap), got ${checkboxes.length}`);

        // Initial defense count must be 0
        assert.strictEqual(env.sandbox.getChecklistActiveCount(), 0, 'Initial active defense count must be 0');

        // Check 3 SOW items and 2 Air-Gap items
        const keysToCheck = [
            'sow_input_format',
            'sow_acceptance_criteria',
            'sow_phase2_pool',
            'airgap_telemetry',
            'airgap_weights'
        ];

        checkboxes.forEach(cb => {
            const key = cb.getAttribute('data-check-key');
            if (keysToCheck.includes(key)) {
                cb.checked = true;
            }
        });

        // Trigger persistence
        env.window.updateChecklistProgress();

        // Verify localStorage content
        const savedMap = JSON.parse(env.storage.getItem('fde_hub_checklist_map') || '{}');
        keysToCheck.forEach(k => {
            assert.strictEqual(savedMap[k], true, `Checklist key ${k} must be stored as true`);
        });

        // Verify active defense count
        const activeCount = env.sandbox.getChecklistActiveCount();
        assert.strictEqual(activeCount, 5, `Expected 5 active defense items, got ${activeCount}`);

        // Simulate page navigation away to intro-1, then back to m-checklist
        env.sandbox.loadSection(0, 0); // intro-1
        env.sandbox.loadSection(4, 2); // m-checklist

        // Verify restored DOM checked status
        const restoredCheckboxes = env.document.querySelectorAll('input[type="checkbox"][data-check-key]');
        restoredCheckboxes.forEach(cb => {
            const key = cb.getAttribute('data-check-key');
            if (keysToCheck.includes(key)) {
                assert.strictEqual(cb.checked, true, `Restored checkbox ${key} must remain checked`);
            } else {
                assert.strictEqual(cb.checked, false, `Restored checkbox ${key} must remain unchecked`);
            }
        });
    });

    // 3.3 Keyboard Focus Guard Logic (isTypingActive semantics)
    suite.test('3.3 Keyboard focus guard logic verification (isTypingActive semantics)', () => {
        const env = createTestEnv();

        // The specification defines that isTypingActive() should check whether the
        // current active element is an input, textarea, select, or editable element.
        // If not yet implemented in app.js (M3 scope), detect defect.
        const fn = env.window.isTypingActive || env.sandbox.isTypingActive;

        if (typeof fn !== 'function') {
            suite.defect('DEFECT-M3-IS_TYPING_ACTIVE', 'Keyboard Focus Guard isTypingActive is not yet implemented',
                'Feature 20 (Keyboard Navigation & Focus Guard) requires isTypingActive() to prevent shortcut hijacking during input. Function is not yet present in app.js (M3 planned).'
            );
            // Verify semantic behavior contract directly against standard DOM activeElement logic
            const isTypingActiveSpec = (doc) => {
                const el = doc.activeElement;
                if (!el) return false;
                const tag = el.tagName.toLowerCase();
                return ['input', 'textarea', 'select'].includes(tag) || el.getAttribute('contenteditable') === 'true' || Boolean(el.isContentEditable);
            };

            // Test input active
            const inputEl = env.document.createElement('input');
            env.document.activeElement = inputEl;
            assert.strictEqual(isTypingActiveSpec(env.document), true, 'Active input element must return true for isTypingActive');

            // Test textarea active
            const textareaEl = env.document.createElement('textarea');
            env.document.activeElement = textareaEl;
            assert.strictEqual(isTypingActiveSpec(env.document), true, 'Active textarea element must return true for isTypingActive');

            // Test button active
            const buttonEl = env.document.createElement('button');
            env.document.activeElement = buttonEl;
            assert.strictEqual(isTypingActiveSpec(env.document), false, 'Active button element must return false for isTypingActive');

            // Test body active
            env.document.activeElement = env.document.body;
            assert.strictEqual(isTypingActiveSpec(env.document), false, 'Active body element must return false for isTypingActive');

            assert.fail('isTypingActive is not defined on window/global in app.js. M3 implementation pending.');
        } else {
            // If implemented in app.js, execute the real function
            const inputEl = env.document.createElement('input');
            env.document.activeElement = inputEl;
            assert.strictEqual(fn(), true, 'Active input element must return true for isTypingActive');

            const buttonEl = env.document.createElement('button');
            env.document.activeElement = buttonEl;
            assert.strictEqual(fn(), false, 'Active button element must return false for isTypingActive');
        }
    });

    // 3.4 Resilient Agent Interactive Flight Simulator & Subpage Navigation
    suite.test('3.4 Resilient Agent interactive simulator state machine and subpage navigation', () => {
        const env = createTestEnv();
        env.sandbox.initApp();

        // 1. Load eng-1
        env.sandbox.loadSection(2, 0);

        const theoryPane = env.document.getElementById('eng-tab-pane-theory');
        const simPane = env.document.getElementById('eng-tab-pane-simulator');
        const interviewPane = env.document.getElementById('eng-tab-pane-interview');
        assert.ok(theoryPane && simPane && interviewPane, 'All 3 subpage panes must exist in eng-1');

        // 2. Switch Tab to Simulator
        env.window.switchEngTab('simulator');
        assert.ok(!simPane.classList.contains('hidden'), 'Simulator pane must be visible');
        assert.ok(theoryPane.classList.contains('hidden'), 'Theory pane must be hidden');

        // 3. Test Happy Path Step Progression
        env.window.setSimScenario('happy');
        const stepVal = env.document.getElementById('metric-step-val');
        const statusBadge = env.document.getElementById('sim-status-badge');
        assert.strictEqual(stepVal.textContent, '0 / 6');
        assert.strictEqual(statusBadge.textContent, 'READY');

        // Step through 4 steps
        for (let i = 0; i < 4; i++) {
            env.window.stepAgentSimulator();
        }
        assert.strictEqual(stepVal.textContent, '4 / 6');
        assert.strictEqual(statusBadge.textContent, 'SUCCESS');

        // 4. Test Scenario 2 (Loop -> Max Steps Reached)
        env.window.setSimScenario('loop');
        for (let i = 0; i < 6; i++) {
            env.window.stepAgentSimulator();
        }
        assert.strictEqual(stepVal.textContent, '6 / 6');
        assert.strictEqual(statusBadge.textContent, 'MAX_STEPS_REACHED');

        // 5. Test Scenario 3 (Token budget exceeded)
        env.window.setSimScenario('token');
        env.window.stepAgentSimulator();
        env.window.stepAgentSimulator();
        assert.strictEqual(statusBadge.textContent, 'ABORTED');

        // 6. Test Scenario 4 (Sandbox intercept)
        env.window.setSimScenario('sandbox');
        env.window.stepAgentSimulator();
        env.window.stepAgentSimulator();
        assert.strictEqual(statusBadge.textContent, 'SUCCESS');

        // 7. Test Fullscreen Subpage Modal
        const container = env.document.getElementById('agent-simulator-container');
        env.window.toggleSimFullscreen();
        assert.ok(container.classList.contains('fullscreen-mode'));
        env.window.toggleSimFullscreen();
        assert.ok(!container.classList.contains('fullscreen-mode'));

        // 8. Test Concept Check Quizzes in Tab 3
        env.window.switchEngTab('interview');
        assert.ok(!interviewPane.classList.contains('hidden'));
        env.window.handleConceptQuiz(1, 1, true);
        const fb1 = env.document.getElementById('concept-feedback-1');
        assert.ok(fb1.classList.contains('chosen-correct'));
        assert.ok(fb1.textContent.includes('判定正确'));
    });

    return suite;
}


module.exports = { createTier3Suite };
