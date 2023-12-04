import * as fs from "fs";

export interface dirDetails {
  dirPath: string;
  isDir: boolean;
}

export type dirDetailsArray = dirDetails[];

const findDirectories = async (array: string[]): Promise<dirDetailsArray> => {
  if (!Array.isArray(array)) {
    return Promise.reject(new Error("Input is not an array"));
  }

  const checkDirectory = (dirname: string): Promise<boolean> => {
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
            return {
              dirPath: dirname,
              isDir: (await checkDirectory(dirname)) as boolean,
            };
          } catch (error) {
            console.error(`Error checking directory: ${dirname}`, error);
            return { dirPath: dirname, isDir: false as boolean }; // Assume it's not a directory if there's an error
          }
        }),
      );
      return results;
    } catch (error) {
      console.error("Error processing directories:", error);
      return [];
    }
  };

  return checkAllDirectories() as Promise<dirDetailsArray>;
};

export default findDirectories;
