import { bg, card, footer, title, C } from "./deck-style.mjs";

export async function slide12(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, C.amber);
  title(slide, ctx, "Classroom path and practice projects");
  card(slide, ctx, 70, 155, 330, 150, "Lesson 1", "Print, variables, strings, numbers, and comments. Project: personal introduction card.", C.cyan);
  card(slide, ctx, 475, 155, 330, 150, "Lesson 2", "Operators, input, conversion, and conditions. Project: calculator with validation.", C.mint);
  card(slide, ctx, 880, 155, 330, 150, "Lesson 3", "While loops, for loops, range, break, and continue. Project: number guessing game.", C.amber);
  card(slide, ctx, 270, 370, 330, 150, "Lesson 4", "Lists, indexes, append, pop, and totals. Project: marks tracker.", C.rose);
  card(slide, ctx, 680, 370, 330, 150, "Lesson 5", "Functions, parameters, returns, and clean structure. Project: menu-driven toolkit.", C.violet);
  footer(slide, ctx, 12);
  return slide;
}
