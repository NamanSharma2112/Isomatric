# Review

A figure is reviewed by looking at it. The source can look right while the render is wrong, and the person who asked will zoom in.

## Capture

Run the site (`pnpm dev` or `pnpm build && pnpm start`) and capture with Playwright:

```js
// node shots.js <slug>
const { chromium } = require("playwright");
const slug = process.argv[2];
(async () => {
  const browser = await chromium.launch();
  for (const scheme of ["light", "dark"]) {
    for (const width of [1100, 390]) {
      const page = await (await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: scheme, deviceScaleFactor: 2 })).newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      await page.goto(`http://localhost:3000/figures/${slug}`);
      await page.evaluate((s) => document.documentElement.classList.toggle("dark", s === "dark"), scheme);
      const plate = page.locator(".iso-plate").first();
      for (const at of [400, 1400, 2600]) {                  // several moments of the motion
        await page.waitForTimeout(at);
        await plate.screenshot({ path: `${slug}-${scheme}-${width}-${at}.png` });
      }
      await page.getByRole("button", { name: /apart/i }).first().click();
      await page.waitForTimeout(1500);
      await plate.screenshot({ path: `${slug}-${scheme}-${width}-apart.png` });
      console.log(scheme, width, errors);
    }
  }
  await browser.close();
})();
```

Also capture with `reducedMotion: "reduce"` in the context options, and once while hovering (a tour pauses there).

Read every image. Stitching the shots for one figure into a grid (`ffmpeg … hstack/vstack`) makes them faster to compare.

## Checklist

**Object**
- [ ] It is instantly a real object, and you can say in one sentence what moves and what that means.
- [ ] 40+ parts; every part rests on another part; no floating slabs.
- [ ] At 4×, every region has something true in it; no bare face, no empty corner.

**Drawing**
- [ ] Solids only: nothing shows through anything, no dashed hidden edges.
- [ ] Painter's order holds in every moment of the motion: nothing in front is covered by something behind.
- [ ] Every line ends on a face, a line or a dot (or is a `free` rule line, needle tail or pointer tip).
- [ ] Tones follow the table: base `lo`, structure `mid`, subject `hi`, exactly one `lit`.
- [ ] No text in the drawing beyond one engraved label or the subject's own legends.

**Truth**
- [ ] The readout is read from the parts and agrees with what is drawn at that instant.
- [ ] Every number in the caption and readout comes from the model; invented data is called a worked example.

**Motion and input**
- [ ] Eased or sprung, slow enough to follow, nothing snaps.
- [ ] Stops offscreen; parks when settled.
- [ ] Reduced motion: still, but still responds.
- [ ] Keyboard works with a visible focus ring; the label explains the controls.

**Teardown**
- [ ] Layers rise in assembly order; zero gap rebuilds the figure exactly.
- [ ] Every leader lands on its part; no label is left behind by a moving part; no name is clipped.

**Themes and sizes**
- [ ] Light and dark both read; every colour is a token.
- [ ] At 390 px it still reads (scale to ~112% in an `overflow: hidden` wrapper if needed).
- [ ] No console errors.

Fix the largest visible fault first, recapture, and look at the changed region and the whole figure again.
