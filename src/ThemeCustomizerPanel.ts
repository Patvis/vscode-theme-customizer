import * as vscode from 'vscode';

interface ColorEntry { label: string; key: string; default: string; }
interface SettingEntry {
    label: string; key: string;
    type: 'text' | 'number' | 'select' | 'checkbox';
    placeholder?: string; min?: number; max?: number; step?: number;
    options?: Array<{ value: string; label: string }>;
}

const EDITOR_COLORS: ColorEntry[] = [
    { label: 'Background',             key: 'editor.background',                      default: '#1e1e1e' },
    { label: 'Foreground',             key: 'editor.foreground',                      default: '#d4d4d4' },
    { label: 'Cursor',                 key: 'editorCursor.foreground',                default: '#aeafad' },
    { label: 'Selection',              key: 'editor.selectionBackground',             default: '#264f78' },
    { label: 'Line Highlight',         key: 'editor.lineHighlightBackground',         default: '#2a2d2e' },
    { label: 'Word Highlight',         key: 'editor.wordHighlightBackground',         default: '#575757' },
    { label: 'Bracket Match',          key: 'editorBracketMatch.background',          default: '#0064001a' },
    { label: 'Find Match',             key: 'editor.findMatchBackground',             default: '#515c6a' },
    { label: 'Find Match Highlight',   key: 'editor.findMatchHighlightBackground',    default: '#ea5c00' },
    { label: 'Gutter Background',      key: 'editorGutter.background',                default: '#1e1e1e' },
    { label: 'Line Numbers',           key: 'editorLineNumber.foreground',            default: '#858585' },
    { label: 'Active Line Number',     key: 'editorLineNumber.activeForeground',      default: '#c6c6c6' },
    { label: 'Indent Guides',          key: 'editorIndentGuide.background1',          default: '#404040' },
    { label: 'Active Indent Guide',    key: 'editorIndentGuide.activeBackground1',    default: '#707070' },
];

const SIDEBAR_COLORS: ColorEntry[] = [
    { label: 'Background',             key: 'sideBar.background',                    default: '#252526' },
    { label: 'Foreground',             key: 'sideBar.foreground',                    default: '#cccccc' },
    { label: 'Border',                 key: 'sideBar.border',                        default: '#252526' },
    { label: 'Title Foreground',       key: 'sideBarTitle.foreground',               default: '#bbbbbb' },
    { label: 'Section Header',         key: 'sideBarSectionHeader.background',       default: '#808080' },
];

const ACTIVITY_BAR_COLORS: ColorEntry[] = [
    { label: 'Background',             key: 'activityBar.background',                default: '#333333' },
    { label: 'Active Icon',            key: 'activityBar.foreground',                default: '#ffffff' },
    { label: 'Inactive Icon',          key: 'activityBar.inactiveForeground',        default: '#ffffff66' },
    { label: 'Badge Background',       key: 'activityBarBadge.background',           default: '#007acc' },
    { label: 'Badge Foreground',       key: 'activityBarBadge.foreground',           default: '#ffffff' },
];

const STATUS_BAR_COLORS: ColorEntry[] = [
    { label: 'Background',             key: 'statusBar.background',                  default: '#007acc' },
    { label: 'Foreground',             key: 'statusBar.foreground',                  default: '#ffffff' },
    { label: 'Debugging Background',   key: 'statusBar.debuggingBackground',         default: '#cc6633' },
    { label: 'No Folder Background',   key: 'statusBar.noFolderBackground',          default: '#68217a' },
];

const TITLE_BAR_COLORS: ColorEntry[] = [
    { label: 'Active Background',      key: 'titleBar.activeBackground',             default: '#3c3c3c' },
    { label: 'Active Foreground',      key: 'titleBar.activeForeground',             default: '#cccccc' },
    { label: 'Inactive Background',    key: 'titleBar.inactiveBackground',           default: '#3c3c3c' },
];

const TAB_COLORS: ColorEntry[] = [
    { label: 'Tab Bar Background',     key: 'editorGroupHeader.tabsBackground',      default: '#2d2d2d' },
    { label: 'Active Background',      key: 'tab.activeBackground',                  default: '#1e1e1e' },
    { label: 'Active Foreground',      key: 'tab.activeForeground',                  default: '#ffffff' },
    { label: 'Inactive Background',    key: 'tab.inactiveBackground',                default: '#2d2d2d' },
    { label: 'Inactive Foreground',    key: 'tab.inactiveForeground',                default: '#ffffff80' },
    { label: 'Active Bottom Border',   key: 'tab.activeBorderTop',                   default: '#007acc' },
];

const PANEL_COLORS: ColorEntry[] = [
    { label: 'Panel Background',       key: 'panel.background',                      default: '#1e1e1e' },
    { label: 'Panel Border',           key: 'panel.border',                          default: '#808080' },
    { label: 'Terminal Background',    key: 'terminal.background',                   default: '#1e1e1e' },
    { label: 'Terminal Foreground',    key: 'terminal.foreground',                   default: '#cccccc' },
    { label: 'Terminal Cursor',        key: 'terminalCursor.foreground',             default: '#ffffff' },
    { label: 'Terminal Selection',     key: 'terminal.selectionBackground',          default: '#ffffff40' },
];

const MANAGED_COLOR_DEFAULTS: Record<string, string> = Object.fromEntries([
    ...EDITOR_COLORS, ...SIDEBAR_COLORS, ...ACTIVITY_BAR_COLORS,
    ...STATUS_BAR_COLORS, ...TITLE_BAR_COLORS, ...TAB_COLORS, ...PANEL_COLORS,
].map(e => [e.key, e.default]));

const SYNTAX_TOKENS: ColorEntry[] = [
    { label: 'Comments',               key: 'comments',   default: '#6a9955' },
    { label: 'Strings',                key: 'strings',    default: '#ce9178' },
    { label: 'Keywords',               key: 'keywords',   default: '#569cd6' },
    { label: 'Numbers',                key: 'numbers',    default: '#b5cea8' },
    { label: 'Types / Classes',        key: 'types',      default: '#4ec9b0' },
    { label: 'Functions',              key: 'functions',  default: '#dcdcaa' },
    { label: 'Variables',              key: 'variables',  default: '#9cdcfe' },
];

const FONT_SETTINGS: SettingEntry[] = [
    { label: 'Font Family',    key: 'editor.fontFamily',    type: 'text',     placeholder: 'Consolas, monospace' },
    { label: 'Font Size',      key: 'editor.fontSize',      type: 'number',   min: 8,  max: 72, step: 1 },
    { label: 'Line Height',    key: 'editor.lineHeight',    type: 'number',   min: 0,  max: 150, step: 1 },
    { label: 'Font Ligatures', key: 'editor.fontLigatures', type: 'checkbox' },
    { label: 'Font Weight',    key: 'editor.fontWeight',    type: 'select',   options: [
        { value: 'normal', label: 'Normal' }, { value: 'bold', label: 'Bold' },
        { value: '300', label: '300 – Light' }, { value: '400', label: '400 – Regular' },
        { value: '500', label: '500 – Medium' }, { value: '600', label: '600 – Semi Bold' },
        { value: '700', label: '700 – Bold' },
    ]},
];

const EDITOR_SETTINGS: SettingEntry[] = [
    { label: 'Tab Size',        key: 'editor.tabSize',          type: 'number', min: 1, max: 16, step: 1 },
    { label: 'Word Wrap',       key: 'editor.wordWrap',         type: 'select', options: [
        { value: 'off', label: 'Off' }, { value: 'on', label: 'On' },
        { value: 'wordWrapColumn', label: 'Word Wrap Column' }, { value: 'bounded', label: 'Bounded' },
    ]},
    { label: 'Cursor Style',    key: 'editor.cursorStyle',      type: 'select', options: [
        { value: 'line', label: 'Line' }, { value: 'block', label: 'Block' },
        { value: 'underline', label: 'Underline' }, { value: 'line-thin', label: 'Line Thin' },
        { value: 'block-outline', label: 'Block Outline' }, { value: 'underline-thin', label: 'Underline Thin' },
    ]},
    { label: 'Cursor Blinking', key: 'editor.cursorBlinking',   type: 'select', options: [
        { value: 'blink', label: 'Blink' }, { value: 'smooth', label: 'Smooth' },
        { value: 'phase', label: 'Phase' }, { value: 'expand', label: 'Expand' }, { value: 'solid', label: 'Solid' },
    ]},
    { label: 'Line Numbers',    key: 'editor.lineNumbers',      type: 'select', options: [
        { value: 'on', label: 'On' }, { value: 'off', label: 'Off' },
        { value: 'relative', label: 'Relative' }, { value: 'interval', label: 'Interval' },
    ]},
    { label: 'Render Whitespace', key: 'editor.renderWhitespace', type: 'select', options: [
        { value: 'none', label: 'None' }, { value: 'boundary', label: 'Boundary' },
        { value: 'selection', label: 'Selection' }, { value: 'trailing', label: 'Trailing' }, { value: 'all', label: 'All' },
    ]},
    { label: 'Minimap',                     key: 'editor.minimap.enabled',                  type: 'checkbox' },
    { label: 'Smooth Scrolling',            key: 'editor.smoothScrolling',                  type: 'checkbox' },
    { label: 'Format On Save',              key: 'editor.formatOnSave',                     type: 'checkbox' },
    { label: 'Bracket Pair Colorization',   key: 'editor.bracketPairColorization.enabled',  type: 'checkbox' },
];

function colorRow(e: ColorEntry, isToken = false): string {
    const attr = isToken ? 'data-token-key' : 'data-color-key';
    const cmd  = isToken ? 'clearTokenColor' : 'resetColor';
    return `<div class="color-row">
      <div class="color-meta">
        <span class="color-label">${e.label}</span>
        <span class="color-key">${e.key}</span>
      </div>
      <div class="color-input-wrap">
        <input type="checkbox" class="enable-check" ${attr}="${e.key}" title="Enable customization">
        <input type="color" ${attr}="${e.key}" value="${e.default}" disabled title="${e.key}">
        <input type="text" class="hex-input" ${attr}="${e.key}" value="${e.default}" maxlength="7" disabled>
        <button class="color-reset-btn" data-attr="${attr}" data-key="${e.key}" data-cmd="${cmd}" title="Clear override">↺</button>
      </div>
    </div>`;
}

function settingRow(e: SettingEntry): string {
    let control = '';
    if (e.type === 'text') {
        control = `<input type="text" data-setting-key="${e.key}" placeholder="${e.placeholder ?? ''}" disabled>`;
    } else if (e.type === 'number') {
        control = `<input type="number" data-setting-key="${e.key}" min="${e.min}" max="${e.max}" step="${e.step ?? 1}" disabled>`;
    } else if (e.type === 'select') {
        const opts = (e.options ?? []).map(o => `<option value="${o.value}">${o.label}</option>`).join('');
        control = `<select data-setting-key="${e.key}" disabled>${opts}</select>`;
    } else if (e.type === 'checkbox') {
        control = `<label class="toggle"><input type="checkbox" data-setting-key="${e.key}" disabled><span class="toggle-track"></span></label>`;
    }
    return `<div class="setting-row"><span class="setting-label">${e.label}</span><input type="checkbox" class="enable-check" data-setting-enable="${e.key}"><div class="setting-control">${control}</div><button class="color-reset-btn" data-setting-reset="${e.key}" title="Clear override">↺</button></div>`;
}

function section(title: string, rows: string): string {
    return `<div class="section"><div class="section-title">${title}</div>${rows}</div>`;
}

function collapsibleSection(title: string, rows: string): string {
    return `<details class="section" open><summary class="section-title">${title}</summary>${rows}</details>`;
}

export class ThemeCustomizerPanel {
    public static currentPanel: ThemeCustomizerPanel | undefined;
    private static readonly viewType = 'themeCustomizer';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _context: vscode.ExtensionContext;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri, context: vscode.ExtensionContext) {
        if (ThemeCustomizerPanel.currentPanel) {
            ThemeCustomizerPanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
            return;
        }
        const panel = vscode.window.createWebviewPanel(
            ThemeCustomizerPanel.viewType,
            'Theme Customizer',
            vscode.ViewColumn.One,
            { enableScripts: true, retainContextWhenHidden: true }
        );
        ThemeCustomizerPanel.currentPanel = new ThemeCustomizerPanel(panel, context);
    }

    private constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
        this._panel = panel;
        this._context = context;
        this._panel.webview.html = this._buildHtml();
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.onDidReceiveMessage(msg => this._handleMessage(msg), null, this._disposables);
    }

    private _sendSettings(
        colorCustomizations?: Record<string, string>,
        tokenColorCustomizations?: Record<string, any>,
        settingOverridesOverride?: Record<string, any>
    ) {
        const cfg = vscode.workspace.getConfiguration();
        let settingOverrides: Record<string, any>;
        if (settingOverridesOverride !== undefined) {
            settingOverrides = settingOverridesOverride;
        } else {
            settingOverrides = {};
            for (const e of [...FONT_SETTINGS, ...EDITOR_SETTINGS]) {
                const v = cfg.inspect(e.key)?.globalValue;
                if (v !== undefined) { settingOverrides[e.key] = v; }
            }
        }
        this._panel.webview.postMessage({
            command: 'loadSettings',
            settings: {
                enabled:                  this._context.globalState.get<boolean>('themeCustomizerEnabled', true),
                colorCustomizations:      colorCustomizations      ?? cfg.get<Record<string, string>>('workbench.colorCustomizations', {}),
                tokenColorCustomizations: tokenColorCustomizations ?? cfg.get<Record<string, any>>('editor.tokenColorCustomizations', {}),
                settingOverrides,
                fontFamily:    cfg.get('editor.fontFamily', ''),
                fontSize:      cfg.get('editor.fontSize', 14),
                lineHeight:    cfg.get('editor.lineHeight', 0),
                fontLigatures: cfg.get('editor.fontLigatures', false),
                fontWeight:    cfg.get('editor.fontWeight', 'normal'),
                tabSize:       cfg.get('editor.tabSize', 4),
                wordWrap:      cfg.get('editor.wordWrap', 'off'),
                cursorStyle:   cfg.get('editor.cursorStyle', 'line'),
                cursorBlinking: cfg.get('editor.cursorBlinking', 'blink'),
                lineNumbers:   cfg.get('editor.lineNumbers', 'on'),
                renderWhitespace: cfg.get('editor.renderWhitespace', 'selection'),
                minimap:       cfg.get('editor.minimap.enabled', true),
                smoothScrolling: cfg.get('editor.smoothScrolling', false),
                formatOnSave:  cfg.get('editor.formatOnSave', false),
                bracketPairColorization: cfg.get('editor.bracketPairColorization.enabled', true),
            }
        });
    }

    private async _handleMessage(msg: any) {
        const cfg = vscode.workspace.getConfiguration();
        const G = vscode.ConfigurationTarget.Global;

        switch (msg.command) {
            case 'ready':
                this._sendSettings();
                break;

            case 'updateColor': {
                const cur = cfg.get<Record<string, string>>('workbench.colorCustomizations', {});
                await cfg.update('workbench.colorCustomizations', { ...cur, [msg.key]: msg.value }, G);
                break;
            }
            case 'updateColors': {
                const cur = cfg.get<Record<string, string>>('workbench.colorCustomizations', {});
                await cfg.update('workbench.colorCustomizations', { ...cur, ...msg.updates }, G);
                break;
            }
            case 'clearColor': {
                const cur = { ...cfg.get<Record<string, string>>('workbench.colorCustomizations', {}) };
                delete cur[msg.key];
                await cfg.update('workbench.colorCustomizations', cur, G);
                break;
            }
            case 'clearColors': {
                const cur = { ...cfg.get<Record<string, string>>('workbench.colorCustomizations', {}) };
                for (const key of (msg.keys as string[])) { delete cur[key]; }
                await cfg.update('workbench.colorCustomizations', cur, G);
                break;
            }
            case 'updateTokenColor': {
                const cur = cfg.get<Record<string, any>>('editor.tokenColorCustomizations', {});
                await cfg.update('editor.tokenColorCustomizations', { ...cur, [msg.key]: msg.value }, G);
                break;
            }
            case 'clearTokenColor': {
                const cur = { ...cfg.get<Record<string, any>>('editor.tokenColorCustomizations', {}) };
                delete cur[msg.key];
                await cfg.update('editor.tokenColorCustomizations', cur, G);
                break;
            }
            case 'updateSetting':
                await cfg.update(msg.key, msg.value, G);
                break;

            case 'clearSetting':
                await cfg.update(msg.key, undefined, G);
                break;

            case 'resetColor': {
                const themeColors = await this._loadThemeColors();
                const cur = { ...cfg.get<Record<string, string>>('workbench.colorCustomizations', {}) };
                const color = themeColors[msg.key] ?? MANAGED_COLOR_DEFAULTS[msg.key];
                if (color) { cur[msg.key] = color; } else { delete cur[msg.key]; }
                await cfg.update('workbench.colorCustomizations', cur, G);
                this._sendSettings(cur);
                break;
            }

            case 'resetColors': {
                const themeColors = await this._loadThemeColors();
                const cur = { ...cfg.get<Record<string, string>>('workbench.colorCustomizations', {}) };
                for (const key of (msg.keys as string[])) {
                    const color = themeColors[key] ?? MANAGED_COLOR_DEFAULTS[key];
                    if (color) { cur[key] = color; } else { delete cur[key]; }
                }
                await cfg.update('workbench.colorCustomizations', cur, G);
                this._sendSettings(cur);
                break;
            }

            case 'resetAll': {
                const answer = await vscode.window.showWarningMessage(
                    'Reset all color overrides to the current theme\'s defaults?',
                    { modal: true }, 'Reset All'
                );
                if (answer !== 'Reset All') break;
                const themeColors = await this._loadThemeColors();
                const managedKeys = [
                    ...EDITOR_COLORS, ...SIDEBAR_COLORS, ...ACTIVITY_BAR_COLORS,
                    ...STATUS_BAR_COLORS, ...TITLE_BAR_COLORS, ...TAB_COLORS, ...PANEL_COLORS,
                ].map(e => e.key);
                const colorOverrides: Record<string, string> = {};
                for (const key of managedKeys) {
                    const color = themeColors[key] ?? MANAGED_COLOR_DEFAULTS[key];
                    if (color) { colorOverrides[key] = color; }
                }
                await cfg.update('workbench.colorCustomizations', colorOverrides, G);
                await cfg.update('editor.tokenColorCustomizations', {}, G);
                this._sendSettings(colorOverrides, {});
                break;
            }

            case 'resetSyntaxFont': {
                const answer = await vscode.window.showWarningMessage(
                    'Reset all syntax, font and editor overrides to defaults?',
                    { modal: true }, 'Reset'
                );
                if (answer !== 'Reset') break;
                await cfg.update('editor.tokenColorCustomizations', {}, G);
                for (const e of [...FONT_SETTINGS, ...EDITOR_SETTINGS]) {
                    await cfg.update(e.key, undefined, G);
                }
                this._sendSettings(undefined, {}, {});
                break;
            }

            case 'openSettings':
                vscode.commands.executeCommand('workbench.action.openSettingsJson');
                break;

            case 'exportTheme': {
                const payload = {
                    version: 1,
                    colorCustomizations:      cfg.get<Record<string, string>>('workbench.colorCustomizations', {}),
                    tokenColorCustomizations: cfg.get<Record<string, any>>('editor.tokenColorCustomizations', {}),
                    settings: Object.fromEntries(
                        [...FONT_SETTINGS, ...EDITOR_SETTINGS]
                            .map(e => [e.key, cfg.get(e.key)])
                            .filter(([, v]) => v !== undefined)
                    ),
                };
                const saveUri = await vscode.window.showSaveDialog({
                    filters: { 'Theme Config': ['json'] },
                    defaultUri: vscode.Uri.file('my-theme.json'),
                });
                if (saveUri) {
                    await vscode.workspace.fs.writeFile(
                        saveUri,
                        new TextEncoder().encode(JSON.stringify(payload, null, 2))
                    );
                    vscode.window.showInformationMessage('Theme exported successfully.');
                }
                break;
            }

            case 'toggleEnabled': {
                const wasEnabled = this._context.globalState.get<boolean>('themeCustomizerEnabled', true);
                const nowEnabled = !wasEnabled;
                await this._context.globalState.update('themeCustomizerEnabled', nowEnabled);
                if (!nowEnabled) {
                    const savedCc  = cfg.get<Record<string, string>>('workbench.colorCustomizations', {});
                    const savedTcc = cfg.get<Record<string, any>>('editor.tokenColorCustomizations', {});
                    await this._context.globalState.update('themeCustomizerSnapshot', {
                        colorCustomizations: savedCc, tokenColorCustomizations: savedTcc,
                    });
                    await cfg.update('workbench.colorCustomizations', {}, G);
                    await cfg.update('editor.tokenColorCustomizations', {}, G);
                    this._sendSettings({}, {});
                } else {
                    const snap = this._context.globalState.get<any>('themeCustomizerSnapshot', {});
                    if (snap.colorCustomizations)      { await cfg.update('workbench.colorCustomizations', snap.colorCustomizations, G); }
                    if (snap.tokenColorCustomizations) { await cfg.update('editor.tokenColorCustomizations', snap.tokenColorCustomizations, G); }
                    this._sendSettings(snap.colorCustomizations, snap.tokenColorCustomizations);
                }
                break;
            }

            case 'importTheme': {
                const openUris = await vscode.window.showOpenDialog({
                    filters: { 'Theme Config': ['json'] },
                    canSelectMany: false,
                });
                if (!openUris?.length) break;
                let payload: any;
                try {
                    const raw = await vscode.workspace.fs.readFile(openUris[0]);
                    payload = JSON.parse(new TextDecoder().decode(raw));
                } catch {
                    vscode.window.showErrorMessage('Theme Customizer: could not read or parse the file.');
                    break;
                }
                if (payload.colorCustomizations && typeof payload.colorCustomizations === 'object') {
                    await cfg.update('workbench.colorCustomizations', payload.colorCustomizations, G);
                }
                if (payload.tokenColorCustomizations && typeof payload.tokenColorCustomizations === 'object') {
                    await cfg.update('editor.tokenColorCustomizations', payload.tokenColorCustomizations, G);
                }
                if (payload.settings && typeof payload.settings === 'object') {
                    for (const [key, val] of Object.entries(payload.settings)) {
                        await cfg.update(key, val, G);
                    }
                }
                this._sendSettings(
                    typeof payload.colorCustomizations === 'object' ? payload.colorCustomizations as Record<string, string> : undefined,
                    typeof payload.tokenColorCustomizations === 'object' ? payload.tokenColorCustomizations as Record<string, any> : undefined
                );
                vscode.window.showInformationMessage('Theme imported successfully.');
                break;
            }
        }
    }

    private _buildHtml(): string {
        const smartPanel = `
<div class="smart-control-row">
  <div class="smart-control-info">
    <span class="smart-control-title">Smart Background</span>
    <span class="smart-control-desc">Derives all window backgrounds (editor, sidebar, activity bar, tabs, title bar, panel, terminal) proportionally from a single base color.</span>
  </div>
  <div class="color-input-wrap">
    <input type="checkbox" class="enable-check" id="smart-bg-check" title="Apply / clear all background settings">
    <input type="color" id="smart-bg-picker" value="#1e1e1e" title="Base editor background">
    <input type="text" class="hex-input" id="smart-bg-hex" value="#1e1e1e" maxlength="7">
    <button class="color-reset-btn" id="smart-bg-reset" title="Clear all background overrides">↺</button>
  </div>
</div>
<div class="smart-control-row">
  <div class="smart-control-info">
    <span class="smart-control-title">Smart Foreground</span>
    <span class="smart-control-desc">Derives all window foregrounds (editor, cursor, line numbers, sidebar, activity bar, status bar, title bar, tabs, terminal) proportionally from a single base color.</span>
  </div>
  <div class="color-input-wrap">
    <input type="checkbox" class="enable-check" id="smart-fg-check" title="Apply / clear all foreground settings">
    <input type="color" id="smart-fg-picker" value="#d4d4d4" title="Base editor foreground">
    <input type="text" class="hex-input" id="smart-fg-hex" value="#d4d4d4" maxlength="7">
    <button class="color-reset-btn" id="smart-fg-reset" title="Clear all foreground overrides">↺</button>
  </div>
</div>
<div class="smart-control-row">
  <div class="smart-control-info">
    <span class="smart-control-title">Smart Highlights</span>
    <span class="smart-control-desc">Derives the accent color, badge, active tab border, selection, find match, word highlight and line highlight from a single base accent color.</span>
  </div>
  <div class="color-input-wrap">
    <input type="checkbox" class="enable-check" id="smart-hl-check" title="Apply / clear all highlight settings">
    <input type="color" id="smart-hl-picker" value="#007acc" title="Base accent / highlight color">
    <input type="text" class="hex-input" id="smart-hl-hex" value="#007acc" maxlength="7">
    <button class="color-reset-btn" id="smart-hl-reset" title="Clear all highlight overrides">↺</button>
  </div>
</div>`;

        const editorSection   = collapsibleSection('Editor', EDITOR_COLORS.map(e => colorRow(e)).join(''));
        const sidebarSection  = collapsibleSection('Sidebar', SIDEBAR_COLORS.map(e => colorRow(e)).join(''));
        const activitySection = collapsibleSection('Activity Bar', ACTIVITY_BAR_COLORS.map(e => colorRow(e)).join(''));
        const statusSection   = collapsibleSection('Status Bar', STATUS_BAR_COLORS.map(e => colorRow(e)).join(''));
        const titleSection    = collapsibleSection('Title Bar', TITLE_BAR_COLORS.map(e => colorRow(e)).join(''));
        const tabSection      = collapsibleSection('Tabs', TAB_COLORS.map(e => colorRow(e)).join(''));
        const panelSection    = collapsibleSection('Panel &amp; Terminal', PANEL_COLORS.map(e => colorRow(e)).join(''));
        const syntaxSection   = collapsibleSection('Token Colors', SYNTAX_TOKENS.map(e => colorRow(e, true)).join(''));
        const fontSection     = collapsibleSection('Font', FONT_SETTINGS.map(settingRow).join(''));
        const editorSetSection = collapsibleSection('Editor Behavior', EDITOR_SETTINGS.map(settingRow).join(''));

        return /* html */`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
<title>Theme Customizer</title>
<style>
*,*::before,*::after{box-sizing:border-box}
body{margin:0;padding:0;background:var(--vscode-editor-background);color:var(--vscode-foreground);font-family:var(--vscode-font-family);font-size:var(--vscode-font-size);display:flex;flex-direction:column;height:100vh;overflow:hidden}

/* ── Header & Tabs ── */
header{padding:16px 20px 0;border-bottom:1px solid var(--vscode-panel-border,#454545);flex-shrink:0}
.header-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
h1{margin:0;font-size:16px;font-weight:600;letter-spacing:.02em}
.global-toggle-wrap{display:inline-flex;align-items:center;gap:6px;cursor:pointer}
.global-toggle-wrap .toggle-track{width:36px;height:18px}
.global-toggle-label{font-size:12px;color:var(--vscode-descriptionForeground);min-width:18px}
.tabs{display:flex;gap:2px}
.tab-btn{background:transparent;border:none;border-bottom:2px solid transparent;color:var(--vscode-foreground);cursor:pointer;font-family:var(--vscode-font-family);font-size:var(--vscode-font-size);opacity:.6;padding:7px 14px;transition:opacity .1s}
.tab-btn:hover{opacity:.9}
.tab-btn.active{opacity:1;border-bottom-color:var(--vscode-focusBorder,#007fd4)}

/* ── Scrollable content ── */
.content{flex:1;overflow-y:auto;padding:20px}
.content.disabled{pointer-events:none;opacity:.35}
.tab-panel{display:none}.tab-panel.active{display:block}

/* ── Section ── */
.section{margin-bottom:24px}
.section-title{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--vscode-descriptionForeground);margin-bottom:6px}

/* ── Color rows ── */
.color-row{display:flex;align-items:center;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--vscode-panel-border,#3a3a3a)}
.color-row:last-child{border-bottom:none}
.color-meta{display:flex;flex-direction:column;gap:1px;flex:1;min-width:0;margin-right:12px}
.color-label{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.color-key{font-size:10px;font-family:var(--vscode-editor-font-family,monospace);color:var(--vscode-descriptionForeground);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.color-input-wrap{display:flex;align-items:center;gap:6px;flex-shrink:0}

input[type="checkbox"].enable-check{width:14px;height:14px;cursor:pointer;accent-color:var(--vscode-focusBorder,#007fd4);flex-shrink:0}
input[type="color"]{width:34px;height:26px;border:1px solid var(--vscode-input-border,#555);border-radius:3px;background:none;cursor:pointer;padding:2px}
input[type="color"]:disabled{opacity:.35;cursor:not-allowed}
.hex-input{width:72px;background:var(--vscode-input-background);border:1px solid var(--vscode-input-border,#555);color:var(--vscode-input-foreground);font-family:var(--vscode-editor-font-family,monospace);font-size:11px;padding:3px 5px;border-radius:2px;outline:none}
.hex-input:focus{border-color:var(--vscode-focusBorder,#007fd4)}
.hex-input:disabled{opacity:.35}
.color-reset-btn{background:transparent;border:none;color:var(--vscode-descriptionForeground);cursor:pointer;font-size:13px;padding:2px 3px;border-radius:2px;opacity:.45;flex-shrink:0;line-height:1}
.color-reset-btn:hover{opacity:1;background:var(--vscode-toolbar-hoverBackground,rgba(90,93,94,.31))}

/* ── Setting rows ── */
.setting-row{display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--vscode-panel-border,#3a3a3a)}
.setting-row:last-child{border-bottom:none}
.setting-label{font-size:13px;flex:1;margin-right:16px}
.setting-control{flex-shrink:0;width:176px}
.setting-control input[type="text"],
.setting-control input[type="number"],
.setting-control select{width:100%;background:var(--vscode-input-background);border:1px solid var(--vscode-input-border,#555);color:var(--vscode-input-foreground);font-family:var(--vscode-font-family);font-size:var(--vscode-font-size);padding:4px 7px;border-radius:2px;outline:none}
.setting-control input:focus,.setting-control select:focus{border-color:var(--vscode-focusBorder,#007fd4)}
.setting-control input:disabled,.setting-control select:disabled{opacity:.35;cursor:not-allowed}
.toggle input:disabled+.toggle-track{opacity:.35;cursor:not-allowed}

/* Toggle switch */
.toggle{position:relative;display:inline-flex;align-items:center;cursor:pointer}
.toggle input[type="checkbox"]{opacity:0;width:0;height:0;position:absolute}
.toggle-track{width:36px;height:18px;background:var(--vscode-input-background);border:1px solid var(--vscode-input-border,#555);border-radius:10px;transition:background .15s;flex-shrink:0;position:relative}
.toggle-track::after{content:'';position:absolute;top:2px;left:2px;width:12px;height:12px;border-radius:50%;background:var(--vscode-descriptionForeground);transition:transform .15s}
.toggle input:checked + .toggle-track{background:var(--vscode-focusBorder,#007fd4);border-color:var(--vscode-focusBorder,#007fd4)}
.toggle input:checked + .toggle-track::after{transform:translateX(18px);background:#fff}

/* ── Smart tab ── */
.smart-control-row{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--vscode-panel-border,#3a3a3a)}
.smart-control-row:last-child{border-bottom:none}
.smart-control-info{display:flex;flex-direction:column;gap:4px;flex:1;margin-right:20px}
.smart-control-title{font-size:13px;font-weight:600}
.smart-control-desc{font-size:11px;color:var(--vscode-descriptionForeground);line-height:1.4}

/* ── Collapsible sections (Advanced tab) ── */
details.section>summary.section-title{cursor:pointer;list-style:none;user-select:none;display:flex;align-items:center;gap:5px;margin-bottom:0;padding-bottom:6px}
details.section>summary.section-title::-webkit-details-marker{display:none}
details.section>summary.section-title::before{content:'▶';font-size:7px;opacity:.5;transition:transform .15s;flex-shrink:0}
details[open].section>summary.section-title::before{transform:rotate(90deg)}
details.section>summary.section-title+*{margin-top:2px}

/* ── Footer ── */
footer{flex-shrink:0;display:flex;gap:8px;justify-content:flex-end;padding:12px 20px;border-top:1px solid var(--vscode-panel-border,#454545)}
button.btn{border:none;border-radius:2px;cursor:pointer;font-family:var(--vscode-font-family);font-size:var(--vscode-font-size);padding:5px 14px}
button.btn-primary{background:var(--vscode-button-background);color:var(--vscode-button-foreground)}
button.btn-primary:hover{background:var(--vscode-button-hoverBackground)}
button.btn-secondary{background:var(--vscode-button-secondaryBackground);color:var(--vscode-button-secondaryForeground)}
button.btn-secondary:hover{background:var(--vscode-button-secondaryHoverBackground)}
</style>
</head>
<body>

<header>
  <div class="header-top">
    <h1>Theme Customizer</h1>
    <label class="global-toggle-wrap toggle" title="Enable / disable all color customizations">
      <input type="checkbox" id="global-toggle" checked>
      <span class="toggle-track"></span>
      <span class="global-toggle-label" id="global-toggle-label">On</span>
    </label>
  </div>
  <div class="tabs">
    <button class="tab-btn active" data-tab="smart">Smart</button>
    <button class="tab-btn" data-tab="advanced">Advanced</button>
    <button class="tab-btn" data-tab="syntaxfont">Syntax, Font &amp; Editor</button>
  </div>
</header>

<div class="content">
  <div class="tab-panel active" id="panel-smart">${smartPanel}</div>
  <div class="tab-panel" id="panel-advanced">${editorSection}${sidebarSection}${activitySection}${statusSection}${titleSection}${tabSection}${panelSection}</div>
  <div class="tab-panel" id="panel-syntaxfont">${syntaxSection}${fontSection}${editorSetSection}</div>
</div>

<footer>
  <button class="btn btn-secondary" id="btn-import">Import Theme</button>
  <button class="btn btn-secondary" id="btn-export">Export Theme</button>
  <button class="btn btn-secondary" id="btn-settings">Open settings.json</button>
  <button class="btn btn-secondary" id="btn-reset">Reset Colors</button>
  <button class="btn btn-secondary" id="btn-reset-syntax">Reset Syntax &amp; Font</button>
</footer>

<script>
(function() {
const vscode = acquireVsCodeApi();

// Global on/off toggle
const globalToggle = document.getElementById('global-toggle');
const globalToggleLabel = document.getElementById('global-toggle-label');
const contentEl = document.querySelector('.content');
globalToggle.addEventListener('change', () => {
  vscode.postMessage({ command: 'toggleEnabled' });
});

// ── Smart Background ──
function hexToHsl(hex) {
  const r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h, s, l = (max+min)/2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6;
    }
  }
  return [h * 360, s * 100, l * 100];
}
function hue2rgb(p, q, t) {
  if (t < 0) t += 1; if (t > 1) t -= 1;
  if (t < 1/6) return p + (q - p) * 6 * t;
  if (t < 1/2) return q;
  if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
  return p;
}
function hslToHex(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1/3);
  }
  return '#' + [r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
}

// Lightness deltas derived from VS Code Dark+ defaults (editor.background = #1e1e1e, L ≈ 11.76%)
const SMART_BG_TARGETS = [
  { key: 'editor.background',                delta: 0     },
  { key: 'editorGutter.background',           delta: 0     },
  { key: 'panel.background',                  delta: 0     },
  { key: 'terminal.background',               delta: 0     },
  { key: 'tab.activeBackground',              delta: 0     },
  { key: 'sideBar.background',                delta: 2.95  },
  { key: 'editorGroupHeader.tabsBackground',  delta: 5.88  },
  { key: 'tab.inactiveBackground',            delta: 5.88  },
  { key: 'activityBar.background',            delta: 8.24  },
  { key: 'titleBar.activeBackground',         delta: 11.76 },
  { key: 'titleBar.inactiveBackground',       delta: 11.76 },
];

function applySmartBg(hex) {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
  const [h, s, l] = hexToHsl(hex);
  const updates = {};
  SMART_BG_TARGETS.forEach(({ key, delta }) => {
    updates[key] = hslToHex(h, s, Math.min(100, Math.max(0, l + delta)));
  });
  // Update DOM first, then send one atomic write to the extension
  Object.entries(updates).forEach(([key, newHex]) => {
    const picker = document.querySelector('input[type="color"][data-color-key="' + key + '"]');
    const cb     = document.querySelector('.enable-check[data-color-key="' + key + '"]');
    const hexEl  = document.querySelector('.hex-input[data-color-key="' + key + '"]');
    if (picker) {
      picker.value = newHex; picker.disabled = false;
      if (cb)    { cb.checked = true; }
      if (hexEl) { hexEl.value = newHex; hexEl.disabled = false; }
    }
  });
  vscode.postMessage({ command: 'updateColors', updates });
}

const smartPicker = document.getElementById('smart-bg-picker');
const smartHex    = document.getElementById('smart-bg-hex');
smartPicker.addEventListener('input', () => {
  smartHex.value = smartPicker.value;
  applySmartBg(smartPicker.value);
});
smartHex.addEventListener('change', () => {
  const v = smartHex.value.startsWith('#') ? smartHex.value : '#' + smartHex.value;
  if (/^#[0-9a-fA-F]{6}$/.test(v)) {
    smartPicker.value = v; smartHex.value = v;
    applySmartBg(v);
  } else { smartHex.value = smartPicker.value; }
});

// Lightness deltas from editor.foreground default #d4d4d4 (L ≈ 83.14%)
const SMART_FG_TARGETS = [
  { key: 'editor.foreground',                  delta:   0     },
  { key: 'editorLineNumber.activeForeground',  delta:  -5.49  },
  { key: 'sideBar.foreground',                 delta:  -3.14  },
  { key: 'titleBar.activeForeground',          delta:  -3.14  },
  { key: 'terminal.foreground',                delta:  -3.14  },
  { key: 'sideBarTitle.foreground',            delta:  -9.81  },
  { key: 'editorCursor.foreground',            delta: -14.90  },
  { key: 'editorLineNumber.foreground',        delta: -30.98  },
  { key: 'activityBar.foreground',             delta: +16.86  },
  { key: 'activityBarBadge.foreground',        delta: +16.86  },
  { key: 'statusBar.foreground',               delta: +16.86  },
  { key: 'tab.activeForeground',               delta: +16.86  },
  { key: 'terminalCursor.foreground',          delta: +16.86  },
];

function applySmartFg(hex) {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
  const [h, s, l] = hexToHsl(hex);
  const updates = {};
  SMART_FG_TARGETS.forEach(({ key, delta }) => {
    updates[key] = hslToHex(h, s, Math.min(100, Math.max(0, l + delta)));
  });
  Object.entries(updates).forEach(([key, newHex]) => {
    const picker = document.querySelector('input[type="color"][data-color-key="' + key + '"]');
    const cb     = document.querySelector('.enable-check[data-color-key="' + key + '"]');
    const hexEl  = document.querySelector('.hex-input[data-color-key="' + key + '"]');
    if (picker) {
      picker.value = newHex; picker.disabled = false;
      if (cb)    { cb.checked = true; }
      if (hexEl) { hexEl.value = newHex; hexEl.disabled = false; }
    }
  });
  vscode.postMessage({ command: 'updateColors', updates });
}

const smartFgPicker = document.getElementById('smart-fg-picker');
const smartFgHex    = document.getElementById('smart-fg-hex');
smartFgPicker.addEventListener('input', () => {
  smartFgHex.value = smartFgPicker.value;
  applySmartFg(smartFgPicker.value);
});
smartFgHex.addEventListener('change', () => {
  const v = smartFgHex.value.startsWith('#') ? smartFgHex.value : '#' + smartFgHex.value;
  if (/^#[0-9a-fA-F]{6}$/.test(v)) {
    smartFgPicker.value = v; smartFgHex.value = v;
    applySmartFg(v);
  } else { smartFgHex.value = smartFgPicker.value; }
});

// Saturation ratio + lightness delta from accent base #007acc (H=207, S=100%, L=40%)
const SMART_HL_TARGETS = [
  { key: 'statusBar.background',                sRatio: 1.00, lDelta:   0  },
  { key: 'activityBarBadge.background',         sRatio: 1.00, lDelta:   0  },
  { key: 'tab.activeBorderTop',                 sRatio: 1.00, lDelta:   0  },
  { key: 'editor.selectionBackground',          sRatio: 0.52, lDelta:  -9  },
  { key: 'editor.findMatchBackground',          sRatio: 0.13, lDelta:  -3  },
  { key: 'editor.wordHighlightBackground',      sRatio: 0.00, lDelta:  -6  },
  { key: 'editor.lineHighlightBackground',      sRatio: 0.05, lDelta: -23  },
];

function applySmartHl(hex) {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
  const [h, s, l] = hexToHsl(hex);
  const updates = {};
  SMART_HL_TARGETS.forEach(({ key, sRatio, lDelta }) => {
    updates[key] = hslToHex(h, Math.min(100, Math.max(0, s * sRatio)), Math.min(100, Math.max(0, l + lDelta)));
  });
  Object.entries(updates).forEach(([key, newHex]) => {
    const picker = document.querySelector('input[type="color"][data-color-key="' + key + '"]');
    const cb     = document.querySelector('.enable-check[data-color-key="' + key + '"]');
    const hexEl  = document.querySelector('.hex-input[data-color-key="' + key + '"]');
    if (picker) {
      picker.value = newHex; picker.disabled = false;
      if (cb)    { cb.checked = true; }
      if (hexEl) { hexEl.value = newHex; hexEl.disabled = false; }
    }
  });
  vscode.postMessage({ command: 'updateColors', updates });
}

const smartHlPicker = document.getElementById('smart-hl-picker');
const smartHlHex    = document.getElementById('smart-hl-hex');
smartHlPicker.addEventListener('input', () => {
  smartHlHex.value = smartHlPicker.value;
  applySmartHl(smartHlPicker.value);
});
smartHlHex.addEventListener('change', () => {
  const v = smartHlHex.value.startsWith('#') ? smartHlHex.value : '#' + smartHlHex.value;
  if (/^#[0-9a-fA-F]{6}$/.test(v)) {
    smartHlPicker.value = v; smartHlHex.value = v;
    applySmartHl(v);
  } else { smartHlHex.value = smartHlPicker.value; }
});

// ── Smart checkboxes (apply / clear all related settings) ──
function clearSmartGroup(targets) {
  const keys = targets.map(t => t.key);
  keys.forEach(key => {
    const picker = document.querySelector('input[type="color"][data-color-key="' + key + '"]');
    const cb     = document.querySelector('.enable-check[data-color-key="' + key + '"]');
    const hexEl  = document.querySelector('.hex-input[data-color-key="' + key + '"]');
    if (picker) { picker.disabled = true; if (cb) cb.checked = false; if (hexEl) hexEl.disabled = true; }
  });
  vscode.postMessage({ command: 'clearColors', keys });
}

document.getElementById('smart-bg-check').addEventListener('change', function() {
  if (this.checked) applySmartBg(smartPicker.value); else clearSmartGroup(SMART_BG_TARGETS);
});
document.getElementById('smart-fg-check').addEventListener('change', function() {
  if (this.checked) applySmartFg(smartFgPicker.value); else clearSmartGroup(SMART_FG_TARGETS);
});
document.getElementById('smart-hl-check').addEventListener('change', function() {
  if (this.checked) applySmartHl(smartHlPicker.value); else clearSmartGroup(SMART_HL_TARGETS);
});

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
  });
});

// ── Workbench color rows ──
function bindColorRow(attr, updateCmd, clearCmd) {
  document.querySelectorAll('.enable-check[' + attr + ']').forEach(cb => {
    const key = cb.getAttribute(attr);
    const picker = document.querySelector('input[type="color"][' + attr + '="' + key + '"]');
    const hex    = document.querySelector('.hex-input[' + attr + '="' + key + '"]');

    cb.addEventListener('change', () => {
      picker.disabled = !cb.checked;
      hex.disabled    = !cb.checked;
      if (cb.checked) vscode.postMessage({ command: updateCmd, key, value: picker.value });
      else            vscode.postMessage({ command: clearCmd,  key });
    });

    picker.addEventListener('input', () => {
      hex.value = picker.value;
      vscode.postMessage({ command: updateCmd, key, value: picker.value });
    });

    hex.addEventListener('change', () => {
      const v = hex.value.startsWith('#') ? hex.value : '#' + hex.value;
      if (/^#[0-9a-fA-F]{6}$/.test(v)) {
        picker.value = v; hex.value = v;
        vscode.postMessage({ command: updateCmd, key, value: v });
      } else { hex.value = picker.value; }
    });
  });
}

bindColorRow('data-color-key',  'updateColor',      'clearColor');
bindColorRow('data-token-key',  'updateTokenColor',  'clearTokenColor');

// ── Font & editor settings ──
document.querySelectorAll('[data-setting-key]').forEach(el => {
  el.addEventListener('change', () => {
    const key = el.getAttribute('data-setting-key');
    const value = el.type === 'checkbox' ? el.checked
                : el.type === 'number'   ? (el.value === '' ? undefined : Number(el.value))
                : el.value;
    if (value !== undefined) vscode.postMessage({ command: 'updateSetting', key, value });
  });
});

// ── Setting enable checkboxes ──
document.querySelectorAll('.enable-check[data-setting-enable]').forEach(cb => {
  const key = cb.getAttribute('data-setting-enable');
  const controls = () => document.querySelectorAll('[data-setting-key="' + key + '"]');
  cb.addEventListener('change', () => {
    controls().forEach(el => { el.disabled = !cb.checked; });
    if (cb.checked) {
      const el = document.querySelector('[data-setting-key="' + key + '"]');
      if (el) {
        const value = el.type === 'checkbox' ? el.checked
                    : el.type === 'number'   ? (el.value === '' ? undefined : Number(el.value))
                    : el.value;
        if (value !== undefined) vscode.postMessage({ command: 'updateSetting', key, value });
      }
    } else {
      vscode.postMessage({ command: 'clearSetting', key });
    }
  });
});

// ── Footer buttons ──
document.getElementById('btn-export').addEventListener('click', () => {
  vscode.postMessage({ command: 'exportTheme' });
});
document.getElementById('btn-import').addEventListener('click', () => {
  vscode.postMessage({ command: 'importTheme' });
});
document.getElementById('btn-reset').addEventListener('click', () => {
  vscode.postMessage({ command: 'resetAll' });
});
document.getElementById('btn-reset-syntax').addEventListener('click', () => {
  vscode.postMessage({ command: 'resetSyntaxFont' });
});

// ── Individual color row reset buttons (delegated) ──
document.addEventListener('click', e => {
  const btn = e.target.closest('.color-reset-btn[data-key]');
  if (!btn) return;
  const { attr, key, cmd } = btn.dataset;
  if (cmd === 'clearTokenColor') {
    // Extension won't send loadSettings back, so update DOM immediately
    const picker = document.querySelector('input[type="color"][' + attr + '="' + key + '"]');
    const cb     = document.querySelector('.enable-check[' + attr + '="' + key + '"]');
    const hexEl  = document.querySelector('.hex-input[' + attr + '="' + key + '"]');
    if (picker) { picker.disabled = true; if (cb) cb.checked = false; if (hexEl) hexEl.disabled = true; }
  }
  // For resetColor, extension calls _sendSettings() and loadSettings syncs the DOM
  vscode.postMessage({ command: cmd, key });
});

// ── Setting row reset buttons (delegated) ──
document.addEventListener('click', e => {
  const btn = e.target.closest('.color-reset-btn[data-setting-reset]');
  if (!btn) return;
  const key = btn.dataset.settingReset;
  const cb = document.querySelector('.enable-check[data-setting-enable="' + key + '"]');
  if (cb) { cb.checked = false; }
  document.querySelectorAll('[data-setting-key="' + key + '"]').forEach(el => { el.disabled = true; });
  vscode.postMessage({ command: 'clearSetting', key });
});

// ── Smart reset buttons (restore theme colors for the group) ──
document.getElementById('smart-bg-reset').addEventListener('click', () => {
  vscode.postMessage({ command: 'resetColors', keys: SMART_BG_TARGETS.map(t => t.key) });
});
document.getElementById('smart-fg-reset').addEventListener('click', () => {
  vscode.postMessage({ command: 'resetColors', keys: SMART_FG_TARGETS.map(t => t.key) });
});
document.getElementById('smart-hl-reset').addEventListener('click', () => {
  vscode.postMessage({ command: 'resetColors', keys: SMART_HL_TARGETS.map(t => t.key) });
});
document.getElementById('btn-settings').addEventListener('click', () => {
  vscode.postMessage({ command: 'openSettings' });
});

// ── Receive settings from extension ──
window.addEventListener('message', ev => {
  const msg = ev.data;
  if (msg.command !== 'loadSettings') return;
  const s = msg.settings;
  const enabled = s.enabled !== false;
  globalToggle.checked = enabled;
  globalToggleLabel.textContent = enabled ? 'On' : 'Off';
  contentEl.classList.toggle('disabled', !enabled);
  const cc  = s.colorCustomizations || {};
  const tcc = s.tokenColorCustomizations || {};

  // Sync smart pickers to current editor colors (if set)
  const editorBg = cc['editor.background'];
  if (editorBg && /^#[0-9a-fA-F]{6}$/.test(editorBg)) {
    smartPicker.value = editorBg; smartHex.value = editorBg;
  }
  const editorFg = cc['editor.foreground'];
  if (editorFg && /^#[0-9a-fA-F]{6}$/.test(editorFg)) {
    smartFgPicker.value = editorFg; smartFgHex.value = editorFg;
  }
  const accentColor = cc['statusBar.background'];
  if (accentColor && /^#[0-9a-fA-F]{6}$/.test(accentColor)) {
    smartHlPicker.value = accentColor; smartHlHex.value = accentColor;
  }

  // Sync smart checkboxes: checked when every key in the group is active in settings
  document.getElementById('smart-bg-check').checked = SMART_BG_TARGETS.every(({ key }) => !!cc[key]);
  document.getElementById('smart-fg-check').checked = SMART_FG_TARGETS.every(({ key }) => !!cc[key]);
  document.getElementById('smart-hl-check').checked = SMART_HL_TARGETS.every(({ key }) => !!cc[key]);

  // color pickers
  document.querySelectorAll('input[type="color"][data-color-key]').forEach(picker => {
    const key = picker.getAttribute('data-color-key');
    const cb  = document.querySelector('.enable-check[data-color-key="' + key + '"]');
    const hex = document.querySelector('.hex-input[data-color-key="' + key + '"]');
    const val = cc[key];
    const active = val && /^#[0-9a-fA-F]{6}/.test(val);
    cb.checked      = !!active;
    picker.disabled = !active;
    hex.disabled    = !active;
    if (active) { picker.value = val.slice(0, 7); hex.value = val.slice(0, 7); }
  });

  document.querySelectorAll('input[type="color"][data-token-key]').forEach(picker => {
    const key = picker.getAttribute('data-token-key');
    const cb  = document.querySelector('.enable-check[data-token-key="' + key + '"]');
    const hex = document.querySelector('.hex-input[data-token-key="' + key + '"]');
    const val = tcc[key];
    const active = val && /^#[0-9a-fA-F]{6}/.test(val);
    cb.checked      = !!active;
    picker.disabled = !active;
    hex.disabled    = !active;
    if (active) { picker.value = val.slice(0, 7); hex.value = val.slice(0, 7); }
  });

  // setting enable checkboxes
  const overrides = s.settingOverrides || {};
  document.querySelectorAll('.enable-check[data-setting-enable]').forEach(cb => {
    const key = cb.getAttribute('data-setting-enable');
    const active = key in overrides;
    cb.checked = active;
    document.querySelectorAll('[data-setting-key="' + key + '"]').forEach(el => { el.disabled = !active; });
  });

  // font & editor settings
  const map = {
    'editor.fontFamily':   s.fontFamily,
    'editor.fontSize':     s.fontSize,
    'editor.lineHeight':   s.lineHeight,
    'editor.fontLigatures': s.fontLigatures,
    'editor.fontWeight':   s.fontWeight,
    'editor.tabSize':      s.tabSize,
    'editor.wordWrap':     s.wordWrap,
    'editor.cursorStyle':  s.cursorStyle,
    'editor.cursorBlinking': s.cursorBlinking,
    'editor.lineNumbers':  s.lineNumbers,
    'editor.renderWhitespace': s.renderWhitespace,
    'editor.minimap.enabled': s.minimap,
    'editor.smoothScrolling': s.smoothScrolling,
    'editor.formatOnSave': s.formatOnSave,
    'editor.bracketPairColorization.enabled': s.bracketPairColorization,
  };
  Object.entries(map).forEach(([key, val]) => {
    const el = document.querySelector('[data-setting-key="' + key + '"]');
    if (!el || val === undefined) return;
    if (el.type === 'checkbox') el.checked = val;
    else el.value = val;
  });
});

vscode.postMessage({ command: 'ready' });
})();
</script>
</body>
</html>`;
    }

    private async _loadThemeColors(): Promise<Record<string, string>> {
        const themeName = vscode.workspace.getConfiguration('workbench').get<string>('colorTheme', '');
        for (const ext of vscode.extensions.all) {
            const themes: any[] = ext.packageJSON?.contributes?.themes ?? [];
            const entry = themes.find((t: any) => t.label === themeName || t.id === themeName);
            if (!entry) { continue; }
            try {
                const uri = vscode.Uri.joinPath(ext.extensionUri, entry.path);
                const raw = await vscode.workspace.fs.readFile(uri);
                let text = new TextDecoder().decode(raw);
                let json: any;
                try { json = JSON.parse(text); }
                catch {
                    text = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
                    json = JSON.parse(text);
                }
                return json.colors ?? {};
            } catch { continue; }
        }
        return {};
    }

    public dispose() {
        ThemeCustomizerPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) { this._disposables.pop()!.dispose(); }
    }
}
