import { window, Uri } from "vscode";
import { createBlocFiles } from "./createBlocFiles";

export async function createBlocCommand(folder: Uri | undefined) {
  const blocName = await getBlocNameFromInput();
  if (blocName === undefined) {
    return -1;
  }

  const blocFilename = getBlocFilename(blocName);
  const blocClassName = getBlocClassName(blocName);
  if (blocFilename.length === 0 || blocClassName.length === 0) {
    window.showErrorMessage(`Bloc wasn't created: invalid bloc name`);
    return -2;
  }

  folder = folder || (await getBlocFolder());
  if (folder === undefined) {
    window.showWarningMessage(`Bloc wasn't created: invalid folder`);
    return -3;
  }

  const pathJoins = folder.path.split("/");
  const path = pathJoins.slice(0, -1).join("/");

  createBlocFiles(path + "/bloc", blocFilename, blocClassName);

  window.showInformationMessage(`Bloc ${blocClassName} successfully created`);
  return 0;
}

async function getBlocNameFromInput(): Promise<string | undefined> {
  return window.showInputBox({
    prompt: "Bloc name",
    placeHolder: "Only alpha-numeric characters, spaces and underscore are supported",
  });
}

async function getBlocFolder(): Promise<Uri | undefined> {
  const folders = await window.showOpenDialog({
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: false,
    openLabel: "Select File",
  });
  return folders !== undefined && folders.length > 0 ? folders[0] : undefined;
}

function getBlocClassName(inputText: string): string {
  let classname = inputText.replace(/[^\w]+/g, " ");
  classname = classname.replace(/_+/g, " ");
  classname = classname.trim();
  classname = classname.replace(/\s+([^\s])/g, (_, p1: string) => p1.toUpperCase());
  classname = classname.charAt(0).toUpperCase() + classname.slice(1);
  return classname;
}

export function getBlocFilename(inputText: string): string {
  let filename = inputText.replace(/[^\w]+/g, " ");
  filename = filename.replace(/_+/g, " ");
  filename = filename.replace(/([A-Z]+)/g, (_, p1) => " " + p1);
  filename = filename.trim();
  filename = filename.replace(/\s+/g, "_");
  filename = filename.toLowerCase();
  return filename;
}
