import { bg, code, footer, table, title, C } from "./deck-style.mjs";

export async function slide08(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, C.rose);
  title(slide, ctx, "Lists and indexes");
  code(slide, ctx, `maan scores chai [10, 20, 30]\nthap(scores, 40)\n\nlekh scores[0]\nscores[1] chai scores[1] + 5\nlekh scores\n\nlekh lambai(scores)\nlekh nikal(scores)`, 62, 154, 540, 405, "lists.aayush");
  table(slide, ctx, [
    ["Helper", "Use"],
    ["[1, 2, 3]", "Create a list"],
    ["scores[0]", "Read by index"],
    ["scores[1] chai 25", "Change by index"],
    ["lambai(scores)", "Length"],
    ["thap(scores, 40)", "Append"],
    ["nikal(scores)", "Pop"],
  ], 665, 150, 500, 56, 180, [C.rose, C.mint]);
  footer(slide, ctx, 8);
  return slide;
}
