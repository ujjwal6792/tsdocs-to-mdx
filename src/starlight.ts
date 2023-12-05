const fs = require("fs");
const path = require("path");

function extractTitleFromFileName(fileName: string) {
  const parts = fileName.split("_");

  // Capitalize each word and join with space
  const title = parts
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return title;
}

function updateMarkdownFiles(folderPath: string) {
  const files = fs.readdirSync(folderPath);

  files.forEach((file: string) => {
    const filePath = path.join(folderPath, file);
    const isDirectory = fs.statSync(filePath).isDirectory();

    if (isDirectory) {
      // Recursively process subdirectories
      updateMarkdownFiles(filePath);
    } else if (file.endsWith(".md")) {
      // Process only markdown files
      updateMarkdownFile(filePath);
    }
  });
}

function updateMarkdownFile(filePath: string) {
  const filePathArray = filePath.split("/");
  const fileNameWithExt = filePathArray[filePathArray.length - 1].split(".");
  const fileName = fileNameWithExt[fileNameWithExt.length - 2];

  try {
    // Read the content of the file
    let content = fs.readFileSync(filePath, "utf-8");
    // Update the first line with the specified format
    const updatedContent = content.replace(
      /^(.*)(\r\n|\r|\n)/,
      `---\ntitle: ${extractTitleFromFileName(fileName)}  \n---\n`,
    );

    // Write the updated content back to the file
    fs.writeFileSync(filePath, updatedContent, "utf-8");

    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}: ${error}`);
  }
}

// Replace 'path_to_your_folder' with the actual path to your folder
const folderPath = "./tsdocs";
updateMarkdownFiles(folderPath);
