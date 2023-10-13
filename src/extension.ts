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
import { addMissingEventHandlers } from "./commands/eventsToBloc";

type CommandType = {
  command: string;
  fileName: string;
  folder: string;
};

export function activate(context: vscode.ExtensionContext) {
  //* Insert Route Code
  context.subscriptions.push(vscode.commands.registerCommand("flutter-pika-helper.eventsToBloc", addMissingEventHandlers));

  //* Insert Route Code
  context.subscriptions.push(vscode.commands.registerCommand("flutter-pika-helper.insertRouteCode", insertRouteCode));

  //* Generate Bloc
  context.subscriptions.push(vscode.commands.registerCommand("flutter-pika-helper.createBloc", createBlocCommand));

  //* Files Generator
  const listFilesToCreate: CommandType[] = [
    { command: "createConstantsApiRouts", fileName: "api_routs", folder: "constants" },
    { command: "createConstantsAssetPaths", fileName: "asset_paths", folder: "constants" },
    { command: "createPreferenceService", fileName: "preference_service", folder: "services" },
    { command: "createSessionService", fileName: "session_service", folder: "services" },
    { command: "createSettingsService", fileName: "settings_service", folder: "services" },
  ];

  listFilesToCreate.forEach((item) => {
    context.subscriptions.push(
      vscode.commands.registerCommand(`flutter-pika-helper.${item.command}`, () => {
        const filePath = createServiceFile(`${item.fileName}.dart`, item.folder);
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

function createServiceFile(fileName: string, directory: string) {
  const projectPath = vscode.workspace.workspaceFolders?.map((folder) => folder.uri.fsPath)[0]!;
  const folderPath = path.join(projectPath, "lib", "core", directory);
  const filePath = path.join(folderPath, fileName);
  const templatePath = path.join(__dirname, "../src", "templates", fileName);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Read the preset code from the template file
  const fileContents = fs.readFileSync(templatePath, "utf8");

  fs.writeFileSync(filePath, fileContents);
  return filePath;
}
