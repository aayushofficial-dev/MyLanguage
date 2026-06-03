import { bg, code, footer, table, title, C } from "./deck-style.mjs";

export async function slide05(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, C.violet);
  title(slide, ctx, "Operators and expressions");
  code(slide, ctx, `maan a chai 10\nmaan b chai 3\n\nlekh a + b\nlekh a - b\nlekh a * b\nlekh a / b\nlekh a % b\nlekh a ** b\nlekh a barabar b`, 62, 156, 500, 405, "operators.aayush");
  table(slide, ctx, [
    ["Operator", "Meaning"],
    ["+", "Add numbers or join text"],
    ["-", "Subtract"],
    ["*", "Multiply"],
    ["/", "Divide"],
    ["%", "Remainder"],
    ["**", "Power"],
    ["barabar / ==", "Equality test"],
  ], 640, 148, 500, 50, 160, [C.violet, C.amber]);
  footer(slide, ctx, 5);
  return slide;
}
