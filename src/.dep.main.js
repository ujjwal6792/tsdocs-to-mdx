const inputCode = `
/**
 * Gets all public keys associated with this DID.
 *
 * @param did The DID data.
 * @returns Array of public keys.
 */
export function getKeys(
  did: Partial<DidDocument> & Pick<DidDocument, 'authentication'>
): DidKey[] {
  return [
    ...did.authentication,
    ...(did.assertionMethod || []),
    ...(did.capabilityDelegation || []),
    ...(did.keyAgreement || []),
  ]
}
`;

const templateArray = [
  "Type",
  "Code Snippet",
  "Description",
  "Usage",
  "Parameters Object",
  "Return Values Object",
];

const convertTsDocToMd = (input) => {
  const regexTsDoc =
    /\/\*\*([\s\S]*?)\*\/([\s\S]*?(?:export (function|const|class)|$))/g;
  const match = regexTsDoc.exec(input);

  if (match) {
    const output = match[1]
      .trim()
      .split("\n")
      .map((line) => line.replace(/^\s*\*\s?/, ""))
      .filter(Boolean);

    return output;
  }
  return "";
};

function removeJsDoc(code) {
  const out = code.split("*/");
  return out;
}

function convertCommentToArray(comment) {
  // Split the comment into lines
  const lines = comment.trim().split("\n");

  // Remove leading and trailing spaces from each line
  const trimmedLines = lines.map((line) => line.trim());

  // Remove empty lines
  const nonEmptyLines = trimmedLines.filter((line) => line !== "");

  const output = nonEmptyLines
    .map((line) => line.replace(/^\s*\*\s?/, ""))
    .filter(Boolean);
  return output;
}

const outputCode = removeJsDoc(inputCode);
console.log(convertCommentToArray(outputCode[0]));

// console.log(convertTsDocToMd(inputCode));
