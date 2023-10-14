import * as vscode from "vscode";
import * as fs from "fs";

export function eventToBloc() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage("No active editor");
    return;
  }

  // Get text of active editor (*_bloc.dart)
  const document = editor.document;
  const documentText = document.getText();

  // Get content of *_events.dart file
  const blocFilePath = document.fileName;
  const eventsFilePath = blocFilePath.replace("_bloc.dart", "_events.dart");

  if (!fs.existsSync(eventsFilePath)) {
    vscode.window.showInformationMessage("Events file not found.");
    return;
  }

  const eventsText = fs.readFileSync(eventsFilePath, "utf8");

  const classRegex = /(?:abstract\s+)?class\s+(\w+)\s+(extends\s+\w+\s+)?{/g;
  const classNames = [];
  let match;

  while ((match = classRegex.exec(eventsText))) {
    if (match[1]) {
      classNames.push(match[1]);
    }
  }
  classNames.shift();

  // Create a regex pattern to match any class ending with "*Bloc" and "*State"
  const classPattern = /Bloc<(\w+), (\w+)>/g;
  const classMatches = [...documentText.matchAll(classPattern)];

  const constructorPattern = /(\w+Bloc)\((.*?)\s*\) : super\((.*?)\) {\s*([\s\S]*?)^ *}/gm;
  const matches = [...documentText.matchAll(constructorPattern)];

  if (matches.length === 0) {
    vscode.window.showInformationMessage("No class constructor matching the pattern found.");
    return;
  }

  // Assume the last matching constructor is the one to be modified
  const match1 = matches[matches.length - 1];

  // Extract the existing constructor content
  const className = match1![1]!;
  const constructorParameters = match1![2];
  const superParameters = match1![3];
  const existingConstructorContent: string = match1![4];

  // Create an array of lines for the existing constructor content
  const existingConstructorLines = existingConstructorContent.split("\n").map((line) => line.trim());

  // Create a copy of classNames and sort it
  const sortedClassNames = [...classNames];

  // Create an array to store the sorted constructor content
  const sortedConstructorLines: string[] = [];

  // Add existing lines that match classNames in sorted order
  sortedClassNames.forEach((className) => {
    const existingLine = existingConstructorLines.find((line) => line.includes(`on<${className}>`));
    if (existingLine) {
      sortedConstructorLines.push("\t\t" + existingLine);
    } else {
      sortedConstructorLines.push(`\t\ton<${className}>(_${className[0].toLowerCase()}${className.slice(1)});`);
    }
  });

  // Join the sorted constructor lines
  const sortedConstructorContent = sortedConstructorLines.join("\n");

  // Create a regex pattern to match functions in the class
  const functionPattern = /^\s+\/\/\*\s*\w.*\s*Future<[^>]*>\s+\w*\s*\((\w+)([^)]*)\,.*>\s*(\w+)[^{]*{(?:[^{}]+|{(?:[^{}]+|{[^{}]*})*})*}/gm;
  const functionMatches = [...documentText.matchAll(functionPattern)];

  // Create an array to store the sorted function content
  const sortedFunctionLines: string[] = [];

  let modifiedDocumentText = documentText;

  const stateName = classMatches[0][2];

  // Add existing functions that match classNames in sorted order
  sortedClassNames.forEach((className) => {
    const matchingFunction = functionMatches.find(([functionBlock, eventName]) => eventName === className);
    if (matchingFunction) {
      sortedFunctionLines.push("  " + matchingFunction[0].trim() + "\n");

      modifiedDocumentText = modifiedDocumentText.replace(matchingFunction[0], ``);
    } else {
      let firstChar: string = className.charAt(0).toLowerCase();
      let outputString: string = firstChar + className.slice(1);

      sortedFunctionLines.push(`  //* ${className}\r\n  Future<void> _${outputString}(${className} event, Emitter<${stateName}> emit) async {}\n`);
    }
  });

  // Join the sorted function lines
  const sortedFunctionContent = sortedFunctionLines.join("\n\n");

  // // Replace the existing constructor content with the sorted content
  modifiedDocumentText = modifiedDocumentText.replace(
    constructorPattern,
    `${className}(${constructorParameters}) : super(${superParameters}) {\n${sortedConstructorContent}\n}\n${sortedFunctionContent}`
  );

  // Update the document with the modified text
  editor.edit((editBuilder) => {
    const startPosition = new vscode.Position(0, 0);
    const endPosition = document.positionAt(documentText.length);
    const fullRange = new vscode.Range(startPosition, endPosition);
    editBuilder.replace(fullRange, modifiedDocumentText.trim());
  });
}
