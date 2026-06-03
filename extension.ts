declare const require: (moduleName: string) => {
  commands: {
    registerCommand(command: string, callback: () => void): unknown;
  };
  window: {
    activeTextEditor?: {
      document: {
        fileName: string;
      };
    };
    createTerminal(name: string): {
      show(): void;
      sendText(text: string): void;
    };
    showWarningMessage(message: string): void;
  };
};

type ExtensionContext = {
  asAbsolutePath(relativePath: string): string;
  subscriptions: {
    push(...items: unknown[]): void;
  };
};

const vscode = require('vscode');

export function activate(context: ExtensionContext) {
  const runCommand = vscode.commands.registerCommand('aayush.runFile', () => {
    const editor = vscode.window.activeTextEditor;
    const file = editor?.document.fileName;

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

export function deactivate() {}
