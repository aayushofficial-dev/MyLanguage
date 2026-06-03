import { bg, card, code, footer, title, C } from "./deck-style.mjs";

export async function slide11(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, C.mint);
  title(slide, ctx, "Debugging habits");
  code(slide, ctx, `# 1. Print values before a condition\nlekh "choice = " + choice\n\n# 2. Check names exactly\n# pahilo and pahiloo are different variables\n\n# 3. Keep end markers balanced\nyedi choice == "1" chabhane\n    lekh "Add"\nsakiyo`, 62, 150, 570, 405, "debugging.aayush");
  card(slide, ctx, 690, 165, 420, 110, "Read the error", "Unknown character, unexpected token, undefined variable, and wrong argument count usually point near the problem.", C.rose);
  card(slide, ctx, 690, 310, 420, 110, "Reduce the program", "Comment out lines until the smallest failing example remains.", C.cyan);
  card(slide, ctx, 690, 455, 420, 110, "Test one idea", "Run each new variable, branch, loop, or function before adding the next part.", C.amber);
  footer(slide, ctx, 11);
  return slide;
}
