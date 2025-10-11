import { updateTerminalFrame } from "./html-modify-helper.js";
import { CustomFileSystem, CustomFileSystemNode } from "./types.js";

// Function to get file content based on path
export function getFileContent(path: string, files: CustomFileSystem): string | null {
  const parts = path.replace(/^~\//, "").split("/");
  let current: CustomFileSystemNode | null = files.getNodeByPath(files.currentPath + path);

  return current?.type === "file" ? current.content || null : null;
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
      filename = files.currentPath + filename.substring(1); // Convert absolute path to home-relative
    } 
    filename = files.currentPath + filename; // Convert relative path to home-relative
  }

  // Look up the file in our file system
  const fileContent = getFileContent(filename, files);
  if (fileContent !== null) {
    content = `\n${fileContent}`;
  } else {
    content = `\nError: File '${filename}' not found.`;
  }

  updateTerminalFrame(commandArguments.join(" "), content);
}