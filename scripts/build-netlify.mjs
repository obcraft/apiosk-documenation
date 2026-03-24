import { copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const imagesDir = path.join(rootDir, "images");

function normalizeUrl(value) {
  if (!value) return null;

  const trimmed = value.trim().replace(/\/+$/, "");
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("APIO_DOCS_PROXY_TARGET must use http or https");
    }
    return url.toString().replace(/\/+$/, "");
  } catch (error) {
    throw new Error(`Invalid APIO_DOCS_PROXY_TARGET: ${trimmed}`);
  }
}

function ensureDir(dirPath) {
  mkdirSync(dirPath, { recursive: true });
}

function copyIfPresent(fromPath, toPath) {
  if (!existsSync(fromPath)) return;
  ensureDir(path.dirname(toPath));
  copyFileSync(fromPath, toPath);
}

function writePage(filePath, html) {
  ensureDir(path.dirname(filePath));
  writeFileSync(filePath, html, "utf8");
}

function redirectHtml(targetUrl) {
  const escapedUrl = targetUrl.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Apiosk Docs</title>
    <meta http-equiv="refresh" content="0; url=${escapedUrl}" />
    <style>
      :root {
        color-scheme: dark;
        --bg: #020617;
        --panel: rgba(15, 23, 42, 0.82);
        --border: rgba(148, 163, 184, 0.18);
        --text: #e2e8f0;
        --muted: #94a3b8;
        --accent: #38bdf8;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        background:
          radial-gradient(circle at top, rgba(14, 165, 233, 0.22), transparent 38%),
          radial-gradient(circle at bottom right, rgba(37, 99, 235, 0.18), transparent 32%),
          var(--bg);
        color: var(--text);
        font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      }
      main {
        width: min(100%, 680px);
        padding: 32px;
        border: 1px solid var(--border);
        border-radius: 28px;
        background: var(--panel);
        backdrop-filter: blur(18px);
        box-shadow: 0 32px 80px rgba(2, 6, 23, 0.4);
      }
      h1 {
        margin: 0 0 12px;
        font-size: clamp(2rem, 5vw, 3rem);
        line-height: 1;
        letter-spacing: -0.04em;
      }
      p {
        margin: 0 0 12px;
        color: var(--muted);
        line-height: 1.7;
      }
      a {
        color: var(--accent);
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Opening Apiosk Docs</h1>
      <p>Forwarding to the live Mintlify deployment.</p>
      <p><a href="${escapedUrl}">${escapedUrl}</a></p>
    </main>
  </body>
</html>
`;
}

function configErrorHtml() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Apiosk Docs Deploy Config Required</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #020617;
        --panel: rgba(15, 23, 42, 0.84);
        --border: rgba(148, 163, 184, 0.18);
        --text: #e2e8f0;
        --muted: #94a3b8;
        --accent: #38bdf8;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        background:
          radial-gradient(circle at top, rgba(14, 165, 233, 0.22), transparent 38%),
          radial-gradient(circle at bottom right, rgba(37, 99, 235, 0.18), transparent 32%),
          var(--bg);
        color: var(--text);
        font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      }
      main {
        width: min(100%, 760px);
        padding: 32px;
        border: 1px solid var(--border);
        border-radius: 28px;
        background: var(--panel);
        backdrop-filter: blur(18px);
        box-shadow: 0 32px 80px rgba(2, 6, 23, 0.4);
      }
      h1 {
        margin: 0 0 12px;
        font-size: clamp(2rem, 5vw, 3rem);
        line-height: 1;
        letter-spacing: -0.04em;
      }
      p {
        margin: 0 0 12px;
        color: var(--muted);
        line-height: 1.7;
      }
      code {
        display: inline-block;
        padding: 0.15rem 0.4rem;
        border-radius: 10px;
        background: rgba(15, 23, 42, 0.7);
        color: var(--text);
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      }
      ul {
        margin: 16px 0 0;
        padding-left: 20px;
        color: var(--muted);
        line-height: 1.7;
      }
      strong { color: var(--text); }
      a {
        color: var(--accent);
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Docs Deploy Config Required</h1>
      <p>This Netlify site is configured as a front door for the Mintlify docs deployment, but the target origin is missing.</p>
      <p>Set <code>APIO_DOCS_PROXY_TARGET</code> in Netlify to your live Mintlify deployment origin.</p>
      <ul>
        <li>Expected format: <code>https://your-docs-site.mintlify.app</code></li>
        <li>Once set, Netlify will proxy every docs request to that origin.</li>
        <li>This avoids a raw Netlify 404 and keeps <strong>docs.apiosk.com</strong> usable.</li>
      </ul>
    </main>
  </body>
</html>
`;
}

rmSync(distDir, { recursive: true, force: true });
ensureDir(distDir);

copyIfPresent(path.join(imagesDir, "favicon.svg"), path.join(distDir, "images", "favicon.svg"));
copyIfPresent(path.join(imagesDir, "logo-light.svg"), path.join(distDir, "images", "logo-light.svg"));
copyIfPresent(path.join(imagesDir, "logo-dark.svg"), path.join(distDir, "images", "logo-dark.svg"));

const mintlifySiteUrl = normalizeUrl(process.env.APIO_DOCS_PROXY_TARGET);

if (mintlifySiteUrl) {
  writeFileSync(path.join(distDir, "_redirects"), `/* ${mintlifySiteUrl}/:splat 200!\n`, "utf8");
  writePage(path.join(distDir, "index.html"), redirectHtml(mintlifySiteUrl));
  writePage(path.join(distDir, "404.html"), redirectHtml(mintlifySiteUrl));
} else {
  writePage(path.join(distDir, "index.html"), configErrorHtml());
  writePage(path.join(distDir, "404.html"), configErrorHtml());
}
