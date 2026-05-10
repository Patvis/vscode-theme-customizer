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
    return `<div class="color-row">
      <div class="color-meta">
        <span class="color-label">${e.label}</span>
        <span class="color-key">${e.key}</span>
      </div>
      <div class="color-input-wrap">
        <input type="checkbox" class="enable-check" ${attr}="${e.key}" title="Enable customization">
        <input type="color" ${attr}="${e.key}" value="${e.default}" disabled title="${e.key}">
        <input type="text" class="hex-input" ${attr}="${e.key}" value="${e.default}" maxlength="7" disabled>
      </div>
    </div>`;
}

function settingRow(e: SettingEntry): string {
    let control = '';
    if (e.type === 'text') {
        control = `<input type="text" data-setting-key="${e.key}" placeholder="${e.placeholder ?? ''}">`;
    } else if (e.type === 'number') {
        control = `<input type="number" data-setting-key="${e.key}" min="${e.min}" max="${e.max}" step="${e.step ?? 1}">`;
    } else if (e.type === 'select') {
        const opts = (e.options ?? []).map(o => `<option value="${o.value}">${o.label}</option>`).join('');
        control = `<select data-setting-key="${e.key}">${opts}</select>`;
    } else if (e.type === 'checkbox') {
        control = `<label class="toggle"><input type="checkbox" data-setting-key="${e.key}"><span class="toggle-track"></span></label>`;
    }
    return `<div class="setting-row"><span class="setting-label">${e.label}</span><div class="setting-control">${control}</div></div>`;
}

function section(title: string, rows: string): string {
    return `<div class="section"><div class="section-title">${title}</div>${rows}</div>`;
}

export class ThemeCustomizerPanel {
    public static currentPanel: ThemeCustomizerPanel | undefined;
    private static readonly viewType = 'themeCustomizer';

    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri) {
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
        ThemeCustomizerPanel.currentPanel = new ThemeCustomizerPanel(panel);
    }

    private constructor(panel: vscode.WebviewPanel) {
        this._panel = panel;
        this._panel.webview.html = this._buildHtml();
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.onDidReceiveMessage(msg => this._handleMessage(msg), null, this._disposables);
    }

    private _sendSettings() {
        const cfg = vscode.workspace.getConfiguration();
        this._panel.webview.postMessage({
            command: 'loadSettings',
            settings: {
                colorCustomizations:      cfg.get('workbench.colorCustomizations', {}),
                tokenColorCustomizations: cfg.get('editor.tokenColorCustomizations', {}),
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
            case 'clearColor': {
                const cur = { ...cfg.get<Record<string, string>>('workbench.colorCustomizations', {}) };
                delete cur[msg.key];
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

            case 'resetAll':
                await cfg.update('workbench.colorCustomizations', {}, G);
                await cfg.update('editor.tokenColorCustomizations', {}, G);
                this._sendSettings();
                vscode.window.showInformationMessage('Theme Customizer: all color customizations cleared.');
                break;

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
                this._sendSettings();
                vscode.window.showInformationMessage('Theme imported successfully.');
                break;
            }
        }
    }

    private _buildHtml(): string {
        const editorSection   = section('Editor', EDITOR_COLORS.map(e => colorRow(e)).join(''));
        const sidebarSection  = section('Sidebar', SIDEBAR_COLORS.map(e => colorRow(e)).join(''));
        const activitySection = section('Activity Bar', ACTIVITY_BAR_COLORS.map(e => colorRow(e)).join(''));
        const statusSection   = section('Status Bar', STATUS_BAR_COLORS.map(e => colorRow(e)).join(''));
        const titleSection    = section('Title Bar', TITLE_BAR_COLORS.map(e => colorRow(e)).join(''));
        const tabSection      = section('Tabs', TAB_COLORS.map(e => colorRow(e)).join(''));
        const panelSection    = section('Panel & Terminal', PANEL_COLORS.map(e => colorRow(e)).join(''));
        const syntaxSection   = section('Token Colors', SYNTAX_TOKENS.map(e => colorRow(e, true)).join(''));
        const fontSection     = section('Font', FONT_SETTINGS.map(settingRow).join(''));
        const editorSetSection = section('Editor Behavior', EDITOR_SETTINGS.map(settingRow).join(''));

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
h1{margin:0 0 12px;font-size:16px;font-weight:600;letter-spacing:.02em}
.tabs{display:flex;gap:2px}
.tab-btn{background:transparent;border:none;border-bottom:2px solid transparent;color:var(--vscode-foreground);cursor:pointer;font-family:var(--vscode-font-family);font-size:var(--vscode-font-size);opacity:.6;padding:7px 14px;transition:opacity .1s}
.tab-btn:hover{opacity:.9}
.tab-btn.active{opacity:1;border-bottom-color:var(--vscode-focusBorder,#007fd4)}

/* ── Scrollable content ── */
.content{flex:1;overflow-y:auto;padding:20px}
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

/* ── Setting rows ── */
.setting-row{display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--vscode-panel-border,#3a3a3a)}
.setting-row:last-child{border-bottom:none}
.setting-label{font-size:13px;flex:1;margin-right:16px}
.setting-control{flex-shrink:0;width:176px}
.setting-control input[type="text"],
.setting-control input[type="number"],
.setting-control select{width:100%;background:var(--vscode-input-background);border:1px solid var(--vscode-input-border,#555);color:var(--vscode-input-foreground);font-family:var(--vscode-font-family);font-size:var(--vscode-font-size);padding:4px 7px;border-radius:2px;outline:none}
.setting-control input:focus,.setting-control select:focus{border-color:var(--vscode-focusBorder,#007fd4)}

/* Toggle switch */
.toggle{position:relative;display:inline-flex;align-items:center;cursor:pointer}
.toggle input[type="checkbox"]{opacity:0;width:0;height:0;position:absolute}
.toggle-track{width:36px;height:18px;background:var(--vscode-input-background);border:1px solid var(--vscode-input-border,#555);border-radius:10px;transition:background .15s;flex-shrink:0;position:relative}
.toggle-track::after{content:'';position:absolute;top:2px;left:2px;width:12px;height:12px;border-radius:50%;background:var(--vscode-descriptionForeground);transition:transform .15s}
.toggle input:checked + .toggle-track{background:var(--vscode-focusBorder,#007fd4);border-color:var(--vscode-focusBorder,#007fd4)}
.toggle input:checked + .toggle-track::after{transform:translateX(18px);background:#fff}

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
  <h1>Theme Customizer</h1>
  <div class="tabs">
    <button class="tab-btn active" data-tab="editor">Editor</button>
    <button class="tab-btn" data-tab="workbench">Workbench</button>
    <button class="tab-btn" data-tab="syntax">Syntax</button>
    <button class="tab-btn" data-tab="font">Font &amp; Editor</button>
  </div>
</header>

<div class="content">
  <div class="tab-panel active" id="panel-editor">${editorSection}</div>
  <div class="tab-panel" id="panel-workbench">${sidebarSection}${activitySection}${statusSection}${titleSection}${tabSection}${panelSection}</div>
  <div class="tab-panel" id="panel-syntax">${syntaxSection}</div>
  <div class="tab-panel" id="panel-font">${fontSection}${editorSetSection}</div>
</div>

<footer>
  <button class="btn btn-secondary" id="btn-import">Import Theme</button>
  <button class="btn btn-secondary" id="btn-export">Export Theme</button>
  <button class="btn btn-secondary" id="btn-settings">Open settings.json</button>
  <button class="btn btn-secondary" id="btn-reset">Reset Colors</button>
</footer>

<script>
(function() {
const vscode = acquireVsCodeApi();

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

// ── Footer buttons ──
document.getElementById('btn-export').addEventListener('click', () => {
  vscode.postMessage({ command: 'exportTheme' });
});
document.getElementById('btn-import').addEventListener('click', () => {
  vscode.postMessage({ command: 'importTheme' });
});
document.getElementById('btn-reset').addEventListener('click', () => {
  if (confirm('Clear all workbench.colorCustomizations and editor.tokenColorCustomizations?')) {
    vscode.postMessage({ command: 'resetAll' });
  }
});
document.getElementById('btn-settings').addEventListener('click', () => {
  vscode.postMessage({ command: 'openSettings' });
});

// ── Receive settings from extension ──
window.addEventListener('message', ev => {
  const msg = ev.data;
  if (msg.command !== 'loadSettings') return;
  const s = msg.settings;
  const cc  = s.colorCustomizations || {};
  const tcc = s.tokenColorCustomizations || {};

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

    public dispose() {
        ThemeCustomizerPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) { this._disposables.pop()!.dispose(); }
    }
}
