import { bg, card, code, footer, title, C } from "./deck-style.mjs";

export async function slide13(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, C.cyan);
  title(slide, ctx, "How to read Aayush like a sentence");
  code(slide, ctx, `maan total chai 0\n\npratek score bhitra scores gara\n    total chai total + score\nsakiyo\n\nyedi total > 100 chabhane\n    lekh "Great class"\nsakiyo`, 62, 150, 535, 405, "read-it.aayush");
  card(slide, ctx, 665, 145, 455, 105, "maan total chai 0", "Make a variable named total and put 0 inside it.", C.cyan);
  card(slide, ctx, 665, 265, 455, 105, "pratek score bhitra scores", "For each score inside the scores list, run the block.", C.mint);
  card(slide, ctx, 665, 385, 455, 105, "total chai total + score", "Replace total with the old total plus the current score.", C.amber);
  card(slide, ctx, 665, 505, 455, 105, "yedi ... chabhane", "If the condition is true, run the lines until sakiyo.", C.violet);
  footer(slide, ctx, 13);
  return slide;
}
