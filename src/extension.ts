// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { generateTests } from "./generate-tests";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log("GWT Test formatter extension is now active!");

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "gwt-test-formatter.generateTest",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        return; // No open text editor
      }

      const { selection, document } = editor;

      if (selection.isEmpty) {
        return vscode.window.showInformationMessage("No text selected"); // No text selected
      }

      const selectedText = document.getText(selection);
      const gwtTests = generateTests(selectedText);

      await vscode.env.clipboard.writeText(gwtTests);

      vscode.window.showInformationMessage(`✅ Copied GWT tests`);
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
