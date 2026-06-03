import { bg, code, footer, table, title, C } from "./deck-style.mjs";

export async function slide06(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, C.mint);
  title(slide, ctx, "Decision making");
  code(slide, ctx, `maan marks chai 76\n\nyedi marks >= 90 chabhane\n    lekh "A grade"\nnatra_yedi marks >= 60 chabhane\n    lekh "Pass"\nnatra\n    lekh "Practice more"\nsakiyo`, 62, 152, 560, 405, "if-elif-else.aayush");
  table(slide, ctx, [
    ["Keyword", "English idea"],
    ["yedi", "if"],
    ["chabhane / bhane", "then"],
    ["natra_yedi", "elif"],
    ["natra", "else"],
    ["sakiyo", "end"],
    ["ra / wa / haina", "and / or / not"],
  ], 680, 156, 475, 58, 160, [C.mint, C.cyan]);
  footer(slide, ctx, 6);
  return slide;
}
