import { bg, card, code, footer, title, C } from "./deck-style.mjs";

export async function slide09(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, C.violet);
  title(slide, ctx, "Functions make reusable ideas");
  code(slide, ctx, `kaam add(a, b)\n    firta a + b\nsakiyo\n\nkaam greet(name)\n    lekh "Namaste " + name\nsakiyo\n\ngreet("Aayush")\nlekh add(4, 6)`, 62, 150, 560, 420, "functions.aayush");
  card(slide, ctx, 690, 170, 420, 120, "kaam", "Starts a function definition. Parameters go inside parentheses.", C.violet);
  card(slide, ctx, 690, 325, 420, 120, "firta", "Returns a value to the place where the function was called.", C.cyan);
  card(slide, ctx, 690, 480, 420, 90, "scope", "Function parameters live inside that function call.", C.amber);
  footer(slide, ctx, 9);
  return slide;
}
