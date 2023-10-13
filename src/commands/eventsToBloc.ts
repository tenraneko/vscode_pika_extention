import * as vscode from "vscode";
import * as fs from "fs";

export function addMissingEventHandlers() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage("No active editor");
    return;
  }

  const document = editor.document;
  const documentText = document.getText();

  // Determine the path of the associated _events.dart file based on the _bloc.dart file
  const blocFilePath = document.fileName;
  const eventsFilePath = blocFilePath.replace("_bloc.dart", "_events.dart");

  if (!fs.existsSync(eventsFilePath)) {
    vscode.window.showInformationMessage("Events file not found.");
    return;
  }

  const eventsText = fs.readFileSync(eventsFilePath, "utf8");

  // Regular expression to match class names in events file (excluding abstract classes)
  const classRegex = /(?:abstract\s+)?class\s+(\w+)\s+(extends\s+\w+\s+)?{/g;

  const classNames = [];
  let match;

  // Find and store class names from the events file (excluding abstract classes)
  while ((match = classRegex.exec(eventsText))) {
    // Check for the presence of "extends" to exclude abstract classes
    if (match[1]) {
      classNames.push(match[1]);
    }
  }
  classNames.shift();

  if (classNames.length === 0) {
    vscode.window.showInformationMessage("No non-abstract class names found in the events file.");
    return;
  }
}
