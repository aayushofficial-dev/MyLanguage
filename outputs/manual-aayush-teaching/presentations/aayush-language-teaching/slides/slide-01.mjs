import { bg, body, code, footer, pill, title, C } from "./deck-style.mjs";

export async function slide01(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, C.cyan);
  title(slide, ctx, "Teaching Guide for .aayush", "From first line to mini projects");
  body(slide, ctx, "A beginner-friendly programming language with Nepali chat-style keywords and Python-like building blocks.", 60, 165, 630, 86, { fontSize: 28 });
  pill(slide, ctx, "variables", 60, 282, 130, C.cyan);
  pill(slide, ctx, "conditions", 210, 282, 140, C.mint);
  pill(slide, ctx, "loops", 370, 282, 100, C.amber);
  pill(slide, ctx, "functions", 490, 282, 130, C.violet);
  pill(slide, ctx, "lists", 640, 282, 90, C.rose);
  code(slide, ctx, `maan naam chai "Aayush"\nlekh "Namaste " + naam\n\npratek i bhitra sima(1, 4) gara\n    lekh "Round " + i\nsakiyo`, 760, 146, 420, 330, "first-program.aayush");
  body(slide, ctx, "Course outcome: students can read, write, run, debug, and extend .aayush programs.", 60, 520, 820, 64, { fontSize: 24, color: C.muted });
  footer(slide, ctx, 1);
  return slide;
}
