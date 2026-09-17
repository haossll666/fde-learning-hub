# Test Infrastructure & Automated Harness Architecture
**Project**: FDE Flight Simulator & Competency Engine (`fde-learning-hub`)  
**Architect**: E2E Test Suite Architect (test_writer_e2e)  
**Date**: 2026-09-16  
**Status**: ACTIVE & OPERATIONAL  

---

## 1. Test Architecture Overview

The FDE Learning Hub automated test infrastructure is an **opaque-box, multi-tier automated test harness** built exclusively with Node.js standard libraries (`assert`, `vm`, `fs`, `path`, `child_process`). It operates without external npm dependencies to guarantee lightning-fast execution, zero supply-chain risk, and high reliability across all development and deployment environments.

### 1.1 Directory & File Layout
```
tests/
├── test_helpers.js             # Mock DOM, MockStorage, and isolated VM execution environment
├── tier1_coverage.test.js      # Tier 1: Feature Coverage & Content Verification (10 test suites)
├── tier2_boundary.test.js      # Tier 2: Boundary & Corner Cases (4 test suites)
├── tier3_cross_feature.test.js # Tier 3: Cross-Feature Combinations & State Sync (3 test suites)
├── tier4_real_world.test.js    # Tier 4: Real-World Scenarios & E2E Walkthrough (3 test suites)
└── run_tests.js                # Unified Test Runner & CLI Entrypoint
```

---

## 2. Methodology & 4-Tier Test Matrix

| Tier | Name | Target Scope | Key Verification Points | Test Suite File |
|---|---|---|---|---|
| **Tier 1** | Feature Coverage | `data.js` | • Top-level structure (`meta`, 7 modules, 24 section items baseline)<br>• Full Quizzes (10 items, 4 competency dimensions)<br>• 3 PBL Branching Scenarios (`pbl-1`, `pbl-2`, `pbl-3`)<br>• Jargon Glossary 28 items with 3-part format (🎯 定义, 🏢 场景, ⚠️ 避坑)<br>• E1: Palantir Delta role vs Awesome-FDE-Roadmap The Delta (70/30 empirical ratio)<br>• E2: AIP Bootcamp TTV 1-5 days vs unreleased conversion rate<br>• E3: Modern GA `client.chat.completions.parse` with Pydantic BaseModel<br>• G1-G5 depth elements (MIT NANDA, MCP milestones/primitives, Klein Pre-mortem, 85% CoI)<br>• Section III unsourced number annotations (c-3, c-4, eng-5)<br>• Structured `refs` array across all 24 section items with valid URLs | `tier1_coverage.test.js` |
| **Tier 2** | Boundary & Corner Cases | `app.js` & `data.js` | • LocalStorage serialization/deserialization integrity<br>• Corrupted JSON resilience (try/catch safety, no unhandled exceptions)<br>• Stale/deleted section ID pruning on progress load<br>• CoI Calculator boundary values: 0 staff, 0 loss, 100% time waste, extreme values, custom automation rate formula<br>• Search input edge cases: empty strings, whitespace, RegExp meta-characters (`.*+?^${}()|[]\`), Unicode/Chinese characters, non-existent terms (0-result fallback message)<br>• Quiz state edge cases: initial unselected state, answer immutability on repeated clicks, reset handling | `tier2_boundary.test.js` |
| **Tier 3** | Cross-Feature Combinations | `app.js` | • Module completion synchronization with total progress calculations (0% -> 50% -> 100%)<br>• Stale IDs in storage strictly prevented from inflating total percentage<br>• SOW & Air-Gap checklist state persistence in `fde_hub_checklist_map`<br>• Active defense score calculations (`getChecklistActiveCount()`)<br>• Cross-section state preservation upon navigation<br>• Keyboard focus guard logic verification (`isTypingActive` semantics preventing shortcut hijacking during typing in input/textarea/contenteditable) | `tier3_cross_feature.test.js` |
| **Tier 4** | Real-World End-to-End Scenarios | System E2E | • Complete learner walkthrough from Module 0 to Module 6 visiting all 24 chapters<br>• Sequential chapter marking, 10/10 quiz solving, 3/3 PBL optimal decisions<br>• Dashboard Mastery evaluation: 100% completion, 100% accuracy, 4D Radar (commercial, engineering, crisis, compliance all reach 100 points), Rank reaches `👑 传奇 Delta 架构师 (Legendary FDE Architect)`<br>• Executive memo generation and CoI formatting verification (`¥` format with locale commas, talk track text, 85% disclosure note)<br>• Personal study records certificate export (JSON schema and metadata validation)<br>• Syntax verification (`node --check app.js` and `node --check data.js`) | `tier4_real_world.test.js` |

---

## 3. Test Environment & Harness Architecture (`test_helpers.js`)

To enable true opaque-box testing of client-side browser code inside Node.js without requiring heavy third-party dependencies (like `jsdom` or `puppeteer`), `test_helpers.js` implements a lightweight, spec-compliant browser simulation harness:

1. **`MockStorage`**: In-memory Web Storage API supporting `getItem()`, `setItem()`, `removeItem()`, `clear()`, `key()`, and `length`.
2. **`MockElement` & `MockDocument`**: Hierarchical DOM tree supporting:
   - `id`, `className`, `classList` (`add`, `remove`, `toggle`, `contains`).
   - `attributes`, `setAttribute()`, `getAttribute()`, `hasAttribute()`, `removeAttribute()`.
   - `innerHTML`, `textContent`, `innerText`, `value`, `checked`.
   - Element navigation & querying: `getElementById()`, `querySelector()`, `querySelectorAll()`, `closest()`.
   - Event handling: `addEventListener()`, `removeEventListener()`, `dispatchEvent()`.
   - Tag parsing via streaming regex tokenizer into DOM nodes.
3. **`createTestEnv()`**:
   - Compiles and runs `data.js` and `app.js` in an isolated Node.js `vm.createContext()` sandbox.
   - Mirrors the exact DOM skeleton of `index.html`.
   - Provides mock `window.location`, `window.history.pushState`, `window.Blob`, `window.URL`, and `window.confirm`.

---

## 4. How to Execute Tests

### 4.1 Run All Tiers (Default)
```bash
node tests/run_tests.js
```

### 4.2 Run Specific Tier
```bash
node tests/run_tests.js --tier 1    # Feature Coverage & Content
node tests/run_tests.js --tier 2    # Boundary & Corner Cases
node tests/run_tests.js --tier 3    # Cross-Feature Combinations
node tests/run_tests.js --tier 4    # Real-World E2E Scenarios
```

---

## 5. Discovered Implementation Defects & Escalations

The opaque-box test suite actively identified the following architectural and content discrepancies against the authoritative specifications (`PROJECT.md`, `CONTENT-AUDIT.md`, `ORIGINAL_REQUEST.md`):

### Defect 1: [DEFECT-M1-G1] Jargon Glossary Incomplete & Missing 3-Part Structure
- **Target**: `data.js` -> `modules[4].items[0]` (`m-jargon`)
- **Severity**: HIGH (Milestone M1 Deliverable)
- **Observation**: Currently contains 24 glossary items with single-line paragraph summaries (`<p>...</p>`). Specification explicitly requires 28 items, with each entry structured into 3 distinct sections: 【🎯 精准定义】、【🏢 落地场景】与【⚠️ 避坑建议】.
- **Escalation**: Escalate to Worker M1 (`worker_m1_content`) to apply the full 28-item template provided in `.agents/explorer_survey_content/handoff.md:298-850`.

### Defect 2: [DEFECT-M3-IS_TYPING_ACTIVE] Keyboard Focus Guard Missing
- **Target**: `app.js` (Global / Event dispatcher)
- **Severity**: MEDIUM (Milestone M3 Deliverable)
- **Observation**: Feature 20 requires `isTypingActive()` to guard against keyboard shortcut hijacking when typing into `<input>`, `<textarea>`, or editable fields. The function is not yet exposed or implemented in `app.js`.
- **Escalation**: Escalate to Worker M3 to implement `isTypingActive()` during Milestone 3 keyboard navigation rollout.
