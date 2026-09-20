/**
 * Tier 5: Mobile Device Responsiveness & Touch Ergonomics Test Suite
 * 
 * Verifies:
 * - 5.1 Mobile HTML Meta tags (viewport-fit=cover, webapp-capable, translucent status bar) & DOM skeleton
 * - 5.2 Mobile Sidebar Drawer State Machine (open, close, toggle, backdrop, body lock)
 * - 5.3 Mobile Interaction Bindings (menu toggle, close button, backdrop click, traffic light red, ESC key)
 * - 5.4 Automatic drawer dismiss upon section selection (loadSection)
 * - 5.5 Mobile Back-to-Top Floating Button scroll reactivity and smooth scroll API
 * - 5.6 CSS Media Query and Touch-Ergonomics Specification Audit in style.css
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { TestSuite, createTestEnv, PROJECT_ROOT } = require('./test_helpers');

function createTier5Suite() {
    const suite = new TestSuite('Tier 5: Mobile Responsiveness & Touch Ergonomics');

    // 5.1 Mobile HTML Meta Tags & DOM Structure
    suite.test('5.1 Mobile HTML Meta tags & DOM skeleton integrity', () => {
        const htmlPath = path.join(PROJECT_ROOT, 'index.html');
        const html = fs.readFileSync(htmlPath, 'utf8');

        // Viewport with viewport-fit=cover
        assert.ok(html.includes('viewport-fit=cover'), 'HTML must include viewport-fit=cover for notch/safe-area support');
        assert.ok(html.includes('apple-mobile-web-app-capable'), 'HTML must declare apple-mobile-web-app-capable');
        assert.ok(html.includes('apple-mobile-web-app-status-bar-style'), 'HTML must declare black-translucent status bar');
        assert.ok(html.includes('format-detection'), 'HTML must declare format-detection for telephone');

        // Required mobile elements
        assert.ok(html.includes('id="sidebar-backdrop"'), 'HTML must contain #sidebar-backdrop for drawer overlay');
        assert.ok(html.includes('id="sidebar-close-btn"'), 'HTML must contain #sidebar-close-btn for mobile dismiss');
        assert.ok(html.includes('id="back-to-top-btn"'), 'HTML must contain #back-to-top-btn for long-page reading');
        assert.ok(html.includes('class="top-bar-left"'), 'HTML must contain .top-bar-left layout wrapper');
        assert.ok(html.includes('class="top-bar-right"'), 'HTML must contain .top-bar-right layout wrapper');
    });

    // 5.2 Mobile Sidebar Drawer State Machine
    suite.test('5.2 Mobile Sidebar Drawer State Machine (open, close, toggle, body lock)', () => {
        const env = createTestEnv();
        env.sandbox.initApp();

        const sidebar = env.document.getElementById('sidebar');
        const backdrop = env.document.getElementById('sidebar-backdrop');
        const body = env.document.body;

        // Initially closed
        assert.ok(!sidebar.classList.contains('open'), 'Sidebar starts closed');
        assert.ok(!backdrop.classList.contains('active'), 'Backdrop starts inactive');
        assert.ok(!body.classList.contains('sidebar-open'), 'Body scroll lock starts disabled');

        // Open Sidebar
        env.sandbox.openSidebar();
        assert.ok(sidebar.classList.contains('open'), 'Sidebar has .open after openSidebar()');
        assert.ok(backdrop.classList.contains('active'), 'Backdrop has .active after openSidebar()');
        assert.ok(body.classList.contains('sidebar-open'), 'Body has .sidebar-open to prevent scroll-through');

        // Close Sidebar
        env.sandbox.closeSidebar();
        assert.ok(!sidebar.classList.contains('open'), 'Sidebar removes .open after closeSidebar()');
        assert.ok(!backdrop.classList.contains('active'), 'Backdrop removes .active after closeSidebar()');
        assert.ok(!body.classList.contains('sidebar-open'), 'Body removes .sidebar-open after closeSidebar()');

        // Toggle Sidebar
        env.sandbox.toggleSidebar();
        assert.ok(sidebar.classList.contains('open'), 'Toggle opens sidebar');
        assert.ok(backdrop.classList.contains('active'), 'Toggle activates backdrop');

        env.sandbox.toggleSidebar();
        assert.ok(!sidebar.classList.contains('open'), 'Toggle closes sidebar');
        assert.ok(!backdrop.classList.contains('active'), 'Toggle deactivates backdrop');
    });

    // 5.3 Mobile Interaction Bindings
    suite.test('5.3 Mobile Interaction Bindings (menu toggle, close button, backdrop, ESC key)', () => {
        const env = createTestEnv();
        env.sandbox.initApp();

        const sidebar = env.document.getElementById('sidebar');
        const backdrop = env.document.getElementById('sidebar-backdrop');
        const menuBtn = env.document.getElementById('menu-toggle');
        const closeBtn = env.document.getElementById('sidebar-close-btn');
        const trafficRed = env.document.getElementById('traffic-light-red');

        // 1. Click menu button to open
        menuBtn.click();
        assert.ok(sidebar.classList.contains('open'), 'Clicking menu button opens sidebar');

        // 2. Click close button to close
        closeBtn.click();
        assert.ok(!sidebar.classList.contains('open'), 'Clicking close button closes sidebar');

        // 3. Click menu button again to open, then click backdrop to close
        menuBtn.click();
        assert.ok(sidebar.classList.contains('open'), 'Sidebar reopens via menu button');
        backdrop.click();
        assert.ok(!sidebar.classList.contains('open'), 'Clicking backdrop closes sidebar');

        // 4. Click menu button again to open, then click traffic light red to close
        menuBtn.click();
        assert.ok(sidebar.classList.contains('open'), 'Sidebar opens again');
        trafficRed.click();
        assert.ok(!sidebar.classList.contains('open'), 'Clicking traffic light red closes sidebar');

        // 5. Press ESC key to close sidebar when spotlight is NOT open
        menuBtn.click();
        assert.ok(sidebar.classList.contains('open'), 'Sidebar opens before ESC test');
        env.window.dispatchEvent('keydown', { key: 'Escape', preventDefault: () => {} });
        assert.ok(!sidebar.classList.contains('open'), 'Pressing Escape dismisses open sidebar drawer');
    });

    // 5.4 Automatic Drawer Dismiss on Section Load
    suite.test('5.4 Automatic drawer dismiss upon section selection', () => {
        const env = createTestEnv();
        env.sandbox.initApp();

        const sidebar = env.document.getElementById('sidebar');
        const backdrop = env.document.getElementById('sidebar-backdrop');
        const body = env.document.body;

        // User opens drawer on mobile
        env.sandbox.openSidebar();
        assert.ok(sidebar.classList.contains('open'), 'Sidebar is open');
        assert.ok(backdrop.classList.contains('active'), 'Backdrop is active');

        // User selects chapter 1.2
        env.sandbox.loadSection(1, 1);

        // Sidebar and backdrop must automatically dismiss and body unlocked
        assert.ok(!sidebar.classList.contains('open'), 'Sidebar automatically closed after loadSection');
        assert.ok(!backdrop.classList.contains('active'), 'Backdrop automatically closed after loadSection');
        assert.ok(!body.classList.contains('sidebar-open'), 'Body scroll lock released after loadSection');
    });

    // 5.5 Mobile Back-to-Top Floating Button
    suite.test('5.5 Mobile Back-to-Top Floating Button scroll reactivity and smooth scroll API', () => {
        const env = createTestEnv();
        env.sandbox.initApp();

        const btn = env.document.getElementById('back-to-top-btn');
        assert.ok(btn, 'Back to top button exists');

        // Initially hidden
        btn.classList.add('hidden');

        // Scroll down past 280px
        env.window.scrollY = 350;
        env.window.dispatchEvent('scroll');
        assert.ok(!btn.classList.contains('hidden'), 'Back-to-top button becomes visible when scrollY > 280');

        // Scroll back near top
        env.window.scrollY = 100;
        env.window.dispatchEvent('scroll');
        assert.ok(btn.classList.contains('hidden'), 'Back-to-top button hides when scrollY <= 280');

        // Click scrollToTop
        let scrolledToTop = false;
        env.window.scrollTo = (opts) => {
            if (opts && opts.top === 0 && opts.behavior === 'smooth') {
                scrolledToTop = true;
            }
        };
        env.sandbox.scrollToTop();
        assert.ok(scrolledToTop, 'scrollToTop triggers window.scrollTo with top: 0 and smooth behavior');
    });

    // 5.6 CSS Media Query and Touch-Ergonomics Specification Audit
    suite.test('5.6 CSS Media Query and Touch-Ergonomics Specification Audit in style.css', () => {
        const cssPath = path.join(PROJECT_ROOT, 'style.css');
        const css = fs.readFileSync(cssPath, 'utf8');

        // Safe area tokens
        assert.ok(css.includes('--safe-area-top: env(safe-area-inset-top'), 'CSS must define --safe-area-top token');
        assert.ok(css.includes('--safe-area-bottom: env(safe-area-inset-bottom'), 'CSS must define --safe-area-bottom token');

        // Touch ergonomics
        assert.ok(css.includes('-webkit-tap-highlight-color: transparent'), 'CSS must disable default tap highlight');
        assert.ok(css.includes('touch-action: manipulation'), 'CSS must specify touch-action: manipulation');
        assert.ok(css.includes('.sidebar-backdrop'), 'CSS must style .sidebar-backdrop');
        assert.ok(css.includes('.sidebar-close-btn'), 'CSS must style .sidebar-close-btn');
        assert.ok(css.includes('.back-to-top-btn'), 'CSS must style .back-to-top-btn');

        // Multi-tier breakpoints
        assert.ok(css.includes('@media (max-width: 880px)'), 'CSS must include <= 880px tablet breakpoint');
        assert.ok(css.includes('@media (max-width: 640px)'), 'CSS must include <= 640px smartphone breakpoint');
        assert.ok(css.includes('@media (max-width: 480px)'), 'CSS must include <= 480px compact phone breakpoint');

        // Mobile spotlight input 16px to prevent iOS auto-zoom
        assert.ok(css.includes('font-size: 16px'), 'Mobile spotlight input must enforce 16px to stop iOS zooming');

        // Checklists and tables touch scroll
        assert.ok(css.includes('-webkit-overflow-scrolling: touch'), 'CSS must enable momentum touch scrolling on scrollable regions');
    });

    return suite;
}

module.exports = { createTier5Suite };
