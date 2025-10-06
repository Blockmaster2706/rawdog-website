import { updateTerminalFrame } from "./html-modify-helper";
import { CustomFileSystem } from "./types";

// Function to get file content based on path
export function getFileContent(path: string, files: CustomFileSystem): string | null {
  const parts = path.replace(/^~\//, "").split("/");
  let current: any = fileSystem["~"];

  for (const part of parts) {
    if (!current[part]) return null;
    current = current[part];
  }

  return typeof current === "string" ? current : null;
}

export function processCatCommand(commandArguments: string[], files: CustomFileSystem): void {
  let content = "";

  // Check if a filename is provided
  let filename = commandArguments[1];
  console.log("Arguments:", commandArguments);

  if (!filename) {
    content = "\nError: No filename specified.";
    updateTerminalFrame(commandArguments.join(" "), content);
    return;
  }

  if (!filename.startsWith("~")) {
    if (filename.startsWith("/")) {
      filename = getCurrentDirectory() + filename; // Convert absolute path to home-relative
    } else {
      filename = getCurrentDirectory() + "/" + filename; // Convert relative path to home-relative
    }
  }

  // Look up the file in our file system
  const fileContent = getFileContent(filename);
  if (fileContent !== null) {
    content = `\n${fileContent}`;
  } else {
    content = `\nError: File '${filename}' not found.`;
  }

  updateTerminalFrame(commandArguments.join(" "), content);
}