import { bg, card, code, footer, title, C } from "./deck-style.mjs";

export async function slide07(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, C.amber);
  title(slide, ctx, "Loops: repeat work without repeating code");
  code(slide, ctx, `maan count chai 1\njaba_samma count <= 5 gara\n    lekh "Round " + count\n    count chai count + 1\nsakiyo`, 62, 152, 520, 250, "while loop");
  code(slide, ctx, `pratek i bhitra sima(1, 6) gara\n    yedi i % 2 barabar 0 chabhane\n        arko\n    sakiyo\n    lekh "Odd: " + i\nsakiyo`, 640, 152, 520, 250, "for loop");
  card(slide, ctx, 145, 455, 430, 110, "Loop controls", "rok exits a loop early. arko skips the rest of the current loop and moves to the next item.", C.rose);
  card(slide, ctx, 700, 455, 430, 110, "Range helper", "sima(5) gives 0 to 4. sima(1, 6) gives 1 to 5. sima(10, 0, -2) counts down.", C.cyan);
  footer(slide, ctx, 7);
  return slide;
}
