# Theme Customizer — VS Code Extension

Visually customize your VS Code theme colors, syntax highlighting, and editor settings — no manual JSON editing required. All changes apply instantly and write directly to your `settings.json`.

---

## Features

- **Smart color controls** — set one base color and have all related colors (backgrounds, foregrounds, highlights) derived proportionally
- **Per-token color overrides** — fine-grained control over every major workbench and editor color
- **Syntax highlighting** — customize comment, string, keyword, number, type, function and variable colors
- **Font & editor settings** — font family, size, weight, ligatures, line height, cursor style, minimap, word wrap, and more
- **Enable/disable toggle** — switch all customizations on or off instantly; your settings are saved and restored
- **Import / Export** — save your full theme config to a `.json` file and apply it to any other machine
- **Reset buttons** — restore any individual color or setting group back to the theme's default

---

## Getting Started

Open the Command Palette (`Ctrl+Shift+P`) and run:

```
Theme: Open Theme Customizer
```

Or use the keybinding: `Ctrl+Shift+T` (when the terminal is not focused).

---

## Tabs

### Smart
The fastest way to restyle your editor. Each control derives a full group of colors from a single base color, keeping proportional relationships intact.

| Control | What it controls |
|---|---|
| **Smart Background** | Editor, sidebar, activity bar, tabs, title bar, panel, terminal backgrounds |
| **Smart Foreground** | Editor text, line numbers, cursor, sidebar, status bar, tab, terminal foregrounds |
| **Smart Highlights** | Accent color, badge, active tab border, selection, find match, word & line highlights |

Check the checkbox to apply the group; uncheck to clear it. The `↺` button resets the entire group to the current theme's defaults.

### Advanced
Individual control over every major color token, organized into collapsible sections:

- **Editor** — background, foreground, cursor, selection, line highlight, word highlight, bracket match, find match, gutter, line numbers, indent guides
- **Sidebar** — background, foreground, border, title, section headers
- **Activity Bar** — background, active/inactive icons, badge
- **Status Bar** — background, foreground, debugging and no-folder states
- **Title Bar** — active/inactive background and foreground
- **Tabs** — tab bar background, active/inactive tab colors, active border
- **Panel & Terminal** — panel background/border, terminal background/foreground/cursor/selection

Each row has a checkbox to enable the override, a color picker, a hex input, and a `↺` reset button.

### Syntax, Font & Editor
- **Token Colors** — comments, strings, keywords, numbers, types/classes, functions, variables
- **Font** — family, size, line height, ligatures, weight
- **Editor Behavior** — tab size, word wrap, cursor style/blinking, line numbers, whitespace rendering, minimap, smooth scrolling, format on save, bracket pair colorization

Each setting has an enable checkbox and a `↺` reset button to clear the override.

---

## Color Row Controls

Every color row works the same way:

| Control | Behavior |
|---|---|
| Checkbox (unchecked) | Token not present in `settings.json`; picker disabled |
| Checkbox (checked) | Token written to `settings.json`; picker enabled |
| Color picker | Live preview — updates immediately on change |
| Hex input | Syncs bidirectionally with the color picker |
| `↺` button | Resets to the active theme's color, or the built-in default if the theme doesn't define it |

---

## Import / Export

Use the **Import Theme** and **Export Theme** buttons in the toolbar to move your full configuration in and out as a single JSON file.

### Export format

```jsonc
{
  "version": 1,
  "colorCustomizations": { /* workbench.colorCustomizations */ },
  "tokenColorCustomizations": { /* editor.tokenColorCustomizations */ },
  "settings": { /* font & editor settings you have overridden */ }
}
```

### Import behavior

1. Applies `colorCustomizations` to `workbench.colorCustomizations` (global)
2. Applies `tokenColorCustomizations` to `editor.tokenColorCustomizations` (global)
3. Writes each key in `settings` globally
4. Refreshes the panel to reflect the imported values

If the file cannot be read or parsed, an error is shown and no changes are made.

---

## Enable / Disable Toggle

The toggle switch in the top-right corner of the panel turns all customizations on or off:

- **Off** — saves a snapshot of your current overrides, then clears `workbench.colorCustomizations` and `editor.tokenColorCustomizations`
- **On** — restores the saved snapshot

---

## Reset Buttons

| Button | What it resets |
|---|---|
| `↺` on a color row | That token only — restored to the theme's color or built-in default |
| `↺` on a smart control | All colors in that smart group |
| **Reset Colors** (footer) | All managed workbench color overrides, prompts for confirmation |
| **Reset Syntax & Font** (footer) | All syntax token colors and font/editor setting overrides, prompts for confirmation |

---

## Commands

| Command | Description |
|---|---|
| `Theme: Open Theme Customizer` | Opens the customizer panel |
| `Theme: Clear Stored State` | Clears the extension's saved toggle state and snapshot from VS Code's internal storage |

---

## Building from Source

```powershell
npm install
npm run compile   # one-time build
npm run watch     # incremental build
```

Press **F5** in VS Code to launch the Extension Development Host.

## File Structure

```
theme-customizer/
├── src/
│   ├── extension.ts            # Activation entry point, registers commands
│   └── ThemeCustomizerPanel.ts # Webview logic, HTML/CSS/JS, settings bridge
├── package.json                # Extension manifest
├── tsconfig.json               # Compiles src/ → out/
└── .vscodeignore
```

All HTML, CSS, and JavaScript for the UI lives in `ThemeCustomizerPanel._buildHtml()` — no separate media files. Changes write directly to global `settings.json` via `vscode.workspace.getConfiguration().update()`.
