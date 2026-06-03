import { bg, card, footer, title, C } from "./deck-style.mjs";

export async function slide02(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, C.mint);
  title(slide, ctx, "What the language can do today");
  card(slide, ctx, 62, 160, 350, 160, "Core syntax", "Variables, printing, arithmetic, strings, booleans, comments, comparisons, and logical operators.", C.cyan);
  card(slide, ctx, 462, 160, 350, 160, "Control flow", "If / elif / else, while loops, for loops over lists, strings, and ranges, plus break and continue.", C.mint);
  card(slide, ctx, 862, 160, 350, 160, "Data", "Lists, indexes, index assignment, length, append, pop, type checks, and conversion helpers.", C.amber);
  card(slide, ctx, 180, 370, 420, 150, "Functions", "Define reusable work with kaam, pass parameters, and return values with firta.", C.violet);
  card(slide, ctx, 680, 370, 420, 150, "Tooling", "Run from terminal or through the VS Code command Aayush: Run File.", C.rose);
  footer(slide, ctx, 2);
  return slide;
}
