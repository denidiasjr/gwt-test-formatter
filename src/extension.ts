// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { generateTests } from "./generate-tests";
import { generateMarkdown } from "./generate-markdown";
import { MarkdownLinkProvider } from "./markdown-link-provider";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration("gwtTestFormatter");
  const markdownExtension = config.get<string>("markdownExtension", ".doc.md");

  const markdownProvider = vscode.languages.registerDocumentLinkProvider(
    { language: "markdown", pattern: `**/*${markdownExtension}` },
    new MarkdownLinkProvider(),
  );

  const disposableGenerateTests = vscode.commands.registerCommand(
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
    },
  );

  const disposableGenerateMarkdown = vscode.commands.registerCommand(
    "gwt-test-formatter.generateMarkdown",
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
      const gwtMarkdown = generateMarkdown(selectedText);

      await vscode.env.clipboard.writeText(gwtMarkdown);

      vscode.window.showInformationMessage(`✅ Copied GWT markdown`);
    },
  );

  context.subscriptions.push(disposableGenerateTests);
  context.subscriptions.push(disposableGenerateMarkdown);
  context.subscriptions.push(markdownProvider);
}

// This method is called when your extension is deactivated
export function deactivate() {}
