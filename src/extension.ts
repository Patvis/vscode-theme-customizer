import * as vscode from 'vscode';
import { ThemeCustomizerPanel } from './ThemeCustomizerPanel';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('themeCustomizer.open', () => {
            ThemeCustomizerPanel.createOrShow(context.extensionUri);
        })
    );
}

export function deactivate() {}
