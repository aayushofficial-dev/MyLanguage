import { bg, footer, table, title, C } from "./deck-style.mjs";

export async function slide14(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, C.mint);
  title(slide, ctx, "One-page keyword cheat sheet");
  table(slide, ctx, [
    ["Task", "Aayush words"],
    ["Create or update", "maan, maan_ki, maana_ki, rakha, chai"],
    ["Show output", "lekh, lekha, bol, print"],
    ["Choose", "yedi, natra_yedi, natra, bhane, chabhane, sakiyo"],
    ["Repeat", "jaba_samma, pratek, bhitra, gara, rok, arko"],
    ["Functions", "kaam, firta"],
    ["Truth", "sahi, galat, ra, wa, haina"],
  ], 72, 150, 540, 66, 165, [C.mint, C.cyan]);
  table(slide, ctx, [
    ["Helper", "What learners should remember"],
    ["sodha(text)", "Ask the user a question and get text back"],
    ["ank(value)", "Convert text into a number"],
    ["sima(start, stop)", "Make counting values for a loop"],
    ["lambai(value)", "Count items in text or a list"],
    ["thap(list, value)", "Add one item to the end of a list"],
    ["prakaar(value)", "Check the value type while debugging"],
  ], 672, 150, 520, 66, 165, [C.amber, C.rose]);
  footer(slide, ctx, 14);
  return slide;
}
