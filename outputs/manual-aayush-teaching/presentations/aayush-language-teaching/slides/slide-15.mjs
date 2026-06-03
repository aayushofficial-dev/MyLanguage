import { bg, card, code, footer, title, C } from "./deck-style.mjs";

export async function slide15(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, C.rose);
  title(slide, ctx, "Mini project: marks tracker");
  code(slide, ctx, `maan scores chai [82, 67, 91]\nthap(scores, ank(sodha("New score: ")))\n\nmaan total chai 0\npratek score bhitra scores gara\n    total chai total + score\nsakiyo\n\nmaan average chai total / lambai(scores)\nlekh "Average: " + average\n\nyedi average >= 80 chabhane\n    lekh "Strong progress"\nnatra\n    lekh "Keep practicing"\nsakiyo`, 62, 138, 555, 465, "marks-tracker.aayush");
  card(slide, ctx, 670, 145, 465, 112, "What it practices", "Lists, input, number conversion, for loops, totals, averages, and if / else.", C.rose);
  card(slide, ctx, 670, 292, 465, 112, "Expected output", "It asks for one score, prints the new average, then shows a progress message.", C.cyan);
  card(slide, ctx, 670, 439, 465, 112, "Challenge", "Add highest score, lowest score, or a menu that lets the user enter many scores.", C.amber);
  footer(slide, ctx, 15);
  return slide;
}
