#!/usr/bin/env node

/**
 * FDE Learning Hub - Automated E2E Test Suite Runner
 * 
 * Executes 4 tiers of opaque-box automated tests:
 * - Tier 1: Feature Coverage & Content Verification
 * - Tier 2: Boundary & Corner Cases
 * - Tier 3: Cross-Feature Combinations & State Synchronization
 * - Tier 4: Real-World Scenarios & E2E Walkthrough
 * 
 * Usage:
 *   node tests/run_tests.js             # Run all tiers
 *   node tests/run_tests.js --tier 1    # Run only Tier 1
 *   node tests/run_tests.js --tier 2    # Run only Tier 2
 *   node tests/run_tests.js --tier 3    # Run only Tier 3
 *   node tests/run_tests.js --tier 4    # Run only Tier 4
 */

const { createTier1Suite } = require('./tier1_coverage.test');
const { createTier2Suite } = require('./tier2_boundary.test');
const { createTier3Suite } = require('./tier3_cross_feature.test');
const { createTier4Suite } = require('./tier4_real_world.test');

// ANSI Colors for readable console output
const colors = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m'
};

async function main() {
    const args = process.argv.slice(2);
    let selectedTier = null;

    const tierArgIdx = args.findIndex(a => a === '--tier' || a === '-t');
    if (tierArgIdx !== -1 && args[tierArgIdx + 1]) {
        selectedTier = parseInt(args[tierArgIdx + 1], 10);
    } else if (args[0] && /^[1-4]$/.test(args[0])) {
        selectedTier = parseInt(args[0], 10);
    }

    console.log(`\n${colors.bold}${colors.cyan}══════════════════════════════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}   ⚡ FDE Flight Simulator & Learning Hub — 4-Tier E2E Test Harness${colors.reset}`);
    console.log(`${colors.dim}   Platform: Node.js ${process.version} | Timestamp: ${new Date().toISOString()}${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}══════════════════════════════════════════════════════════════════════════════${colors.reset}\n`);

    const allSuites = [
        { tier: 1, creator: createTier1Suite },
        { tier: 2, creator: createTier2Suite },
        { tier: 3, creator: createTier3Suite },
        { tier: 4, creator: createTier4Suite }
    ];

    const suitesToRun = selectedTier 
        ? allSuites.filter(s => s.tier === selectedTier)
        : allSuites;

    if (suitesToRun.length === 0) {
        console.error(`${colors.red}Error: Invalid tier selected (${selectedTier}). Valid tiers are 1, 2, 3, 4.${colors.reset}\n`);
        process.exit(2);
    }

    const suiteResults = [];
    let totalPass = 0;
    let totalFail = 0;
    const globalDefects = [];
    const overallStartTime = Date.now();

    for (const item of suitesToRun) {
        const suite = item.creator();
        console.log(`${colors.bold}${colors.blue}▶ Running ${suite.name}...${colors.reset}`);

        const res = await suite.run();
        suiteResults.push(res);
        totalPass += res.passed;
        totalFail += res.failed;

        if (res.defects && res.defects.length > 0) {
            globalDefects.push(...res.defects);
        }

        res.failures.forEach(testCase => {
            if (testCase.passed) {
                console.log(`   ${colors.green}✓ PASS${colors.reset} ${colors.dim}(${testCase.durationMs}ms)${colors.reset} ${testCase.desc}`);
            } else {
                console.log(`   ${colors.red}✕ FAIL${colors.reset} ${colors.dim}(${testCase.durationMs}ms)${colors.reset} ${colors.bold}${testCase.desc}${colors.reset}`);
                console.log(`      ${colors.red}↳ Error: ${testCase.error}${colors.reset}`);
            }
        });

        console.log('');
    }

    const totalDuration = Date.now() - overallStartTime;
    const totalExecuted = totalPass + totalFail;
    const passPercentage = totalExecuted === 0 ? 0 : Math.round((totalPass / totalExecuted) * 100);

    // Summary Section
    console.log(`${colors.bold}──────────────────────────────────────────────────────────────────────────────${colors.reset}`);
    console.log(`${colors.bold} TEST EXECUTION SUMMARY${colors.reset}`);
    console.log(`──────────────────────────────────────────────────────────────────────────────`);
    console.log(` Suites Evaluated  : ${suitesToRun.length}`);
    console.log(` Total Test Cases  : ${totalExecuted}`);
    console.log(` Passed            : ${colors.green}${colors.bold}${totalPass}${colors.reset}`);
    console.log(` Failed            : ${totalFail > 0 ? colors.red : colors.green}${colors.bold}${totalFail}${colors.reset}`);
    console.log(` Pass Rate         : ${passPercentage >= 90 ? colors.green : totalFail > 0 ? colors.yellow : colors.green}${colors.bold}${passPercentage}%${colors.reset}`);
    console.log(` Total Duration    : ${totalDuration}ms`);
    console.log(`──────────────────────────────────────────────────────────────────────────────\n`);

    // Discovered Implementation Defects & Escalations
    if (globalDefects.length > 0) {
        console.log(`${colors.bold}${colors.yellow}⚠️  DISCOVERED IMPLEMENTATION DEFECTS & GAPS (TO ESCALATE):${colors.reset}`);
        globalDefects.forEach((d, idx) => {
            console.log(`   [${idx + 1}] ${colors.bold}${d.id}${colors.reset} — ${d.summary}`);
            console.log(`       ${colors.dim}${d.detail}${colors.reset}`);
        });
        console.log(`──────────────────────────────────────────────────────────────────────────────\n`);
    }

    if (totalFail > 0) {
        console.log(`${colors.red}${colors.bold}RESULT: FAIL — ${totalFail} test(s) failed across evaluated tiers.${colors.reset}\n`);
        process.exit(1);
    } else {
        console.log(`${colors.green}${colors.bold}RESULT: ALL PASS — All ${totalPass} test cases passed with 100% integrity.${colors.reset}\n`);
        process.exit(0);
    }
}

main().catch(err => {
    console.error(`\n${colors.red}Fatal test runner execution error:${colors.reset}`, err);
    process.exit(2);
});
