const fs = require("fs");
const path = require("path");

const readDocsFolder = async (tsdocsDir) => {
  if (
    typeof tsdocsDir !== "string" &&
    (tsdocsDir.slice(0, 2) !== "./" || tsdocsDir.slice(0, 2) !== "../")
  ) {
    return console.log("use valid path"); // Assume it's not a directory if check fails
  }
  const data = await new Promise((resolve) =>
    fs.readdir(tsdocsDir, async (err, files) => {
      if (err) {
        return console.log(err);
      }
      const folders = files.map((file) => {
        return path.join(tsdocsDir, file);
      });
      resolve(await findDirectories(folders));
    }),
  );
  return console.log(data);
};

const findDirectories = (array) => {
  if (!Array.isArray(array)) {
    return console.log("Input is not an array");
  }

  const checkDirectory = (dirname) => {
    return new Promise((resolve, reject) => {
      fs.stat(dirname, (err, stat) => {
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
            return await checkDirectory(dirname);
          } catch (error) {
            console.error(`Error checking directory: ${dirname}`, error);
            return false; // Assume it's not a directory if there's an error
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
