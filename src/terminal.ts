import { getFileContent, processCatCommand } from "./filesystem-commands.js";
import { updateTerminalFrame } from "./html-modify-helper.js";
import { CustomFileSystem, CustomFileSystemNode } from "./types.js";

const fs = localStorage.getItem("filesystem"); // Ensure filesystem is initialized

const fileSystemData = fs ? JSON.parse(fs) : null;
const fileSystem: CustomFileSystem = fileSystemData
  ? Object.assign(new CustomFileSystem(), fileSystemData)
  : new CustomFileSystem();

if (!fileSystemData) {
  // If the filesystem is empty, initialize it with a default structure
  fileSystem.addFile(
    "/",
    "readme.txt",
    "Welcome to the simulated terminal!\nType 'help' to see available commands."
  );
}

localStorage.setItem("filesystem", JSON.stringify(fileSystem));

console.log("Initialized filesystem:", fileSystem);

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
          "Available Commands: help, ls, cat, cd, exit, mkdir, rm, vim";
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
const editorInputLabel = document.querySelector(".file-input");

editorInputLabel?.addEventListener("keydown", (e: Event) => {
  const keyEvent = e as KeyboardEvent;
  if (keyEvent.key === ":") {
    console.log("Colon key pressed in editor");
    e.preventDefault(); // Prevent the default behavior
    const inputElement = document.querySelector(
      ".editor-command-input"
    ) as HTMLLabelElement;
    console.log("Editor input element:", inputElement);
    if (inputElement) {
      inputElement.textContent = ":";
      inputElement.classList.remove("hidden");
      inputElement.setAttribute("tabindex", "0");
      inputElement.focus();
    }
  }
});

const editorCommandInput = document.querySelector(
  ".editor-command-input"
) as HTMLLabelElement;

editorCommandInput.addEventListener("blur", (e) => {
  const inputElement = e.target as HTMLLabelElement;
  if (inputElement) {
    inputElement.textContent = "";
    inputElement.classList.add("hidden");
  }
});

editorCommandInput.addEventListener("keydown", (e: Event) => {
  const keyEvent = e as KeyboardEvent;
  switch (keyEvent.key) {
    case "w":
      console.log("W pressed in editor command input");
      if (editorCommandInput.textContent === ":") {
        editorCommandInput.textContent = ":w";
      } else if (editorCommandInput.textContent === ":q") {
        editorCommandInput.textContent = ":qw";
      }
      break;
    case "q":
      console.log("Q pressed in editor command input");
      if (editorCommandInput.textContent === ":") {
        editorCommandInput.textContent = ":q";
      } else if (editorCommandInput.textContent === ":w") {
        editorCommandInput.textContent = ":wq";
      }
      break;
    case "Enter":
      const fileInput = document.querySelector(
        ".file-input"
      ) as HTMLTextAreaElement;
      if (editorCommandInput.textContent.includes("w")) {
        console.log("W command entered");
        const currentFileLabel = document.querySelector(
          ".currentFile"
        ) as HTMLLabelElement;
        if (fileInput && currentFileLabel) {
          const currentFilePath = currentFileLabel.textContent || "";
          const fileNode = fileSystem.getNodeByPath(currentFilePath);
          if (fileNode && fileNode.type === "file") {
            fileNode.content = fileInput.value;
            localStorage.setItem("filesystem", JSON.stringify(fileSystem));
            updateTerminalFrame(
              "vim",
              `\nSaved changes to '${currentFilePath}'.`
            );
          } else {
            updateTerminalFrame(
              "vim",
              `\nError: '${currentFilePath}' is not a valid file.`
            );
          }
        }
      }
      if (editorCommandInput.textContent.includes("q")) {
        console.log("Q command entered");
        const currentFileLabel = document.querySelector(
          ".currentFile"
        ) as HTMLLabelElement;
        // Close the editor
        const editorElement = document.querySelector(
          ".file-editor"
        ) as HTMLDivElement;
        if (editorElement) {
          editorElement.classList.add("hidden");
        }
        // Clear the file input
        if (fileInput) {
          fileInput.value = "";
        }
        // Clear the current file label
        if (currentFileLabel) {
          currentFileLabel.textContent = "";
        }
        const commandInput = document.querySelector(
          ".command-input"
        ) as HTMLInputElement;
        if (commandInput) {
          commandInput.focus();
        }
      }
      fileInput.focus();
      e.preventDefault(); // Prevent the default behavior
      break;
    case "Backspace":
      if (keyEvent.key === "Backspace") {
        if (editorCommandInput.textContent) {
          editorCommandInput.textContent = editorCommandInput.textContent.slice(
            0,
            -1
          );
        }
        if (editorCommandInput.textContent === "") {
          editorCommandInput.textContent = ":";
        }
      }
      break;
    case "Escape":
      console.log("Escape key pressed in editor command input");
      e.preventDefault(); // Prevent the default behavior
      const inputElement = e.target as HTMLInputElement;
      if (inputElement) {
        // Close the command input
        inputElement.value = "";
        inputElement.classList.add("hidden");
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
    case "mkdir":
      processMkdirCommand(commandArguments);
      break;
    case "rm":
      processRmCommand(commandArguments);
      break;
    case "vim":
      processVimCommand(commandArguments);
      break;
    case "exit":
      updateTerminalFrame(commandArguments[0], "\nExiting...");
      // Redirect to the home page
      setTimeout(() => {
        window.location.href = "./index.html";
      }, 1000);
      break;
    case "test-reset":
      localStorage.removeItem("filesystem");
      updateTerminalFrame(commandArguments[0], "\nFilesystem reset.");
      setTimeout(() => {
        window.location.reload();
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
- mkdir [directory]: Create a new directory
- rm [file/directory]: Remove a file or directory
- vim [filename]: Edit or create a file
`;
  updateTerminalFrame("help", content);
}

function processRmCommand(commandArguments: string[]): void {
  if (!commandArguments[0]) return;

  if (commandArguments[1] === undefined) {
    updateTerminalFrame(
      commandArguments[0],
      `\nError: 'rm' requires a file or directory name.`
    );
    return;
  }

  let targetPath = commandArguments[1];

  if (targetPath === "/" || targetPath === "~") {
    updateTerminalFrame(
      commandArguments.join(" "),
      `\nError: Cannot remove the root directory.`
    );
    return;
  }

  if (targetPath.endsWith("/")) {
    targetPath = targetPath.substring(0, targetPath.length - 1); // Remove trailing slash
  }

  if (!targetPath.startsWith("/")) {
    targetPath = fileSystem.currentPath + targetPath; // Ensure absolute path
  }

  const nodeToRemove = fileSystem.getNodeByPath(targetPath);
  if (!nodeToRemove) {
    updateTerminalFrame(
      commandArguments.join(" "),
      `\nError: '${targetPath}' does not exist.`
    );
    return;
  }

  const parentPath = targetPath.substring(0, targetPath.lastIndexOf("/"));
  const parentNode = fileSystem.getNodeByPath(parentPath);
  if (!parentNode || !parentNode.children) {
    updateTerminalFrame(
      commandArguments.join(" "),
      `\nError: Parent directory '${parentPath}' does not exist.`
    );
    return;
  }

  const index = parentNode.children.findIndex(
    (child) => child.name === nodeToRemove.name
  );
  if (index === -1) {
    updateTerminalFrame(
      commandArguments.join(" "),
      `\nError: Could not find '${targetPath}' in its parent directory.`
    );
    return;
  }

  console.log("Removing node(s): ", parentNode.children.splice(index, 1));
  console.log("Updated parent node:", parentNode);
  console.log("Updated filesystem:", fileSystem);
  localStorage.setItem("filesystem", JSON.stringify(fileSystem));
  updateTerminalFrame(
    commandArguments.join(" "),
    `\nRemoved '${targetPath}' successfully.`
  );

  localStorage.setItem("filesystem", JSON.stringify(fileSystem));
}

function processLsCommand(commandArguments: string[]): void {
  if (!commandArguments[0]) return;

  if (!commandArguments[1]) {
    commandArguments[1] = fileSystem.currentPath; // Default to current directory
  }

  if (commandArguments[1].endsWith("/")) {
    commandArguments[1] = commandArguments[1].substring(
      0,
      commandArguments[1].length - 1
    ); // Remove trailing slash
  }

  console.log("LS command path argument:", commandArguments[1]);

  const dirPath = commandArguments[1];
  const content = fileSystem.listDirectory(dirPath);

  console.log("LS content:", content);

  const contentStr = content
    ? `\n${content.join("\n")}`
    : `\nError: Directory '${dirPath}' not found or is not a directory.`;

  updateTerminalFrame(commandArguments.join(" "), contentStr);
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
    input.startsWith("vim ") ||
    input.startsWith("rm ")
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

function processMkdirCommand(commandArguments: string[]): void {
  if (!commandArguments[0]) return;

  if (commandArguments[1] === undefined) {
    updateTerminalFrame(
      commandArguments[0],
      `\nError: 'mkdir' requires a directory name.`
    );
    return;
  }

  let targetPath = commandArguments[1];

  if (targetPath.endsWith("/")) {
    targetPath = targetPath.substring(0, targetPath.length - 1); // Remove trailing slash
  }

  if (!targetPath.startsWith("/")) {
    targetPath = fileSystem.currentPath + targetPath; // Ensure absolute path
  }

  const dirPath = targetPath;
  const parentPath = dirPath.substring(0, dirPath.lastIndexOf("/"));

  if (parentPath && !fileSystem.getNodeByPath(parentPath)) {
    updateTerminalFrame(
      commandArguments.join(" "),
      `\nError: Parent directory '${parentPath}' does not exist.`
    );
    return;
  }

  const dirName = dirPath.substring(dirPath.lastIndexOf("/") + 1);

  if (fileSystem.addDirectory(parentPath || "/", dirName)) {
    localStorage.setItem("filesystem", JSON.stringify(fileSystem));
    updateTerminalFrame(
      commandArguments.join(" "),
      `\nCreated directory '${dirPath}'`
    );
  } else {
    updateTerminalFrame(
      commandArguments.join(" "),
      `\nError: Could not create directory '${dirPath}'`
    );
  }
}

function processCdCommand(commandArguments: string[]): void {
  if (!commandArguments[0]) return;

  let targetPath = commandArguments[1];

  if (!targetPath) {
    targetPath = "~"; // Default to home directory
  }

  let content = "";
  const targetDir = fileSystem.getNodeByPath(targetPath);
  if (!(targetDir && targetDir.children)) {
    content = `Error: Directory '${targetPath}' not found.`;
    updateTerminalFrame(commandArguments.join(" "), content);
    return;
  }
  if (targetDir && targetDir.type === "file") {
    content = `Error: '${targetPath}' is a file, not a directory.`;
    updateTerminalFrame(commandArguments.join(" "), content);
    return;
  }

  let changed = targetDir.path;
  if (targetDir.path !== "/") {
    changed = targetDir.path.endsWith("/")
      ? targetDir.path.substring(0, targetDir.path.length - 1)
      : targetDir.path;
  } else changed = "~";

  fileSystem.changeDirectory(changed);
  const currentDirLabel = document.querySelector(".prompt");
  if (currentDirLabel) {
    currentDirLabel.textContent = "user@machine:" + changed + "$";
  }
  content = `Changed directory to '${changed}'`;
  console.log("Changed directory to:", fileSystem.currentPath);

  updateTerminalFrame(commandArguments.join(" "), content);
}

function processVimCommand(commandArguments: string[]): void {
  if (!commandArguments[0]) return;

  const editorElement = document.querySelector(
    ".file-editor"
  ) as HTMLDivElement;
  if (editorElement && !editorElement.classList.contains("hidden")) {
    updateTerminalFrame(
      commandArguments.join(" "),
      `\nError: There is already a file open in the editor. Please close it before changing directories.`
    );
    return;
  }

  if (commandArguments[1] === undefined) {
    updateTerminalFrame(
      commandArguments[0],
      `\nError: 'vim' requires a file name.`
    );
    return;
  }

  let targetPath = commandArguments[1];

  if (targetPath.endsWith("/")) {
    targetPath = targetPath.substring(0, targetPath.length - 1); // Remove trailing slash
  }

  if (!targetPath.startsWith("/")) {
    targetPath = fileSystem.currentPath + targetPath; // Ensure absolute path
  }

  const fileNode = fileSystem.getNodeByPath(targetPath);
  if (fileNode && fileNode.type === "directory") {
    updateTerminalFrame(
      commandArguments.join(" "),
      `\nError: '${targetPath}' is a directory, not a file.`
    );
    return;
  }

  let fileContent = getFileContent(targetPath, fileSystem);

  if (fileContent === null) {
    // If file doesn't exist, create it
    const parentPath = targetPath.substring(0, targetPath.lastIndexOf("/"));
    const fileName = targetPath.substring(targetPath.lastIndexOf("/") + 1);
    if (!fileSystem.addFile(parentPath || "/", fileName, "")) {
      updateTerminalFrame(
        commandArguments.join(" "),
        `\nError: Could not create file '${targetPath}'.`
      );
      return;
    }
    fileContent = "";
  }

  const fileInput = document.querySelector(
    ".file-input"
  ) as HTMLTextAreaElement;
  const currentFileLabel = document.querySelector(
    ".currentFile"
  ) as HTMLLabelElement;
  if (editorElement && fileInput && currentFileLabel) {
    editorElement.classList.remove("hidden");
    fileInput.value = fileContent;
    currentFileLabel.textContent = targetPath;
    fileInput.focus();
  } else {
    updateTerminalFrame(
      commandArguments.join(" "),
      `\nEdit failed for '${targetPath}'.`
    );
  }

  updateTerminalFrame(commandArguments.join(" "), "");
}
