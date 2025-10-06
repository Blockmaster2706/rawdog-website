export function updateTerminalFrame(command: string, content: string): void {
  const prevCommand = document.querySelector(".current-command");
  const terminalFrame = document.querySelector(".terminal-output");
  const promptLabel = document.querySelector(".prompt");

  if (terminalFrame && prevCommand && promptLabel) {
    prevCommand.textContent = promptLabel.textContent + " " + command;
    // Convert newline characters to <br> tags for proper HTML display
    terminalFrame.innerHTML = content.replace(/\n/g, "<br>");
  }
}