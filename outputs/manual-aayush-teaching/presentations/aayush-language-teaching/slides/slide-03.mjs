import { bg, code, footer, table, title, C } from "./deck-style.mjs";

export async function slide03(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, C.amber);
  title(slide, ctx, "Running a program");
  code(slide, ctx, `# terminal\nnode bin/aayush.js run examples/python_features.aayush\n\n# VS Code\nOpen a .aayush file\nRun command: Aayush: Run File`, 62, 160, 540, 330, "run commands");
  table(slide, ctx, [
    ["Step", "What happens"],
    ["1. Read", "The source file is loaded as text."],
    ["2. Tokenize", "Words and symbols become tokens."],
    ["3. Parse", "Tokens become a tree of statements."],
    ["4. Execute", "The interpreter evaluates the tree."],
  ], 660, 158, 520, 62, 150, [C.amber, C.cyan]);
  footer(slide, ctx, 3);
  return slide;
}
