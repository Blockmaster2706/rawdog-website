import { updateTerminalFrame } from "./html-modify-helper";
// Function to get file content based on path
export function getFileContent(path, files) {
    const parts = path.replace(/^~\//, "").split("/");
    let current = fileSystem["~"];
    for (const part of parts) {
        if (!current[part])
            return null;
        current = current[part];
    }
    return typeof current === "string" ? current : null;
}
export function processCatCommand(commandArguments, files) {
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
        }
        else {
            filename = getCurrentDirectory() + "/" + filename; // Convert relative path to home-relative
        }
    }
    // Look up the file in our file system
    const fileContent = getFileContent(filename);
    if (fileContent !== null) {
        content = `\n${fileContent}`;
    }
    else {
        content = `\nError: File '${filename}' not found.`;
    }
    updateTerminalFrame(commandArguments.join(" "), content);
}
//# sourceMappingURL=filesystem-commands.js.map