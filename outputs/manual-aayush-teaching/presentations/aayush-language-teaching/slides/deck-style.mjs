export const C = {
  ink: "#111827",
  paper: "#F8FAFC",
  night: "#0F172A",
  panel: "#182235",
  panel2: "#22314A",
  mint: "#22C55E",
  cyan: "#38BDF8",
  amber: "#F59E0B",
  rose: "#FB7185",
  violet: "#A78BFA",
  line: "#334155",
  muted: "#CBD5E1",
  white: "#FFFFFF",
};

export function title(slide, ctx, text, kicker = "Aayush Language") {
  ctx.addText(slide, {
    text: kicker.toUpperCase(),
    x: 58,
    y: 34,
    w: 420,
    h: 22,
    fontSize: 15,
    color: C.cyan,
    bold: true,
  });
  ctx.addText(slide, {
    text,
    x: 56,
    y: 62,
    w: 850,
    h: 74,
    fontSize: 38,
    color: C.white,
    bold: true,
    typeface: ctx.fonts.title,
  });
}

export function bg(slide, ctx, accent = C.cyan) {
  ctx.addShape(slide, { x: 0, y: 0, w: ctx.W, h: ctx.H, fill: C.night });
  ctx.addShape(slide, { x: 0, y: 0, w: 10, h: ctx.H, fill: accent });
  ctx.addShape(slide, { x: 56, y: 650, w: 1168, h: 1, fill: C.line });
}

export function footer(slide, ctx, n) {
  ctx.addText(slide, {
    text: String(n).padStart(2, "0"),
    x: 1164,
    y: 660,
    w: 60,
    h: 28,
    fontSize: 14,
    color: C.muted,
    align: "right",
  });
}

export function body(slide, ctx, text, x, y, w, h, opts = {}) {
  return ctx.addText(slide, {
    text,
    x,
    y,
    w,
    h,
    fontSize: opts.fontSize || 24,
    color: opts.color || C.paper,
    bold: opts.bold || false,
    insets: opts.insets || { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

export function pill(slide, ctx, text, x, y, w, color) {
  ctx.addShape(slide, {
    x,
    y,
    w,
    h: 34,
    fill: color,
    line: ctx.line("#00000000", 0),
  });
  ctx.addText(slide, {
    text,
    x: x + 12,
    y: y + 7,
    w: w - 24,
    h: 18,
    fontSize: 14,
    color: C.night,
    bold: true,
    align: "center",
  });
}

export function card(slide, ctx, x, y, w, h, label, text, color = C.cyan) {
  ctx.addShape(slide, {
    x,
    y,
    w,
    h,
    fill: C.panel,
    line: ctx.line(C.line, 1),
  });
  ctx.addShape(slide, { x, y, w: 6, h, fill: color });
  ctx.addText(slide, {
    text: label,
    x: x + 22,
    y: y + 20,
    w: w - 44,
    h: 24,
    fontSize: 18,
    color,
    bold: true,
  });
  ctx.addText(slide, {
    text,
    x: x + 22,
    y: y + 56,
    w: w - 44,
    h: h - 72,
    fontSize: 21,
    color: C.paper,
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

export function code(slide, ctx, text, x, y, w, h, label = ".aayush") {
  ctx.addShape(slide, {
    x,
    y,
    w,
    h,
    fill: "#0B1220",
    line: ctx.line("#475569", 1),
  });
  ctx.addShape(slide, { x, y, w, h: 34, fill: "#162033" });
  ctx.addText(slide, {
    text: label,
    x: x + 16,
    y: y + 8,
    w: w - 32,
    h: 18,
    fontSize: 13,
    color: C.muted,
    bold: true,
  });
  ctx.addText(slide, {
    text,
    x: x + 20,
    y: y + 48,
    w: w - 40,
    h: h - 62,
    fontSize: 19,
    color: "#E2E8F0",
    typeface: ctx.fonts.mono,
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

export function table(slide, ctx, rows, x, y, w, rowH, colW, colors = [C.cyan, C.mint]) {
  rows.forEach((row, i) => {
    const yy = y + i * rowH;
    ctx.addShape(slide, {
      x,
      y: yy,
      w,
      h: rowH,
      fill: i === 0 ? C.panel2 : C.panel,
      line: ctx.line(C.line, 1),
    });
    row.forEach((cell, j) => {
      ctx.addText(slide, {
        text: cell,
        x: x + (j === 0 ? 18 : colW + 18),
        y: yy + 10,
        w: (j === 0 ? colW : w - colW) - 28,
        h: rowH - 16,
        fontSize: i === 0 ? 17 : 16,
        color: i === 0 ? colors[j] || C.cyan : C.paper,
        bold: i === 0,
      });
    });
  });
}
