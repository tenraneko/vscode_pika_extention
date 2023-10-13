import { window, CodeAction, CodeActionProvider, CodeActionKind } from "vscode";
import { getSelectedText } from "../utils/getSelectedText";

export class BlocCodeActionProvider implements CodeActionProvider {
  public provideCodeActions(): CodeAction[] {
    const editor = window.activeTextEditor;
    if (!editor) {
      return [];
    }

    const selectedText = editor.document.getText(getSelectedText(editor));
    if (selectedText === "") {
      return [];
    }

    return [
      {
        command: "flutter-pika-helper.wrapBlocBuilder",
        title: "Pika: Wrap with BlocBuilder",
      },
      {
        command: "flutter-pika-helper.wrapBlocListener",
        title: "Pika: Wrap with BlocListener",
      },
      {
        command: "flutter-pika-helper.wrapBlocConsumer",
        title: "Pika: Wrap with BlocConsumer",
      },
      {
        command: "flutter-pika-helper.wrapBlocProvider",
        title: "Pika: Wrap with BlocProvider",
      },
      {
        command: "flutter-pika-helper.wrapRepositoryProvider",
        title: "Pika: Wrap with RepositoryProvider",
      },
      {
        command: "flutter-pika-helper.wrapMultiBlocProvider",
        title: "Pika: Wrap with MultiBlocProvider",
      },
      {
        command: "flutter-pika-helper.wrapMultiRepositoryProvider",
        title: "Pika: Wrap with MultiRepositoryProvider",
      },
    ].map((c) => {
      let action = new CodeAction(c.title, CodeActionKind.Refactor);
      action.command = {
        command: c.command,
        title: c.title,
      };
      return action;
    });
  }
}
