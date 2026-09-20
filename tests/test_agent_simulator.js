const assert = require('assert');
const { createTestEnv } = require('./test_helpers');

function runSimulatorTest() {
    console.log('--- Testing Resilient Agent Interactive Simulator ---');
    const env = createTestEnv();
    env.sandbox.initApp();

    // 1. Load eng-1 (Module 2, Item 0)
    env.sandbox.loadSection(2, 0);

    const theoryPane = env.document.getElementById('eng-tab-pane-theory');
    const simPane = env.document.getElementById('eng-tab-pane-simulator');
    const interviewPane = env.document.getElementById('eng-tab-pane-interview');
    assert.ok(theoryPane, 'Theory pane must exist');
    assert.ok(simPane, 'Simulator pane must exist');
    assert.ok(interviewPane, 'Interview pane must exist');

    // 2. Switch Tab to Simulator
    env.window.switchEngTab('simulator');
    assert.ok(!simPane.classList.contains('hidden'), 'Simulator pane must be visible');
    assert.ok(theoryPane.classList.contains('hidden'), 'Theory pane must be hidden');

    // 3. Test Happy Path Step Progression
    env.window.setSimScenario('happy');
    const stepVal = env.document.getElementById('metric-step-val');
    const statusBadge = env.document.getElementById('sim-status-badge');
    assert.strictEqual(stepVal.textContent, '0 / 6', 'Initial step must be 0 / 6');
    assert.strictEqual(statusBadge.textContent, 'READY', 'Initial status must be READY');

    // Step 1: Missing parameter fault & retry_hint
    env.window.stepAgentSimulator();
    assert.strictEqual(stepVal.textContent, '1 / 6');
    assert.strictEqual(statusBadge.textContent, 'RUNNING');

    // Step 2: Self-correction
    env.window.stepAgentSimulator();
    assert.strictEqual(stepVal.textContent, '2 / 6');

    // Step 3: Remind warehouse
    env.window.stepAgentSimulator();
    assert.strictEqual(stepVal.textContent, '3 / 6');

    // Step 4: Success convergence
    env.window.stepAgentSimulator();
    assert.strictEqual(stepVal.textContent, '4 / 6');
    assert.strictEqual(statusBadge.textContent, 'SUCCESS', 'Status must be SUCCESS at conclusion');

    const historyMount = env.document.getElementById('sim-history-list');
    assert.ok(historyMount.children.length >= 4, 'History inspector must render all conversation turns');

    // 4. Test Scenario 2 (Loop -> Max Steps Reached)
    env.window.setSimScenario('loop');
    assert.strictEqual(stepVal.textContent, '0 / 6');
    for (let i = 0; i < 6; i++) {
        env.window.stepAgentSimulator();
    }
    assert.strictEqual(stepVal.textContent, '6 / 6');
    assert.strictEqual(statusBadge.textContent, 'MAX_STEPS_REACHED', 'Loop must trip max_steps circuit breaker');

    // 5. Test Scenario 3 (Token budget exceeded)
    env.window.setSimScenario('token');
    env.window.stepAgentSimulator();
    env.window.stepAgentSimulator();
    assert.strictEqual(statusBadge.textContent, 'ABORTED', 'Token overload must trip budget circuit breaker');

    // 6. Test Scenario 4 (Sandbox whitelist)
    env.window.setSimScenario('sandbox');
    env.window.stepAgentSimulator();
    env.window.stepAgentSimulator();
    assert.strictEqual(statusBadge.textContent, 'SUCCESS');

    // 7. Test Fullscreen Toggle
    const container = env.document.getElementById('agent-simulator-container');
    assert.ok(!container.classList.contains('fullscreen-mode'));
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

    console.log('✓ All Simulator Tests Passed Successfully!');
}

runSimulatorTest();
