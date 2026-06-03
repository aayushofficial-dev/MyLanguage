import { bg, code, footer, table, title, C } from "./deck-style.mjs";

export async function slide04(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, C.cyan);
  title(slide, ctx, "Variables, values, and print");
  code(slide, ctx, `maan naam chai "Aayush"\nmaana_ki umer = 18\nrakha active chai sahi\n\nlekh "Name: " + naam\nbol "Age: " + umer\nprint active`, 62, 158, 520, 370, "variables.aayush");
  table(slide, ctx, [
    ["Concept", "Aayush forms"],
    ["Declare / assign", "maan, maan_ki, maana_ki, rakha"],
    ["Print", "lekha, lekh, bol, print"],
    ["Text", "\"double quoted strings\""],
    ["Boolean", "sahi / galat or true / false"],
    ["Comment", "# this line is ignored"],
  ], 638, 150, 540, 58, 170, [C.cyan, C.mint]);
  footer(slide, ctx, 4);
  return slide;
}
