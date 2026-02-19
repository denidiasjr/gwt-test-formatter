import * as vscode from "vscode";
import { mapMarkdownScenarios } from "./map-markdown-scenarios";
import { mapTestScenarios } from "./map-test-scenarios";

export class MarkdownLinkProvider implements vscode.DocumentLinkProvider {
  private diagnosticCollection: vscode.DiagnosticCollection;

  constructor() {
    this.diagnosticCollection =
      vscode.languages.createDiagnosticCollection("gwtTestFormatter");
  }

  async provideDocumentLinks(
    document: vscode.TextDocument,
    token: vscode.CancellationToken,
  ): Promise<vscode.DocumentLink[]> {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    const config = vscode.workspace.getConfiguration("gwtTestFormatter");
    const testsFolder = config.get<string>("testsFolder", "e2e/specs");
    const markdownsFolder = config.get<string>("markdownsFolder", "docs/");
    const links: vscode.DocumentLink[] = [];
    const diagnostics: vscode.Diagnostic[] = [];
    const markdownLines: string[] = [];
    const markdownRelativePath = vscode.workspace.asRelativePath(document.uri);
    const testRelativePath = markdownRelativePath
      .replace(markdownsFolder, testsFolder)
      .replace(".doc.md", ".spec.ts");

    if (!workspaceFolder) {
      return [];
    }

    for (let i = 0; i < document.lineCount; i++) {
      markdownLines.push(document.lineAt(i).text);
    }

    const testAbsolutePath = vscode.Uri.joinPath(
      workspaceFolder.uri,
      testRelativePath,
    ).fsPath;
    const markdownScenarios = mapMarkdownScenarios(markdownLines);
    const testScenarios = await mapTestScenarios(testAbsolutePath);

    markdownScenarios.forEach((markdownScenario) => {
      let currentTestLineIndex = 0;
      const testScenario = testScenarios.find(
        (test) => test[0].step === markdownScenario[0].step,
      );

      markdownScenario.forEach((markdownStep) => {
        const currentLineIndex = markdownStep.line;
        const range = this.getLineRange(document, currentLineIndex);
        const hasMatchingStep =
          markdownStep.step === testScenario?.[currentTestLineIndex]?.step;
        let targetUri: vscode.Uri;

        if (hasMatchingStep) {
          targetUri = vscode.Uri.joinPath(
            workspaceFolder.uri,
            testRelativePath,
          ).with({
            fragment: `L${testScenario?.[currentTestLineIndex]?.line ?? 1}`,
          });

          currentTestLineIndex++;
        } else {
          targetUri = vscode.Uri.joinPath(
            workspaceFolder.uri,
            testRelativePath,
          ).with({
            fragment: `L${testScenario?.[currentTestLineIndex - 1]?.line ?? 1}`,
          });

          const diagnostic = new vscode.Diagnostic(
            range,
            "This step is missing in the test file",
            vscode.DiagnosticSeverity.Error, // or Warning
          );
          diagnostic.source = "GWT Test Formatter";
          diagnostics.push(diagnostic);
        }

        links.push(new vscode.DocumentLink(range, targetUri));
      });
    });

    this.diagnosticCollection.set(document.uri, diagnostics);

    return links;
  }

  private getLineRange(
    document: vscode.TextDocument,
    lineNumber: number,
  ): vscode.Range {
    const lineIndex = lineNumber - 1;
    const line = document.lineAt(lineIndex);
    const start = new vscode.Position(lineIndex, 0);
    const end = new vscode.Position(lineIndex, line.text.length);

    return new vscode.Range(start, end);
  }

  public dispose(): void {
    this.diagnosticCollection.dispose();
  }
}
