// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

import {
  wrapWithBlocBuilder,
  wrapWithBlocListener,
  wrapWithBlocConsumer,
  wrapWithBlocProvider,
  wrapWithRepositoryProvider,
  wrapWithMultiBlocProvider,
  wrapWithMultiRepositoryProvider,
} from "./commands/wrappers";
import { BlocCodeActionProvider } from "./codeActions/blocCodeActionProvider";
import { createBlocCommand } from "./commands/createBloc/createBlocCommand";
import { insertRouteCode } from "./commands/insertRouteCode";
import { eventToBloc } from "./commands/eventsToBloc";

type CommandType = {
  command: string;
  fileName: string;
  folder: string;
  isDirectory: boolean;
};

export function activate(context: vscode.ExtensionContext) {
  //* Insert Route Code
  context.subscriptions.push(vscode.commands.registerCommand("flutter-pika-helper.eventsToBloc", eventToBloc));

  //* Insert Route Code
  context.subscriptions.push(vscode.commands.registerCommand("flutter-pika-helper.insertRouteCode", insertRouteCode));

  //* Generate Bloc
  context.subscriptions.push(vscode.commands.registerCommand("flutter-pika-helper.createBloc", createBlocCommand));

  //* Files Generator
  const listFilesToCreate: CommandType[] = [
    { command: "createColorConstants", fileName: "color_constants", folder: "constants", isDirectory: false },
    { command: "createInsetsConstants", fileName: "insets_constants", folder: "constants", isDirectory: false },
    { command: "createConstantsApiRouts", fileName: "api_routs", folder: "constants", isDirectory: false },
    { command: "createConstantsAssetPaths", fileName: "asset_paths", folder: "constants", isDirectory: false },
    { command: "createPreferenceService", fileName: "preference_service", folder: "services", isDirectory: false },
    { command: "createSessionService", fileName: "session_service", folder: "services", isDirectory: false },
    { command: "createSettingsService", fileName: "settings_service", folder: "services", isDirectory: false },
    { command: "createDio", fileName: "dio", folder: "services", isDirectory: true },
  ];

  listFilesToCreate.forEach((item) => {
    context.subscriptions.push(
      vscode.commands.registerCommand(`flutter-pika-helper.${item.command}`, () => {
        const filePath = createServiceFile(`${item.fileName}${item.isDirectory ? "" : ".dart"}`, item.folder, item.isDirectory);
        vscode.window.showInformationMessage(`Created ${filePath}`);
      })
    );
  });

  //* End Files Generator ----------------------------------------------------------------------------
  context.subscriptions.push(
    vscode.commands.registerCommand("flutter-pika-helper.wrapBlocBuilder", () => wrapper(wrapWithBlocBuilder)),
    vscode.commands.registerCommand("flutter-pika-helper.wrapBlocListener", () => wrapper(wrapWithBlocListener)),
    vscode.commands.registerCommand("flutter-pika-helper.wrapBlocConsumer", () => wrapper(wrapWithBlocConsumer)),
    vscode.commands.registerCommand("flutter-pika-helper.wrapBlocProvider", () => wrapper(wrapWithBlocProvider)),
    vscode.commands.registerCommand("flutter-pika-helper.wrapRepositoryProvider", () => wrapper(wrapWithRepositoryProvider)),
    vscode.commands.registerCommand("flutter-pika-helper.wrapMultiBlocProvider", () => wrapper(wrapWithMultiBlocProvider)),
    vscode.commands.registerCommand("flutter-pika-helper.wrapMultiRepositoryProvider", () => wrapper(wrapWithMultiRepositoryProvider)),
    vscode.languages.registerCodeActionsProvider({ language: "dart", scheme: "file" }, new BlocCodeActionProvider())
    //   disposable
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}

async function wrapper(func: () => Promise<void>) {
  await func();

  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const document = editor.document;
    const documentText = document.getText();
    const importStatement = "\nimport 'package:flutter_bloc/flutter_bloc.dart';";

    // Check if the import statement already exists in the document
    if (!documentText.includes(importStatement)) {
      // Find the last import statement in the document
      const lastImportMatch = /import\s+['"].*['"];/g.exec(documentText);
      // Determine the position to insert the import statement
      const positionToInsert = lastImportMatch
        ? document.positionAt(lastImportMatch.index + lastImportMatch[0].length) // Insert after the last import statement
        : new vscode.Position(0, 0); // Insert at the beginning of the document

      // Apply the change to the document
      editor.edit((editBuilder) => {
        editBuilder.insert(positionToInsert, importStatement + "\n");
      });
    }
  }
}

function createServiceFile(fileName: string, directory: string, isDirectory: boolean = false) {
  const projectPath = vscode.workspace.workspaceFolders?.map((folder) => folder.uri.fsPath)[0]!;
  const folderPath = path.join(projectPath, "lib", "core", directory);
  const targetPath = path.join(folderPath, fileName);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  if (isDirectory) {
    // Copy the entire directory recursively
    copyDirectory(path.join(__dirname, "templates", fileName), targetPath);
  } else {
    // Read the preset code from the template file
    const fileContents = fs.readFileSync(path.join(__dirname, "templates", fileName), "utf8");

    // Write the file contents to the target file
    fs.writeFileSync(targetPath, fileContents);
  }

  return targetPath;
}

// Function to copy a directory recursively
function copyDirectory(source: string, destination: string) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const files = fs.readdirSync(source);

  files.forEach((file) => {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);

    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      const fileContents = fs.readFileSync(sourcePath);
      fs.writeFileSync(destPath, fileContents);
    }
  });
}
