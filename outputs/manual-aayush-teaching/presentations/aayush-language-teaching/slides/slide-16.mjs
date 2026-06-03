import { bg, card, footer, title, C } from "./deck-style.mjs";

export async function slide16(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, C.violet);
  title(slide, ctx, "Practice path after the deck");
  card(slide, ctx, 70, 155, 330, 145, "1. Copy", "Run each example exactly once. Change one value and run it again.", C.cyan);
  card(slide, ctx, 475, 155, 330, 145, "2. Explain", "For every line, say what the computer will do before running the file.", C.mint);
  card(slide, ctx, 880, 155, 330, 145, "3. Break", "Make one deliberate mistake, read the error, then fix it.", C.amber);
  card(slide, ctx, 70, 375, 330, 145, "4. Combine", "Use variables, input, conditions, loops, and lists in one small program.", C.rose);
  card(slide, ctx, 475, 375, 330, 145, "5. Refactor", "Move repeated logic into kaam functions and return useful values with firta.", C.violet);
  card(slide, ctx, 880, 375, 330, 145, "6. Extend", "Try a calculator, marks tracker, quiz game, or menu-driven toolkit.", C.cyan);
  footer(slide, ctx, 16);
  return slide;
}
