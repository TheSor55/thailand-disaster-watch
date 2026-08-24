import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const cssPath = resolve(process.cwd(), 'src/styles/globals.css');

describe('responsive safety contracts', () => {
  it('retains phone, tablet, desktop, and iOS safe-area rules', async () => {
    const css = await readFile(cssPath, 'utf8');
    expect(css).toMatch(/@media \(max-width: 1180px\)/);
    expect(css).toMatch(/@media \(max-width: 800px\)/);
    expect(css).toMatch(/@media \(max-width: 540px\)/);
    expect(css).toMatch(/env\(safe-area-inset-bottom\)/);
    expect(css).toMatch(/env\(safe-area-inset-top\)/);
    expect(css).toMatch(/100dvh/);
    expect(css).toMatch(/\.map-column \{ min-width: 0;/);
    expect(css).toMatch(/body \{ overflow-x: hidden;/);
  });

  it('keeps the 320px project floor and mobile sheets inside the viewport', async () => {
    const css = await readFile(cssPath, 'utf8');
    expect(css).toMatch(/html, body, #root \{ min-width: 320px;/);
    expect(css).toMatch(/\.mobile-sheet \{ width: 100%;/);
    expect(css).toMatch(/max-height: min\(78dvh, 680px\)/);
    expect(css).toMatch(/overflow-y: auto/);
    expect(css).toMatch(/overscroll-behavior: contain/);
    expect(css).toMatch(/@media \(pointer: coarse\)/);
  });

  it('documents the approved viewport matrix in the quality gate', async () => {
    const matrix = await readFile(
      resolve(process.cwd(), 'docs/MOBILE-QUALITY-GATE.md'),
      'utf8',
    );
    for (const width of [320, 360, 375, 390, 414, 430, 768, 820, 1024, 1280, 1440, 1920]) {
      expect(matrix).toContain(String(width));
    }
  });
});
