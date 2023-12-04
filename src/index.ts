import * as fs from "fs";
import * as path from "path";
import findDirectories, { dirDetailsArray } from "./utils/findDirectories";

const getDirDetails = async (dir: string) => {
  return await new Promise((resolve) =>
    fs.readdir(
      dir,
      async (err: NodeJS.ErrnoException | null, files: string[]) => {
        if (err) {
          return console.log(err);
        }
        const folders = files.map((file) => {
          return path.join(dir, file);
        });
        resolve(await findDirectories(folders));
      },
    ),
  );
};

const readRootDocsFolder = async (): Promise<void> => {
  const tsdocsDir = process.argv[2]; // Fetching the folder path from command-line arguments
  if (typeof tsdocsDir !== "string") {
    return console.log("Please provide a valid folder path."); // Assume it's not a directory if check fails
  }
  const data = await getDirDetails(tsdocsDir);
  if (Array.isArray(data)) {
    const filesArray = data?.filter(
      (obj) => obj.isDir && !obj.dirPath.includes("assets"),
    );

    filesArray.forEach(async (htmlFolder) => {
      const data = (await getDirDetails(
        "./" + htmlFolder.dirPath,
      )) as dirDetailsArray;
      const filesArray = data.map((obj) => obj.dirPath);
      filesArray?.forEach((filePath: string) => {
        const outputFolder = "./outputHtmlDir";
        createFolderIfNotExists(outputFolder);
        moveHtmlFiles(filesArray, filePath, outputFolder);
      });
    });
  }
};

readRootDocsFolder();

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
    return console.log("No files array found");
  }
  files.forEach((file) => {
    const fileNameArray = file.split("/");
    const fileName = fileNameArray[fileNameArray.length - 1];
    const filePath = path.resolve(source);
    if (fs.existsSync(filePath) && file.endsWith(".html")) {
      const folderName = fileName.split(".")[0];
      const targetFolder = path.join(destination, folderName);

      createFolderIfNotExists(targetFolder);

      const newFilePath = path.join(targetFolder, fileName);

      fs.copyFileSync(filePath, newFilePath);
      console.log(`Moved ${file} to ${targetFolder}`);
    }
  });
}
