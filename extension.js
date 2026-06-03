const vscode = require('vscode');

function activate(context) {
  const runCommand = vscode.commands.registerCommand('aayush.runFile', () => {
    const editor = vscode.window.activeTextEditor;
    const file = editor && editor.document.fileName;

    if (!file) {
      vscode.window.showWarningMessage('Open a .aayush file first.');
      return;
    }

    const runner = context.asAbsolutePath('bin/aayush.js');
    const terminal = vscode.window.createTerminal('Aayush');
    terminal.show();
    terminal.sendText(`node "${runner}" run "${file}"`);
  });

  context.subscriptions.push(runCommand);
}

function deactivate() {}

module.exports = { activate, deactivate };
