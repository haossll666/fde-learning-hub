/**
 * FDE Learning Hub - Test Helpers & Opaque-Box Test Harness
 * 
 * Provides self-contained mock DOM, Storage, and VM environment for running
 * data.js and app.js in Node.js with zero external dependencies.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(PROJECT_ROOT, 'data.js');
const APP_PATH = path.join(PROJECT_ROOT, 'app.js');
const HTML_PATH = path.join(PROJECT_ROOT, 'index.html');

/**
 * In-memory mock implementation of Web Storage (localStorage)
 */
class MockStorage {
    constructor(initialData = {}) {
        this.store = { ...initialData };
    }

    getItem(key) {
        return Object.prototype.hasOwnProperty.call(this.store, key) ? String(this.store[key]) : null;
    }

    setItem(key, value) {
        this.store[key] = String(value);
    }

    removeItem(key) {
        delete this.store[key];
    }

    clear() {
        this.store = {};
    }

    get length() {
        return Object.keys(this.store).length;
    }

    key(index) {
        const keys = Object.keys(this.store);
        return keys[index] || null;
    }
}

/**
 * ClassList mock implementation
 */
class MockClassList {
    constructor(el) {
        this.el = el;
        this.classes = new Set();
        this._syncFromClassName();
    }

    _syncFromClassName() {
        this.classes.clear();
        if (this.el._className) {
            this.el._className.split(/\s+/).filter(Boolean).forEach(c => this.classes.add(c));
        }
    }

    _syncToClassName() {
        this.el._className = Array.from(this.classes).join(' ');
    }

    add(...tokens) {
        tokens.forEach(t => this.classes.add(t));
        this._syncToClassName();
    }

    remove(...tokens) {
        tokens.forEach(t => this.classes.delete(t));
        this._syncToClassName();
    }

    toggle(token, force) {
        let result;
        if (force !== undefined) {
            result = Boolean(force);
            if (result) this.classes.add(token);
            else this.classes.delete(token);
        } else {
            result = !this.classes.has(token);
            if (result) this.classes.add(token);
            else this.classes.delete(token);
        }
        this._syncToClassName();
        return result;
    }

    contains(token) {
        return this.classes.has(token);
    }

    toString() {
        return Array.from(this.classes).join(' ');
    }
}

/**
 * Lightweight mock DOM Element
 */
class MockElement {
    constructor(tagName = 'div', ownerDocument = null) {
        this.tagName = tagName.toUpperCase();
        this.ownerDocument = ownerDocument;
        this.attributes = {};
        this._className = '';
        this.classList = new MockClassList(this);
        this.children = [];
        this.parentNode = null;
        this.style = {};
        this._textContent = '';
        this._innerHTML = '';
        this._value = '';
        this.checked = false;
        this.eventListeners = {};
    }

    get id() {
        return this.attributes['id'] || '';
    }

    set id(val) {
        this.setAttribute('id', val);
    }

    get className() {
        return this._className;
    }

    set className(val) {
        this._className = val || '';
        this.classList._syncFromClassName();
    }

    get textContent() {
        if (this.children.length > 0) {
            return this.children.map(c => c.textContent).join('');
        }
        return this._textContent;
    }

    set textContent(val) {
        this.children = [];
        this._textContent = String(val);
        this._innerHTML = String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    get innerText() {
        return this.textContent;
    }

    set innerText(val) {
        this.textContent = val;
    }

    get innerHTML() {
        return this._innerHTML;
    }

    set innerHTML(html) {
        this._innerHTML = html;
        this.children = parseHtmlToMockElements(html, this.ownerDocument, this);
    }

    get value() {
        return this._value;
    }

    set value(val) {
        this._value = String(val);
    }

    setAttribute(name, value) {
        this.attributes[name] = String(value);
        if (name === 'class') {
            this.className = String(value);
        }
    }

    getAttribute(name) {
        return Object.prototype.hasOwnProperty.call(this.attributes, name) ? this.attributes[name] : null;
    }

    removeAttribute(name) {
        delete this.attributes[name];
        if (name === 'class') {
            this.className = '';
        }
    }

    hasAttribute(name) {
        return Object.prototype.hasOwnProperty.call(this.attributes, name);
    }

    appendChild(child) {
        child.parentNode = this;
        this.children.push(child);
        return child;
    }

    removeChild(child) {
        const idx = this.children.indexOf(child);
        if (idx !== -1) {
            this.children.splice(idx, 1);
            child.parentNode = null;
        }
        return child;
    }

    insertAdjacentHTML(position, html) {
        const newEls = parseHtmlToMockElements(html, this.ownerDocument, this);
        if (position === 'beforeend') {
            newEls.forEach(el => this.appendChild(el));
            this._innerHTML += html;
        } else if (position === 'afterbegin') {
            this.children.unshift(...newEls);
            this._innerHTML = html + this._innerHTML;
        } else {
            this.children.push(...newEls);
            this._innerHTML += html;
        }
    }

    insertBefore(newNode, referenceNode) {
        newNode.parentNode = this;
        const idx = this.children.indexOf(referenceNode);
        if (idx !== -1) {
            this.children.splice(idx, 0, newNode);
        } else {
            this.children.push(newNode);
        }
        return newNode;
    }

    insertAdjacentElement(position, element) {
        if (position === 'afterend' && this.parentNode) {
            const idx = this.parentNode.children.indexOf(this);
            if (idx !== -1) {
                element.parentNode = this.parentNode;
                this.parentNode.children.splice(idx + 1, 0, element);
            } else {
                this.parentNode.appendChild(element);
            }
        } else if (position === 'beforebegin' && this.parentNode) {
            this.parentNode.insertBefore(element, this);
        } else {
            this.appendChild(element);
        }
        return element;
    }

    addEventListener(event, handler) {
        if (!this.eventListeners[event]) this.eventListeners[event] = [];
        this.eventListeners[event].push(handler);
    }

    removeEventListener(event, handler) {
        if (!this.eventListeners[event]) return;
        this.eventListeners[event] = this.eventListeners[event].filter(h => h !== handler);
    }

    dispatchEvent(evt) {
        const eventObj = typeof evt === 'string' ? { type: evt } : evt;
        eventObj.target = this;
        eventObj.currentTarget = this;
        const handlers = this.eventListeners[eventObj.type] || [];
        for (const h of handlers) {
            h.call(this, eventObj);
        }
        return !eventObj.defaultPrevented;
    }

    click() {
        return this.dispatchEvent({ type: 'click', preventDefault: () => {} });
    }

    closest(selector) {
        let current = this;
        while (current) {
            if (matchesSelector(current, selector)) return current;
            current = current.parentNode;
        }
        return null;
    }

    querySelector(selector) {
        return querySelectorInternal(this, selector);
    }

    querySelectorAll(selector) {
        const results = [];
        querySelectorAllInternal(this, selector, results);
        return results;
    }
}

/**
 * Basic CSS selector matcher for mock elements
 */
function matchesSelector(el, selector) {
    if (!selector || !el || !el.tagName) return false;
    selector = selector.trim();

    if (selector.startsWith('#')) {
        return el.id === selector.slice(1);
    }
    if (selector.startsWith('.')) {
        const cls = selector.slice(1);
        return el.classList.contains(cls);
    }
    if (selector.startsWith('[') && selector.endsWith(']')) {
        const attrExpr = selector.slice(1, -1);
        if (attrExpr.includes('=')) {
            const [attr, val] = attrExpr.split('=');
            const cleanVal = val.replace(/['"]/g, '');
            return el.getAttribute(attr) === cleanVal;
        }
        return el.hasAttribute(attrExpr);
    }
    // Tag name
    return el.tagName.toLowerCase() === selector.toLowerCase();
}

function querySelectorInternal(root, selector) {
    if (root !== root.ownerDocument && matchesSelector(root, selector)) {
        return root;
    }
    for (const child of root.children) {
        if (matchesSelector(child, selector)) return child;
        const res = querySelectorInternal(child, selector);
        if (res) return res;
    }
    return null;
}

function querySelectorAllInternal(root, selector, acc) {
    for (const child of root.children) {
        if (matchesSelector(child, selector)) {
            acc.push(child);
        }
        querySelectorAllInternal(child, selector, acc);
    }
}

/**
 * Simple HTML parser that creates a tree of MockElements
 */
function parseHtmlToMockElements(html, doc, parent = null) {
    if (!html || typeof html !== 'string') return [];
    const elements = [];

    const tagRegex = /<([a-zA-Z0-9\-]+)([^>]*?)(\/?)>|([^<]+)|<\/([a-zA-Z0-9\-]+)>/g;
    let match;
    const stack = [];

    while ((match = tagRegex.exec(html)) !== null) {
        const [full, openTag, attrStr, selfClose, textContent, closeTag] = match;

        if (openTag) {
            const el = new MockElement(openTag, doc);
            el.parentNode = stack.length > 0 ? stack[stack.length - 1] : parent;

            if (attrStr) {
                const attrRegex = /([a-zA-Z0-9\-_:]+)(?:=["']([^"']*)["'])?/g;
                let attrMatch;
                while ((attrMatch = attrRegex.exec(attrStr)) !== null) {
                    const attrName = attrMatch[1];
                    const attrVal = attrMatch[2] !== undefined ? attrMatch[2] : '';
                    el.setAttribute(attrName, attrVal);
                }
            }

            if (stack.length > 0) {
                stack[stack.length - 1].children.push(el);
            } else {
                elements.push(el);
            }

            const isVoid = ['input', 'img', 'br', 'hr', 'meta', 'link'].includes(openTag.toLowerCase()) || selfClose === '/';
            if (!isVoid) {
                stack.push(el);
            }
        } else if (closeTag) {
            if (stack.length > 0 && stack[stack.length - 1].tagName.toLowerCase() === closeTag.toLowerCase()) {
                stack.pop();
            }
        } else if (textContent) {
            const trimmed = textContent.trim();
            if (trimmed && stack.length > 0) {
                stack[stack.length - 1]._textContent += textContent;
            }
        }
    }

    return elements;
}

/**
 * Mock Document implementation
 */
class MockDocument {
    constructor() {
        this.documentElement = new MockElement('html', this);
        this.documentElement.setAttribute('data-theme', 'dark');
        this.body = new MockElement('body', this);
        this.head = new MockElement('head', this);
        this.documentElement.appendChild(this.head);
        this.documentElement.appendChild(this.body);
        this.activeElement = this.body;
        this.eventListeners = {};
    }

    createElement(tagName) {
        return new MockElement(tagName, this);
    }

    getElementById(id) {
        return this.querySelector(`#${id}`);
    }

    querySelector(selector) {
        return querySelectorInternal(this.documentElement, selector);
    }

    querySelectorAll(selector) {
        const results = [];
        querySelectorAllInternal(this.documentElement, selector, results);
        return results;
    }

    addEventListener(event, handler) {
        if (!this.eventListeners[event]) this.eventListeners[event] = [];
        this.eventListeners[event].push(handler);
    }

    removeEventListener(event, handler) {
        if (!this.eventListeners[event]) return;
        this.eventListeners[event] = this.eventListeners[event].filter(h => h !== handler);
    }

    dispatchEvent(evt) {
        const handlers = this.eventListeners[evt.type] || [];
        for (const h of handlers) {
            h.call(this, evt);
        }
    }
}

/**
 * Load authoritative data.js into memory
 */
function loadData() {
    const code = fs.readFileSync(DATA_PATH, 'utf8');
    const sandbox = {
        window: {},
        console: { log: () => {}, error: () => {}, warn: () => {} }
    };
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);
    return sandbox.window.FDE_ALL_DATA || sandbox.FDE_ALL_DATA;
}

/**
 * Creates an isolated test execution sandbox for testing app.js with data.js
 */
function createTestEnv(options = {}) {
    const initialStorage = options.storage || {};
    const storage = new MockStorage(initialStorage);
    const document = new MockDocument();

    // Inject core skeleton elements matching index.html
    const ids = [
        'sidebar', 'sidebar-nav', 'progress-text', 'progress-bar-fill',
        'search-input', 'theme-toggle', 'menu-toggle', 'breadcrumb-trail',
        'section-header-mount', 'section-content-mount',
        'sidebar-backdrop', 'sidebar-close-btn', 'traffic-light-red', 'back-to-top-btn'
    ];
    ids.forEach(id => {
        let el = document.getElementById(id);
        if (!el) {
            el = document.createElement((id === 'search-input' || id === 'spotlight-input') ? 'input' : (id.includes('btn') || id === 'menu-toggle' || id === 'theme-toggle') ? 'button' : 'div');
            el.id = id;
            document.body.appendChild(el);
        }
    });

    const window = {
        location: {
            hash: options.initialHash || '',
            href: 'http://localhost:8080/' + (options.initialHash || '')
        },
        history: {
            pushState: (state, title, url) => {
                if (url && url.startsWith('#')) {
                    window.location.hash = url;
                }
            }
        },
        localStorage: storage,
        document: document,
        navigator: {
            clipboard: {
                writeText: async () => Promise.resolve()
            }
        },
        Blob: class MockBlob {
            constructor(parts = [], opts = {}) {
                this.parts = parts;
                this.opts = opts;
                this.type = opts.type || '';
                this.size = parts.reduce((acc, p) => acc + (typeof p === 'string' ? Buffer.byteLength(p) : (p.length || 0)), 0);
            }
            async text() {
                return this.parts.map(p => typeof p === 'string' ? p : p.toString()).join('');
            }
            async arrayBuffer() {
                const str = await this.text();
                return Buffer.from(str).buffer;
            }
        },
        URL: {
            createObjectURL: () => 'blob:mock-url',
            revokeObjectURL: () => {}
        },
        confirm: () => true,
        scrollTo: () => {},
        addEventListener: (event, handler) => {
            if (!window._listeners) window._listeners = {};
            if (!window._listeners[event]) window._listeners[event] = [];
            window._listeners[event].push(handler);
        },
        dispatchEvent: (evt, extra = {}) => {
            const type = typeof evt === 'string' ? evt : evt.type;
            const eventObj = typeof evt === 'string' ? { type: evt, ...extra } : evt;
            const handlers = (window._listeners && window._listeners[type]) || [];
            handlers.forEach(h => h.call(window, eventObj));
        }
    };

    const sandbox = {
        window,
        document,
        localStorage: storage,
        navigator: window.navigator,
        history: window.history,
        location: window.location,
        Blob: window.Blob,
        URL: window.URL,
        confirm: window.confirm,
        scrollTo: window.scrollTo,
        console: {
            log: () => {},
            error: () => {},
            warn: () => {},
            info: () => {}
        },
        setTimeout: (fn) => fn(),
        clearTimeout: () => {}
    };

    vm.createContext(sandbox);

    // 1. Load data.js into sandbox
    const dataCode = fs.readFileSync(DATA_PATH, 'utf8');
    vm.runInContext(dataCode, sandbox);

    // 2. Load app.js into sandbox
    const appCode = fs.readFileSync(APP_PATH, 'utf8');
    vm.runInContext(appCode, sandbox);

    return {
        sandbox,
        window,
        document,
        storage,
        data: sandbox.window.FDE_ALL_DATA || sandbox.FDE_ALL_DATA
    };
}

/**
 * Lightweight test suite runner helper
 */
class TestSuite {
    constructor(name) {
        this.name = name;
        this.tests = [];
        this.defects = [];
    }

    test(desc, fn) {
        this.tests.push({ desc, fn });
    }

    defect(id, summary, detail) {
        this.defects.push({ id, summary, detail });
    }

    async run() {
        const results = {
            suiteName: this.name,
            total: this.tests.length,
            passed: 0,
            failed: 0,
            failures: [],
            defects: [...this.defects]
        };

        for (const t of this.tests) {
            const startTime = Date.now();
            try {
                await t.fn();
                results.passed++;
                results.failures.push({
                    desc: t.desc,
                    passed: true,
                    durationMs: Date.now() - startTime
                });
            } catch (err) {
                results.failed++;
                results.failures.push({
                    desc: t.desc,
                    passed: false,
                    error: err.message || String(err),
                    stack: err.stack,
                    durationMs: Date.now() - startTime
                });
            }
        }

        return results;
    }
}

module.exports = {
    PROJECT_ROOT,
    DATA_PATH,
    APP_PATH,
    HTML_PATH,
    MockStorage,
    MockElement,
    MockDocument,
    loadData,
    createTestEnv,
    TestSuite
};
