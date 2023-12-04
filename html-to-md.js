const fs = require("fs");
const cheerio = require("cheerio");

function convertHtmlToMd(inputFilePath, outputFilePath) {
  // Read HTML file
  const htmlContent = fs.readFileSync(inputFilePath, "utf8");

  // Load HTML content using cheerio
  const $ = cheerio.load(htmlContent);

  // Remove styles and classes from all elements
  $("*").removeAttr("style").removeAttr("class");

  // Remove head element if present
  $("head").remove();

  // Extract title and keywords
  const title = $("title").text() || "fresh try";
  const keywords = $("meta[name=keywords]").attr("content") || "fresh try";

  // Extract order and label from the filename
  const fileNameWithoutExtension = inputFilePath.replace(/\.[^/.]+$/, "");
  const fileNameParts = fileNameWithoutExtension.split("_");
  const order = parseInt(fileNameParts[0], 10);
  const label = fileNameParts.slice(1).join("_");

  // Create Markdown content with specified header
  const mdContent = `---
title: ${title}
keywords: ${keywords || ""}
sidebar:
    order: ${order}
    label: ${label}
---

${$.html()}`;

  // Write Markdown content to the output file
  fs.writeFileSync(outputFilePath, mdContent, "utf8");

  console.log("Conversion completed successfully.");
}

export default convertHtmlToMd;
