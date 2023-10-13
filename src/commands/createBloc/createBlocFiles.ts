import { TextEncoder } from "util";
import { workspace, Uri } from "vscode";
import { blocEventsTemplate } from "./templates/blocEventsTemplate";
import { blocStateTemplate } from "./templates/blocStateTemplate";
import { blocTemplate } from "./templates/blocTemplate";

export async function createBlocFiles(folderPath: string, blocFilename: string, blocClassName: string) {
  await writeFile(`${folderPath}/${blocFilename}_bloc.dart`, blocTemplate(blocClassName, blocFilename));

  await writeFile(`${folderPath}/${blocFilename}_state.dart`, blocStateTemplate(blocClassName, blocFilename));

  await writeFile(`${folderPath}/${blocFilename}_events.dart`, blocEventsTemplate(blocClassName, blocFilename));
}

async function writeFile(path: string, content: string) {
  return workspace.fs.writeFile(Uri.file(path), new TextEncoder().encode(content));
}
