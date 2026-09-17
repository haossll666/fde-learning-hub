# Project: FDE Learning Hub & Flight Simulator Optimization

## Architecture
FDE Learning Hub & Flight Simulator is a client-side vanilla JavaScript / HTML5 / CSS3 single-page learning application designed with Apple Cupertino Human Interface Guidelines.
- `data.js`: Authoritative learning curriculum, structured lessons, full quiz questions, PBL branching scenarios, 28-item 3D jargon dictionary, and structured literature references.
- `app.js`: Application runtime engine, state persistence (localStorage), Spotlight search controller, navigation and accordion sidebar, reactive tools (CoI calculator, SOW, Air-Gap), quiz & sandbox state machines, keyboard event dispatcher.
- `index.html`: Semantic HTML5 skeleton, Apple HIG header/navigation, sidebar container, main reading stage, Spotlight search modal overlay, a11y landmarks.
- `style.css`: Cupertino visual design system, SF Pro/Mono typography, material translucency (backdrop-filter), hairline borders, spring physics micro-interactions, WCAG 2.1 AA dual-theme color tokens, and 44x44pt touch targets.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | E1 Delta Disambiguation | Differentiate Palantir Delta role vs Awesome-FDE-Roadmap The Delta (70/30 ratio as empirical) | M1 | CONTENT-AUDIT.md E1 |
| 2 | E2 AIP Bootcamp TTV | Clarify official TTV (1-5 days) vs unreleased conversion rate (qualify 10%->75%) | M1 | CONTENT-AUDIT.md E2 |
| 3 | E3 OpenAI Structured Outputs | Update `eng-2` to GA `client.chat.completions.parse` with Pydantic & Responses API notes | M1 | CONTENT-AUDIT.md E3 |
| 4 | Unsourced Numbers Fix | c-3 MIT shadow AI stat (90%), c-4 18-24mo exec tenure tag, eng-5 RAGAS baseline tag | M1 | CONTENT-AUDIT.md III |
| 5 | G1 28-Term 3D Jargon Glossary | Expand glossary to 28 terms with Definition, Real-world Context, and Pitfall Warning | M1 | CONTENT-AUDIT.md G1 |
| 6 | G2 MIT NANDA Empirical Injection | Inject $30-40B, 95% zero P&L, Learning Gap, 3 case studies (EchoStar, Markerstudy, Lumen) | M1 | CONTENT-AUDIT.md G2 |
| 7 | G3 MCP Evolution & Primitives | Add Nov 2024 / Mar 2025 milestones + Sampling, Roots, Elicitation enterprise primitives | M1 | CONTENT-AUDIT.md G3 |
| 8 | G4 Gary Klein Pre-Mortem Citation | Cite Gary Klein (HBR 2007) and Google Ventures framework for pre-mortem simulation | M1 | CONTENT-AUDIT.md G4 |
| 9 | G5 CoI 85% Automation Basis | Document 85% straight-through processing (STP) baseline + 15% HITL exception handling | M1 | CONTENT-AUDIT.md G5 |
| 10 | Structured References Schema | Add `refs` array (title, url, note, badge) across chapters in `data.js` and render footer in `app.js` | M1 | CONTENT-AUDIT.md IV |
| 11 | Cognitive Learning Scaffold | Active recall structure: Core Concept -> Self-Test -> Sandbox -> Calculator | M2 | ORIGINAL_REQUEST R2 |
| 12 | Chapter Guides & Retro Anchors | Standardize guide headers, retro anchors, practical pitfalls, actionable takeaways | M2 | ORIGINAL_REQUEST R2 |
| 13 | Quiz Engine Cognitive Feedback | Option-level attribution, trap classification, retry/spaced practice resets | M2 | ORIGINAL_REQUEST R2 |
| 14 | Multi-Turn Branching PBL Sandbox | Turn-based state machine with compounding trust/delay metrics and recovery branches | M2 | ORIGINAL_REQUEST R2 |
| 15 | Spotlight Search Modal | Centered frosted modal (`Cmd/Ctrl+K`), fuzzy match, `<mark>` highlight, pulse-scroll | M3 | ORIGINAL_REQUEST R3 |
| 16 | Accordion Sidebar Persistence | Collapsible module headers, chevron rotation, localStorage persistence | M3 | ORIGINAL_REQUEST R3 |
| 17 | Progress Sync & Stale ID Pruning | 100% reload sync against FDE_ALL_DATA, 0 invalid IDs, 24 section baseline | M3 | ORIGINAL_REQUEST R3 |
| 18 | Reactive CoI Calculator | Dual-bound sliders, live 60fps calculation, custom automation rate, reset & export memo | M3 | ORIGINAL_REQUEST R3 |
| 19 | SOW & Air-Gap Defense Checklists | Risk tiers (`[BLOCKER]`, `[CRITICAL]`), defense gauge, Air-gap 4 security gates, export | M3 | ORIGINAL_REQUEST R3 |
| 20 | Keyboard Navigation & Focus Guard | `isTypingActive()` guard preventing key hijacking during input; J/K/Enter/Esc shortcuts | M3 | ORIGINAL_REQUEST R3 |
| 21 | WCAG 2.1 AA Contrast Compliance | Light Mode `--text-secondary` to `#59595e` (5.9:1), accessible green/orange/red text tokens | M4 | ORIGINAL_REQUEST R4 |
| 22 | Apple HIG 44x44pt Touch Targets | Expand buttons, nav items, inputs, checkboxes to >= 44x44pt touch bounds | M4 | ORIGINAL_REQUEST R4 |
| 23 | Cupertino Visuals & Spring Physics | SF Pro/Mono typography, material translucency, hairline borders, spring cubic-bezier | M4 | ORIGINAL_REQUEST R4 |
| 24 | Unstyled Runtime Classes Styling | Add Cupertino CSS for 11 runtime classes (`.checklist-card`, `.diagram-card`, `.badge`, etc.) | M4 | ORIGINAL_REQUEST R4 |
| 25 | E2E Opaque-Box Test Suite | Automated verification harness covering Tiers 1-4, syntax validation, zero errors | M5 | ORIGINAL_REQUEST AC |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Content Accuracy & Authority Enhancement | `data.js` (Features 1-10: E1-E3, Section III numbers, G1-G5, 28 jargons, refs) | None | DONE |
| M2 | Pedagogy & Active Learning Architecture | `data.js` & `app.js` (Features 11-14: cognitive loop, quiz cognitive attribution, multi-turn PBL) | M1 | DONE |
| M3 | Interaction & Usability Refinement | `app.js` & `index.html` (Features 15-20: Spotlight modal, accordion persistence, CoI/SOW/Air-gap tools, keyboard shortcuts, a11y) | M2 | DONE |
| M4 | Apple HIG Alignment & Cupertino Aesthetics | `style.css` & `index.html` (Features 21-24: WCAG AA contrast, 44x44pt touch targets, spring physics, unstyled classes) | M3 | DONE |
| M5 | E2E Testing Track & Full Forensic Audit | `tests/`, `TEST_INFRA.md`, `TEST_READY.md` (Feature 25: Automated test suite, node syntax checks, Forensic Audit) | Parallel / M1-M4 | DONE |



## Interface Contracts
### `data.js` ↔ `app.js`
- `item.refs`: Array<{ title: string, url: string, note?: string, badge?: string }>
- `quiz.cognitive_trap`: string
- `quiz.option_explanations`: Array<{ is_correct: boolean, verdict: string, rationale: string }>
- `pbl.turns`: Array<{ turn_id: string, stage: string, scenario: string, dilemma: string, choices: Array<{ text: string, trust_delta: number, delay_days: number, feedback: string, next_turn_id?: string, verdict?: string }> }>
- `item.guide`: { objectives: string[], key_question: string }
- `item.pitfalls`: string[]
- `item.takeaways`: string[]
- `item.retro_anchor`: { memory_hook: string, field_rule: string }

### `app.js` ↔ `style.css`
- Spotlight: `#spotlight-overlay`, `.spotlight-modal`, `.spotlight-input`, `.spotlight-results`, `.spotlight-item.active`, `.spotlight-mark`
- Toast: `.capsule-toast`, `.capsule-toast.show`
- Badges: `.badge.green`, `.badge.red`, `.badge.orange`, `.badge.blue`, `.badge.purple`
- Chevrons: `.nav-module-header.collapsed .nav-chevron`
- Touch targets: interactive controls meet >= 44x44 pt touch targets.
- Accessibility: `:focus-visible` rings with `--apple-blue` glow.

## Code Layout
- Exclusive File Ownership:
  - Worker M1: `/Users/rock/Projects/haossll666/fde-learning-hub/data.js`
  - Worker M2: `/Users/rock/Projects/haossll666/fde-learning-hub/data.js` (pedagogical structures) & `/Users/rock/Projects/haossll666/fde-learning-hub/app.js` (rendering hooks)
  - Worker M3: `/Users/rock/Projects/haossll666/fde-learning-hub/app.js` & `/Users/rock/Projects/haossll666/fde-learning-hub/index.html`
  - Worker M4: `/Users/rock/Projects/haossll666/fde-learning-hub/style.css` & `/Users/rock/Projects/haossll666/fde-learning-hub/index.html`
  - Test Writer / Challenger: `/Users/rock/Projects/haossll666/fde-learning-hub/tests/`
