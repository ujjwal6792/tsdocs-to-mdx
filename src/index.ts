// const fs = require("fs");
// const path = require("path");
import * as fs from "fs";
import * as path from "path";

const readDocsFolder = async (tsdocsDir: string | null): Promise<void> => {
  if (typeof tsdocsDir !== "string") {
    return console.log("use valid path"); // Assume it's not a directory if check fails
  }
  const data = await new Promise((resolve) =>
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
  console.log("the data is: ", data);
};

const findDirectories = (array: string[]) => {
  if (!Array.isArray(array)) {
    return console.log("Input is not an array");
  }

  const checkDirectory = (dirname: string) => {
    return new Promise((resolve, reject) => {
      fs.stat(dirname, (err: NodeJS.ErrnoException | null, stat: fs.Stats) => {
        if (err) {
          reject(err);
        } else {
          resolve(stat.isDirectory());
        }
      });
    });
  };

  const checkAllDirectories = async () => {
    try {
      const results = await Promise.all(
        array.map(async (dirname) => {
          try {
            return { dirPath: dirname, isDir: await checkDirectory(dirname) };
          } catch (error) {
            console.error(`Error checking directory: ${dirname}`, error);
            return { dirPath: dirname, isDir: false }; // Assume it's not a directory if there's an error
          }
        }),
      );
      return results;
    } catch (error) {
      console.error("Error processing directories:", error);
      return [];
    }
  };
  return checkAllDirectories();
};

readDocsFolder("./tsdocs");
