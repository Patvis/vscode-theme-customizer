import * as vscode from 'vscode';
import { ThemeCustomizerPanel } from './ThemeCustomizerPanel';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('themeCustomizer.open', () => {
            ThemeCustomizerPanel.createOrShow(context.extensionUri, context);
        }),
        vscode.commands.registerCommand('themeCustomizer.clearState', async () => {
            await context.globalState.update('themeCustomizerEnabled', undefined);
            await context.globalState.update('themeCustomizerSnapshot', undefined);
            vscode.window.showInformationMessage('Theme Customizer: stored state cleared.');
        })
    );
}

export function deactivate() {}
