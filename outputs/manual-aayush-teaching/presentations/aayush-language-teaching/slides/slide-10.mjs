import { bg, code, footer, table, title, C } from "./deck-style.mjs";

export async function slide10(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, C.cyan);
  title(slide, ctx, "Input and conversion helpers");
  code(slide, ctx, `maan first chai ank(sodha("First: "))\nmaan second chai ank(sodha("Second: "))\n\nlekh "Total: " + (first + second)\nlekh "As text: " + sabda(first)\nlekh "Type: " + prakaar(first)`, 62, 158, 570, 330, "input.aayush");
  table(slide, ctx, [
    ["Helper", "Meaning"],
    ["sodha / input", "Ask the user for text"],
    ["ank / number", "Convert to number"],
    ["purna / int", "Convert to integer"],
    ["dashamlab / float", "Convert to decimal"],
    ["sabda / str", "Convert to text"],
    ["satya / bool", "Convert to true or false"],
    ["prakaar / type", "Show the value type"],
  ], 680, 132, 470, 52, 175, [C.cyan, C.amber]);
  footer(slide, ctx, 10);
  return slide;
}
