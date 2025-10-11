import { getFileContent, processCatCommand } from "./filesystem-commands.js";
import { updateTerminalFrame } from "./html-modify-helper.js";
import { CustomFileSystem, CustomFileSystemNode } from "./types.js";

const fileSystem = new CustomFileSystem();

fileSystem.addDirectory("~", "documents");
fileSystem.addDirectory("~", "downloads");
fileSystem.addDirectory("~", "pictures");

fileSystem.addFile(
  "~",
  "readme.txt",
  "Welcome to the simulated terminal!\nUse commands like 'ls', 'cat', 'cd', and 'help' to navigate."
);
fileSystem.addFile(
  "~",
  "todo.txt",
  "1. Learn TypeScript\n2. Build a project\n3. Explore more commands"
);

fileSystem.addFile(
  "~/documents",
  "project.txt",
  "Project Ideas:\n- Build a personal website\n- Create a to-do app\n- Develop a game"
);

/**
 * This file provides functionality to modify the content of elements with the "commands" class
 */

/**
 * Finds and updates the content of elements with the "commands" class
 * @param newContent The new content to set
 * @returns boolean indicating success or failure
 */
function updateCommandsLabel(): boolean {
  try {
    // Find all elements with the class "commands"
    const prevCommand = document.querySelector(".current-command");
    const commandElement = document.querySelector(".commands");

    if (!(prevCommand && commandElement)) return false;

    const commandText = prevCommand.textContent || "";
    if (commandText.startsWith("user@machine:")) {
      prevCommand.textContent = commandText.replace("user@machine:", "").trim();
    }

    switch (prevCommand.textContent) {
      case "":
        commandElement.textContent =
          "Available Commands: help, ls, cat, cd, exit";
        return false;
      default:
        commandElement.textContent = prevCommand.textContent;
    }

    return true;
  } catch (error) {
    console.error("Error updating commands label:", error);
    return false;
  }
}

setTimeout(() => {
  updateCommandsLabel();
}, 5);

/**
 * Handles keyboard input for command execution
 */
document.addEventListener("keydown", (event) => {
  // Check if the pressed key is Enter
  if (event.key === "Enter") {
    console.log("Enter key pressed");
    // Get current command input (you would need a separate input element for this)
    const inputElement = document.querySelector(
      ".command-input"
    ) as HTMLInputElement;
    console.log("Input element:", inputElement);

    if (inputElement && inputElement.value) {
      const command = inputElement.value.trim().toLowerCase();

      const commandArguments = command.split(" ");
      console.log("Command arguments:", commandArguments);

      // Process the command
      processCommand(commandArguments);

      // Clear the input field
      inputElement.value = "";
    }
  }
  // Check if the pressed key is Tab for auto-completion
  else if (event.key === "Tab") {
    event.preventDefault(); // Prevent the default tab behavior
    const autoCompletedPath = autoCompletePath();
    if (autoCompletedPath) {
      const inputElement = document.querySelector(
        ".command-input"
      ) as HTMLInputElement;
      if (inputElement) {
        inputElement.value = autoCompletedPath;
      }
    }
  } else if (event.key === "ArrowUp") {
    event.preventDefault(); // Prevent the default arrow up behavior
    const inputElement = document.querySelector(
      ".command-input"
    ) as HTMLInputElement;
    const prevCommand = document.querySelector(".current-command");
    const promptLabel = document.querySelector(".prompt");
    if (prevCommand && inputElement && promptLabel) {
      let commandText = prevCommand.textContent || "";
      if (commandText.startsWith(promptLabel.textContent || "")) {
        commandText = commandText
          .replace(promptLabel.textContent || "", "")
          .trim();
      }
      inputElement.value = commandText || "";
    }
  }
});

/**
 * Processes commands entered by the user
 * @param command The command to process
 */
function processCommand(commandArguments: string[]): void {
  if (!commandArguments[0]) return;
  switch (commandArguments[0]) {
    case "help":
      processHelpCommand();
      break;
    case "ls":
      processLsCommand(commandArguments);
      break;
    case "cat":
      processCatCommand(commandArguments, fileSystem);
      break;
    case "cd":
      processCdCommand(commandArguments);
      break;
    case "exit":
      updateTerminalFrame(commandArguments[0], "\nExiting...");
      // Redirect to the home page
      setTimeout(() => {
        window.location.href = "./index.html";
      }, 1000);
      break;
    default:
      updateTerminalFrame(
        commandArguments[0],
        `\nUnknown command: ${commandArguments[0]}`
      );
      break;
  }
}

function processHelpCommand(): void {
  const content = `
Available Commands:

- help: Show this help message
- ls: List files
- cat [filename]: Display file content
- cd [directory]: Change directory
- exit: Exit the terminal
`;
  updateTerminalFrame("help", content);
}

function processLsCommand(commandArguments: string[]): void {
  if (!commandArguments[0]) return;

  if (!commandArguments[1]) {
    commandArguments[1] = fileSystem.currentPath; // Default to current directory
  }

  const dirPath = commandArguments[1];
  const content = fileSystem.listDirectory(dirPath);

  console.log("LS content:", content);

  const contentStr = content
    ? `\n${content.join("\n")}`
    : `\nError: Directory '${dirPath}' not found or is not a directory.`;

  updateTerminalFrame(commandArguments.join(" "), contentStr);
}

function getFileSystemFromPath(path: string): any {
  // If path is just "~", return the home directory directly
  if (path === "~") {
    return fileSystem.getNodeByPath("~");
  }

  if (!path.startsWith("~")) {
    if (path.startsWith("/")) {
      path = fileSystem.currentPath + path; // Convert absolute path to home-relative
    } else {
      path = fileSystem.currentPath + "/" + path; // Convert relative path to home-relative
    }
    console.log("Converted path:", path);
  }

  const parts = path.replace(/^~\//, "").split("/");
  let current: any = fileSystem.getNodeByPath("~");

  for (const part of parts) {
    if (!part) continue; // Skip empty parts
    if (!current[part]) return { "Could not find directory": true }; // Return empty object instead of null
    current = current[part];

    // If we've reached a file (string) and there are still parts to process,
    // we should return an empty object
    if (typeof current === "string") {
      return { "Cant run ls on a file. Input must be a directory": true };
    }
  }

  // If the final result is a file, return an empty object
  return typeof current === "string"
    ? { "Cant run ls on a file. Input must be a directory": true }
    : current;
}

function autoCompletePath(): string {
  const inputElement = document.querySelector(
    ".command-input"
  ) as HTMLInputElement;
  console.log("Input element for auto-complete:", inputElement.value);
  if (!inputElement) return "";

  let input = inputElement.value;

  if (
    input.startsWith("ls ") ||
    input.startsWith("cat ") ||
    input.startsWith("cd ") ||
    input.startsWith("vim ")
  ) {
    const parts: string[] = input.split(" ");
    if (parts.length < 2) return ""; // No path to complete
    input = parts.slice(1).join(" ");
  } else return ""; // Not a path-related command

  if (!input) return "";

  if (input.startsWith("~/")) {
    input = input.slice(2); // Remove leading '~/'
  }
  const parts = input.split("/");
  let current = fileSystem.getNodeByPath(fileSystem.currentPath);
  if (!current || !current.children) return ""; // Skip empty parts or if current is null
  let pathSoFar = fileSystem.currentPath;

  // For all parts except the last one, require exact matches
  for (let i = 0; i < parts.length - 1; i++) {
    console.log("Processing part for auto-completion:", parts[i]);
    console.log("Current directory children:", current?.children);
    const part = parts[i];
    if (!part || !current || !current.children) continue; // Skip empty parts or if current is null
    const child_path: CustomFileSystemNode | undefined = current.children.find(
      (child) => child.path === `${pathSoFar}/${part}`
    );
    if (!child_path) return ""; // Return empty string if not found
    current = child_path;
    pathSoFar += part + "/";
  }

  // For the last part, check for partial matches
  const lastPart = parts[parts.length - 1];
  if (lastPart) {
    if (!current || !current.children) return ""; // If current is null or has no children, return empty string
    console.log("Last part for auto-completion:", lastPart);
    console.log(
      "Current directory children:",
      current.children.map((child) => child.name)
    );
    const matches = current.children
      .map((child) => child.name)
      .filter((key) => key.startsWith(lastPart));

    // If exactly one match, use it for autocompletion
    if (matches.length === 1) {
      const command = inputElement.value.split(" ")[0] || "";
      const conditionalSlash =
        current?.children?.find((child) => child.name === matches[0])?.type ===
        "directory"
          ? "/"
          : "";
      console.log("Conditional slash:", conditionalSlash);
      return command
        ? `${command} ${pathSoFar}${matches[0]}${conditionalSlash}`
        : `${pathSoFar}${matches[0]}${conditionalSlash}`;
    }
  }

  console.log("Auto-completed path:", pathSoFar);
  return "";
}

function processCdCommand(commandArguments: string[]): void {
  if (!commandArguments[0]) return;

  if (!commandArguments[1]) {
    commandArguments[1] = "~"; // Default to home directory
  }

  if (!commandArguments[1].startsWith("~")) {
    if (commandArguments[1].startsWith("/")) {
      commandArguments[1] = fileSystem.currentPath + commandArguments[1]; // Convert absolute path to home-relative
    } else {
      commandArguments[1] = fileSystem.currentPath + "/" + commandArguments[1]; // Convert relative path to home-relative
    }
  }

  const targetPath = commandArguments[1];
  const targetDir = getFileSystemFromPath(targetPath);

  let content = "";
  if (getFileContent(targetPath, fileSystem) !== null) {
    content = `Error: '${targetPath}' is a file, not a directory.`;
    updateTerminalFrame(commandArguments.join(" "), content);
    return;
  }
  if (Object.keys(targetDir).includes("Could not find directory")) {
    content = `Error: Directory '${targetPath}' not found.`;
  } else {
    console.log(Object.keys(targetDir));
    // Update the current directory label
    const currentDirLabel = document.querySelector(".currentDir");
    if (currentDirLabel) {
      currentDirLabel.textContent = targetPath;
    }
    content = `Changed directory to '${targetPath}'`;

    const promptLabel = document.querySelector(".prompt");
    if (promptLabel) {
      promptLabel.textContent = "user@machine:" + targetPath + "$";
    }
  }

  updateTerminalFrame(commandArguments.join(" "), content);
}
