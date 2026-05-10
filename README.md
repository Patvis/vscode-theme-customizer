# Theme Customizer — VS Code Extension

## What this is

A VS Code extension that lets users visually customize their editor theme through a webview panel, writing all changes directly to `settings.json` in real time. No manual JSON editing required.

## How to build and run

```powershell
cd C:\repos\theme-customizer
npm install
npm run compile   # or: npm run watch (incremental)
```

Then open the folder in VS Code and press **F5** to launch the Extension Development Host.

**Entry point command:** `Theme: Open Theme Customizer` (Command Palette)
**Keybinding:** `Ctrl+Shift+T` (when terminal is not focused)

## File structure

```
theme-customizer/
├── src/
│   ├── extension.ts           # Activation entry point, registers the command
│   └── ThemeCustomizerPanel.ts # All webview logic, HTML/CSS/JS, settings bridge
├── package.json               # Extension manifest — commands, keybindings, engines
├── tsconfig.json              # Compiles src/ → out/
└── .vscodeignore
```

Compiled output goes to `out/` (not committed). `package.json` points `main` to `./out/extension`.

## Architecture

The extension uses a single `vscode.WebviewPanel`. All HTML, CSS, and JavaScript for the UI is generated as a template string inside `ThemeCustomizerPanel._buildHtml()` — no separate media files.

**Data flow:**
- On panel open → extension reads current VS Code config and `postMessage`s it to the webview (`loadSettings`)
- User changes a value in the webview → webview `postMessage`s back to extension
- Extension calls `vscode.workspace.getConfiguration().update(...)` with `ConfigurationTarget.Global`
- Changes take effect in VS Code immediately (no save/apply step needed)

**Message commands (webview → extension):**

| Command | Effect |
|---|---|
| `ready` | Extension sends current settings to webview |
| `updateColor` | Merges key into `workbench.colorCustomizations` |
| `clearColor` | Removes key from `workbench.colorCustomizations` |
| `updateTokenColor` | Merges key into `editor.tokenColorCustomizations` |
| `clearTokenColor` | Removes key from `editor.tokenColorCustomizations` |
| `updateSetting` | Writes any `editor.*` setting directly |
| `resetAll` | Clears both color customization objects |
| `openSettings` | Runs `workbench.action.openSettingsJson` |
| `exportTheme` | Saves current theme config to a `.json` file via save dialog |
| `importTheme` | Loads a `.json` theme config file and applies it via open dialog |

## Import / Export

The toolbar at the top of the panel exposes two buttons — **Import Theme** and **Export Theme** — that let you move your full theme configuration in and out as a single JSON file.

### Export

Click **Export Theme** → a save dialog opens → choose a filename (default: `my-theme.json`). The file contains:

```jsonc
{
  "version": 1,
  "colorCustomizations": { /* workbench.colorCustomizations */ },
  "tokenColorCustomizations": { /* editor.tokenColorCustomizations */ },
  "settings": { /* all font & editor settings you have set */ }
}
```

### Import

Click **Import Theme** → an open dialog appears → select a `.json` file previously exported by this extension. The extension applies each section in order:

1. Writes `colorCustomizations` to `workbench.colorCustomizations` (global)
2. Writes `tokenColorCustomizations` to `editor.tokenColorCustomizations` (global)
3. Iterates every key in `settings` and writes it globally via `getConfiguration().update()`
4. Refreshes the webview panel to reflect the newly applied values

If the file cannot be read or parsed, an error message is shown and no changes are made. Unknown or missing keys in the file are silently ignored — only the sections present in the file are applied.

## What each tab customizes

- **Editor** — 14 tokens: background, foreground, cursor, selection, line highlight, brackets, gutter, line numbers, indent guides
- **Workbench** — 30+ tokens across sidebar, activity bar, status bar, title bar, tabs, panel, terminal
- **Syntax** — 7 simple `editor.tokenColorCustomizations` keys: comments, strings, keywords, numbers, types, functions, variables
- **Font & Editor** — font family/size/weight/ligatures/line height, word wrap, cursor style/blinking, line numbers, minimap, whitespace rendering, format on save, bracket pair colorization, smooth scrolling

## Color row UX

Each color token has a **checkbox + color picker + hex text input**:
- Unchecked → picker disabled, token not present in `settings.json`
- Checked → picker enabled, token written to `settings.json` immediately on change
- Hex input syncs with the color picker bidirectionally

## What does not exist yet

- No packaging/VSIX build step configured beyond `vscode:prepublish`
- The extension only writes to **global** settings (`ConfigurationTarget.Global`); workspace-level overrides are not supported yet