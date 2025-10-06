import { getFileContent } from "./filesystem-commands";
import { CustomFileSystem } from "./types";

const fileSystem = new CustomFileSystem();

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
      processCatCommand(commandArguments);
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
    commandArguments[1] = getCurrentDirectory(); // Default to current directory
  }

  const dirPath = commandArguments[1];
  const directory = getFileSystemFromPath(dirPath);

  let files = "";
  if (typeof directory === "object" && !directory["Could not find directory"]) {
    // Process each item in the directory
    files = Object.entries(directory)
      .map(([name, content]) => {
        // Check if it's a directory or a file
        const prefix =
          typeof content === "object" ? "dir&nbsp;&nbsp;" : "file ";
        return prefix + name;
      })
      .join("\n");
  } else if (directory["Could not find directory"]) {
    files = `Error: Directory '${dirPath}' not found.`;
  } else if (directory["Cant run ls on a file. Input must be a directory"]) {
    files = `Error: '${dirPath}' is a file, not a directory.`;
  } else {
    files = "Empty directory";
  }

  const content = `${files}`;
  updateTerminalFrame(commandArguments.join(" "), content);
}

function getFileSystemFromPath(path: string): any {
  // If path is just "~", return the home directory directly
  if (path === "~") {
    return fileSystem["~"];
  }

  if (!path.startsWith("~")) {
    if (path.startsWith("/")) {
      path = getCurrentDirectory() + path; // Convert absolute path to home-relative
    } else {
      path = getCurrentDirectory() + "/" + path; // Convert relative path to home-relative
    }
    console.log("Converted path:", path);
  }

  const parts = path.replace(/^~\//, "").split("/");
  let current: any = fileSystem["~"];

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
    input.startsWith("cd ")
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
  let current: any = fileSystem["~"];
  let pathSoFar = "~";

  // For all parts except the last one, require exact matches
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!part) continue; // Skip empty parts
    if (!current[part]) return ""; // Return empty string if not found
    current = current[part];
    pathSoFar += "/" + part;
  }

  // For the last part, check for partial matches
  const lastPart = parts[parts.length - 1];
  if (lastPart) {
    const matches = Object.keys(current).filter((key) =>
      key.startsWith(lastPart)
    );

    // If exactly one match, use it for autocompletion
    if (matches.length === 1) {
      const command = inputElement.value.split(" ")[0] || "";
      return command
        ? `${command} ${pathSoFar}/${matches[0]}`
        : `${pathSoFar}/${matches[0]}`;
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
      commandArguments[1] = getCurrentDirectory() + commandArguments[1]; // Convert absolute path to home-relative
    } else {
      commandArguments[1] = getCurrentDirectory() + "/" + commandArguments[1]; // Convert relative path to home-relative
    }
  }

  const targetPath = commandArguments[1];
  const targetDir = getFileSystemFromPath(targetPath);

  let content = "";
  if (getFileContent(targetPath) !== null) {
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


