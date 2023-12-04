import * as fs from "fs";
import * as path from "path";
import findDirectories, { dirDetailsArray } from "./utils/findDirectories";

interface dirDetails {
  dirPath: string;
  isDir: boolean;
}

const readDocsFolder = async (tsdocsDir: string | null): Promise<void> => {
  if (typeof tsdocsDir !== "string") {
    return console.log("use a valid path"); // Assume it's not a directory if check fails
  }
  const data: dirDetailsArray | void = await new Promise((resolve) =>
    fs.readdir(
      tsdocsDir,
      async (err: NodeJS.ErrnoException | null, files: string[]) => {
        if (err) {
          return console.log(err);
        }
        const folders = files.map((file) => {
          return path.join(tsdocsDir, file);
        });
        resolve(await findDirectories(folders));
      },
    ),
  );
  const filesArray = data?.map((obj: dirDetails) => obj.dirPath);
  console.log("the data is: ", filesArray);
  const outputFolder = "./outputHtmlDir";
  createFolderIfNotExists(outputFolder);
  moveHtmlFiles(filesArray, tsdocsDir, outputFolder);
};

readDocsFolder("./tsdocs/functions");

function createFolderIfNotExists(folderPath: string) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
}

function moveHtmlFiles(
  files: string[] | undefined,
  source: string,
  destination: string,
) {
  if (!Array.isArray(files)) {
    return console.log("no files array found");
  }
  files.forEach((file) => {
    const filePath = path.join(source, file);
    if (fs.existsSync(filePath) && file.endsWith(".html")) {
      const folderName = file.split(".")[0];
      const targetFolder = path.join(destination, folderName);

      createFolderIfNotExists(targetFolder);

      const newFilePath = path.join(targetFolder, file);

      fs.renameSync(filePath, newFilePath);
      console.log(`Moved ${file} to ${targetFolder}`);
    }
  });
}
