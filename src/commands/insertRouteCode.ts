import * as vscode from "vscode";

export function insertRouteCode() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage("No active editor");
    return;
  }

  const document = editor.document;
  const documentText = document.getText();

  // Regular expression to find the class declaration extending StatelessWidget or StatefulWidget
  const classRegex = /class\s+([\w\d]+)\s+extends\s+(StatelessWidget|StatefulWidget)\s*\{/g;

  let match;
  while ((match = classRegex.exec(documentText))) {
    const className = match[1];
    const classStartPos = document.positionAt(match.index + match[0].length);

    const routeCode = `
  static Route route() {
      return MaterialPageRoute(builder: (context) => ${className}());
  }
    `;

    // Apply the change to the document
    editor.edit((editBuilder) => {
      editBuilder.insert(classStartPos, routeCode);
    });

    // Find the end of the class declaration to insert the route code
    const endOfClass = documentText.indexOf("}", match!.index);
    if (endOfClass >= 0) {
      const insertPosition = document.positionAt(endOfClass + 1);
      editor.edit((editBuilder) => {
        editBuilder.insert(insertPosition, routeCode);
      });

      vscode.window.showInformationMessage(`Route code added for "${className}".`);
    } else {
      vscode.window.showInformationMessage(`Failed to add route code for "${className}".`);
    }
  }
}
