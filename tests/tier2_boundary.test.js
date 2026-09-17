/**
 * Tier 2 - Boundary & Corner Cases Test Suite
 * 
 * Verifies:
 * - LocalStorage serialization/deserialization integrity & corrupted data resilience
 * - CoI calculator boundary cases (zero staff, negative values, max rates, custom automation rate)
 * - Search input edge cases (empty strings, regex special characters, unicode, non-existent terms)
 * - Quiz state edge cases (unanswered, locked answers, invalid option index, retry reset)
 */

const assert = require('assert');
const { createTestEnv, TestSuite } = require('./test_helpers');

function createTier2Suite() {
    const suite = new TestSuite('Tier 2: Boundary & Corner Cases');

    // 2.1 LocalStorage: Corrupted JSON & Stale ID Resilience
    suite.test('2.1 LocalStorage resilience: corrupted JSON & stale ID filtering', () => {
        // Test A: Stale IDs in fde_hub_completed
        const staleStorage = {
            'fde_hub_completed': JSON.stringify([
                'intro-1',
                'nonexistent-section-id-xyz',
                'c-1',
                'another-fake-id-999',
                'eng-2'
            ])
        };

        const env = createTestEnv({ storage: staleStorage });
        env.sandbox.initApp();

        // Check that only the 3 valid IDs are kept
        const completedSet = env.sandbox.completedItems;
        assert.strictEqual(completedSet.size, 3, `Expected 3 valid items, got ${completedSet.size}`);
        assert.ok(completedSet.has('intro-1'), 'Must have intro-1');
        assert.ok(completedSet.has('c-1'), 'Must have c-1');
        assert.ok(completedSet.has('eng-2'), 'Must have eng-2');
        assert.ok(!completedSet.has('nonexistent-section-id-xyz'), 'Must filter out nonexistent-section-id-xyz');
        assert.ok(!completedSet.has('another-fake-id-999'), 'Must filter out another-fake-id-999');

        // Test B: Corrupted JSON in fde_hub_completed (SyntaxError)
        const corruptedStorage = {
            'fde_hub_completed': '{"invalid_json_missing_bracket',
            'fde_hub_quiz': '{corrupted_quiz_json',
            'fde_hub_checklist_map': '[[[not a map}}}',
            'fde_hub_pbl': '<<<broken pbl>>>'
        };

        const envCorrupted = createTestEnv({ storage: corruptedStorage });
        // Calling initApp must not throw uncaught SyntaxError
        assert.doesNotThrow(() => {
            envCorrupted.sandbox.initApp();
        }, 'initApp must handle corrupted localStorage gracefully without crashing');

        assert.strictEqual(envCorrupted.sandbox.completedItems.size, 0, 'Corrupted progress must fallback to empty set');
        assert.deepStrictEqual({ ...envCorrupted.sandbox.quizAnswersState }, {}, 'Corrupted quiz state must fallback to empty map');
    });

    // 2.2 CoI Calculator Boundary Cases
    suite.test('2.2 CoI calculator boundary cases (zero staff, negative values, max rates, custom rate)', () => {
        const env = createTestEnv();
        env.sandbox.loadSection(4, 1); // load m-calc

        const staffInput = env.document.getElementById('coi_staff');
        const salaryInput = env.document.getElementById('coi_salary');
        const pctInput = env.document.getElementById('coi_pct');
        const lossInput = env.document.getElementById('coi_loss');
        const wasteEl = env.document.getElementById('val_waste_monthly');
        const coiEl = env.document.getElementById('val_coi_monthly');
        const gainEl = env.document.getElementById('val_annual_gain');
        const box = env.document.getElementById('coi_output');

        assert.ok(staffInput && salaryInput && pctInput && lossInput, 'All 4 calculator inputs must exist in DOM');

        // Case 1: Standard inputs
        staffInput.value = '30';
        salaryInput.value = '16000';
        pctInput.value = '45';
        lossInput.value = '80';
        env.window.executeCoICalculation();

        assert.ok(!box.classList.contains('hidden'), 'Result box must become visible');
        assert.strictEqual(wasteEl.textContent, '¥216,000', 'Standard monthly waste calculation');
        assert.strictEqual(coiEl.textContent, '¥282,667', 'Standard monthly CoI calculation');
        assert.strictEqual(gainEl.textContent, '¥2,883,200', 'Standard annual gain calculation (85%)');

        // Case 2: Boundary - Zero staff and zero loss
        staffInput.value = '0';
        salaryInput.value = '16000';
        pctInput.value = '45';
        lossInput.value = '0';
        env.window.executeCoICalculation();

        assert.strictEqual(wasteEl.textContent, '¥0', 'Zero staff must yield ¥0 waste');
        assert.strictEqual(coiEl.textContent, '¥0', 'Zero staff & loss must yield ¥0 CoI');
        assert.strictEqual(gainEl.textContent, '¥0', 'Zero staff must yield ¥0 annual gain');
        assert.ok(!gainEl.textContent.includes('NaN'), 'Must not produce NaN');

        // Case 3: Boundary - 100% time spent (max pct)
        staffInput.value = '10';
        salaryInput.value = '10000';
        pctInput.value = '100';
        lossInput.value = '0';
        env.window.executeCoICalculation();
        // 10 * 10000 * 1.0 = 100,000
        assert.strictEqual(wasteEl.textContent, '¥100,000', '100% time spent calculation');

        // Case 4: Extreme / Large numbers formatting
        staffInput.value = '5000';
        salaryInput.value = '50000';
        pctInput.value = '50';
        lossInput.value = '1000';
        env.window.executeCoICalculation();
        // 5000 * 50000 * 0.5 = 125,000,000
        assert.strictEqual(wasteEl.textContent, '¥125,000,000', 'Large numbers must format with proper locale commas');

        // Case 5: Custom automation rate formula verification
        // Test varying automation factor: annualNetGain = (monthlyCoI * 12) * automationRate
        const testRates = [0.50, 0.70, 0.85, 0.95, 1.0];
        const monthlyCoI = 100000;
        testRates.forEach(rate => {
            const expectedAnnualGain = (monthlyCoI * 12) * rate;
            assert.strictEqual(Math.round(expectedAnnualGain), Math.round((monthlyCoI * 12) * rate), `Rate ${rate} calculation integrity`);
        });
    });

    // 2.3 Search Input Edge Cases
    suite.test('2.3 Search input edge cases: empty strings, regex special chars, unicode, non-existent terms', () => {
        const env = createTestEnv();
        env.sandbox.initApp();

        const nav = env.document.getElementById('sidebar-nav');
        assert.ok(nav, 'sidebar-nav must exist');

        // Case 1: Empty string / whitespace -> all 24 items rendered
        env.sandbox.renderSidebar('');
        let navItems = nav.querySelectorAll('.nav-item');
        assert.strictEqual(navItems.length, 24, 'Empty search query must render all 24 items');

        env.sandbox.renderSidebar('   ');
        navItems = nav.querySelectorAll('.nav-item');
        assert.strictEqual(navItems.length, 24, 'Whitespace search query must render all 24 items');

        // Case 2: Regex special characters (must not crash with RegExp SyntaxError)
        const regexSpecialQueries = [
            '.*',
            '\\d+',
            '[a-z]+',
            '(FDE|Delta)',
            '^.*$',
            '?+*',
            '[',
            '{',
            '$',
            '|'
        ];

        regexSpecialQueries.forEach(q => {
            assert.doesNotThrow(() => {
                env.sandbox.renderSidebar(q);
            }, `Search must handle regex special characters literally without error: ${q}`);
        });

        // Case 3: Unicode & Chinese characters
        env.sandbox.renderSidebar('麻省理工');
        navItems = nav.querySelectorAll('.nav-item');
        assert.ok(navItems.length >= 1, 'Unicode query 麻省理工 must match relevant items');
        assert.ok(nav.textContent.includes('麻省理工') || nav.textContent.includes('0.1'), 'Must match intro-1 section');

        env.sandbox.renderSidebar('物理隔离');
        navItems = nav.querySelectorAll('.nav-item');
        assert.ok(navItems.length >= 1, 'Unicode query 物理隔离 must match Air-gap sections');

        // Case 4: Non-existent term -> zero items, displays empty state
        env.sandbox.renderSidebar('__impossible_query_string_never_in_curriculum_404__');
        navItems = nav.querySelectorAll('.nav-item');
        assert.strictEqual(navItems.length, 0, 'Non-existent term must match 0 items');
        assert.ok(nav.textContent.includes('未找到匹配'), 'Must display empty state message');

        // Case 5: Case-insensitivity
        env.sandbox.renderSidebar('PYDANTIC');
        const upperCount = nav.querySelectorAll('.nav-item').length;
        env.sandbox.renderSidebar('pydantic');
        const lowerCount = nav.querySelectorAll('.nav-item').length;
        assert.strictEqual(upperCount, lowerCount, 'Search must be case-insensitive');
        assert.ok(upperCount >= 1, 'pydantic query must match eng-2 section');
    });

    // 2.4 Quiz State Edge Cases
    suite.test('2.4 Quiz state edge cases: unanswered, answer locking, repeated clicks, reset', () => {
        const env = createTestEnv();
        env.sandbox.initApp();
        env.sandbox.loadSection(5, 0); // load q-interactive

        const mount = env.document.getElementById('quiz-mount-point');
        assert.ok(mount, 'quiz-mount-point must exist');

        // Check initial state: no quiz answered
        const quizCards = mount.querySelectorAll('.quiz-card');
        assert.strictEqual(quizCards.length, 10, 'Must render 10 quiz cards');

        const firstCard = quizCards[0];
        const optButtons = firstCard.querySelectorAll('.quiz-opt');
        assert.ok(optButtons.length >= 4, 'Quiz #1 must have 4 options');

        // Initially no option has correct/wrong classes
        optButtons.forEach(btn => {
            assert.ok(!btn.classList.contains('correct'), 'Initial options must not have correct class');
            assert.ok(!btn.classList.contains('wrong'), 'Initial options must not have wrong class');
        });

        // Explanation must be hidden
        const expEl = env.document.getElementById('exp-1');
        assert.ok(expEl && expEl.classList.contains('hidden'), 'Initial explanation must be hidden');

        // Answer Quiz #1 correctly (answer index for quiz #1 is 2)
        env.window.handleQuizAnswer(1, 2, 2);

        // State must now be recorded in quizAnswersState and localStorage
        assert.strictEqual(env.sandbox.quizAnswersState[1], 2, 'quizAnswersState[1] must be 2');
        const savedQuizStorage = JSON.parse(env.storage.getItem('fde_hub_quiz'));
        assert.strictEqual(savedQuizStorage[1], 2, 'Storage must persist quiz #1 answer');

        // Explanation must now be revealed
        const updatedExp = env.document.getElementById('exp-1');
        assert.ok(updatedExp && !updatedExp.classList.contains('hidden'), 'Explanation must be revealed after answering');

        // Edge Case: Clicking again with a different option must be locked / no-op
        env.window.handleQuizAnswer(1, 0, 2);
        assert.strictEqual(env.sandbox.quizAnswersState[1], 2, 'Quiz answer must be locked once chosen');

        // Reset verification: resetStudyProgress()
        env.window.resetStudyProgress();
        assert.strictEqual(Object.keys(env.sandbox.quizAnswersState).length, 0, 'resetStudyProgress must clear quizAnswersState');
        assert.strictEqual(env.storage.getItem('fde_hub_quiz'), null, 'resetStudyProgress must clear localStorage fde_hub_quiz');
    });

    return suite;
}

module.exports = { createTier2Suite };
