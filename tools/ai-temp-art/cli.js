#!/usr/bin/env node

/**
 * AI 临时美术资源工具（本地）
 * - 输入：SVG（文件或 stdin）
 * - 输出：PNG（可多尺寸）
 *
 * 设计目标：
 * - 只解决“把 AI 生成的 SVG 变成项目可用的 PNG”这一步
 * - 线稿 + 简单填色：由 SVG 内容决定，本工具不做风格化
 */

const fs = require('fs');
const path = require('path');

function usage(exitCode = 0) {
  const text = `
Usage:
  node tools/ai-temp-art/cli.js render --svgFile <file.svg> --name <basename> [--outDir <dir>] [--sizes 128,256]
  cat file.svg | node tools/ai-temp-art/cli.js render --name <basename> [--outDir <dir>] [--sizes 128,256]

Commands:
  render        Render SVG to PNG(s)

Options (render):
  --svgFile     Path to SVG file. If omitted, reads SVG from stdin.
  --name        Output base file name (without extension). Example: cat_01
  --outDir      Output directory. Default: assets/Texture/temp_ai
  --sizes       Comma-separated square sizes. Default: 256
  --quiet       Only print errors.

Examples:
  node tools/ai-temp-art/cli.js render --svgFile temp/cat.svg --name cat_01 --sizes 128,256,512
  cat temp/cat.svg | node tools/ai-temp-art/cli.js render --name cat_01 --outDir assets/Texture/temp_ai --sizes 256
`;
  process.stdout.write(text);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      args._.push(token);
      continue;
    }

    const eqIndex = token.indexOf('=');
    if (eqIndex !== -1) {
      const key = token.slice(2, eqIndex);
      const value = token.slice(eqIndex + 1);
      args[key] = value;
      continue;
    }

    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
    } else {
      args[key] = next;
      i++;
    }
  }
  return args;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readStdinToString() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

function parseSizes(sizesValue) {
  const sizesText = (sizesValue ?? '256').toString().trim();
  if (!sizesText) return [256];
  const sizes = sizesText
    .split(',')
    .map((s) => Number.parseInt(s.trim(), 10))
    .filter((n) => Number.isFinite(n) && n > 0);
  return sizes.length ? Array.from(new Set(sizes)) : [256];
}

function normalizeSvg(svgText) {
  // 一些模型会在前后包裹 ``` 或多余解释，这里做最小清理：
  // - 尝试截取第一个 <svg ...> 到最后一个 </svg>
  const start = svgText.indexOf('<svg');
  const end = svgText.lastIndexOf('</svg>');
  if (start !== -1 && end !== -1) {
    return svgText.slice(start, end + '</svg>'.length).trim();
  }
  return svgText.trim();
}

async function commandRender(args) {
  const quiet = Boolean(args.quiet);
  const outDir = (args.outDir ? String(args.outDir) : 'assets/Texture/temp_ai').trim();
  const name = (args.name ? String(args.name) : '').trim();
  if (!name) {
    if (!quiet) process.stderr.write('Missing required option: --name\n');
    usage(1);
  }

  const sizes = parseSizes(args.sizes);

  let svgText = '';
  if (args.svgFile) {
    const svgFilePath = path.resolve(String(args.svgFile));
    svgText = fs.readFileSync(svgFilePath, 'utf8');
  } else {
    // stdin
    if (process.stdin.isTTY) {
      if (!quiet) process.stderr.write('Missing --svgFile and no stdin provided.\n');
      usage(1);
    }
    svgText = await readStdinToString();
  }

  svgText = normalizeSvg(svgText);
  if (!svgText.includes('<svg')) {
    throw new Error('Input does not look like SVG. Ensure it contains <svg ...>...</svg>.');
  }

  // 延迟 require，避免用户只看 help 时就报依赖错误
  const { Resvg } = require('@resvg/resvg-js');

  const resolvedOutDir = path.resolve(outDir);
  ensureDir(resolvedOutDir);

  const writtenFiles = [];

  for (const size of sizes) {
    const resvg = new Resvg(svgText, {
      fitTo: {
        mode: 'width',
        value: size,
      },
      // 背景透明更利于后续替换/叠加
      background: 'transparent',
    });

    const pngData = resvg.render().asPng();
    const outFile = path.join(resolvedOutDir, `${name}_${size}.png`);
    fs.writeFileSync(outFile, pngData);
    writtenFiles.push(outFile);

    if (!quiet) process.stdout.write(`Wrote: ${outFile}\n`);
  }

  return writtenFiles;
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
    usage(0);
  }

  const args = parseArgs(argv);
  const cmd = args._[0];

  try {
    if (cmd === 'render') {
      await commandRender(args);
      return;
    }

    process.stderr.write(`Unknown command: ${cmd}\n`);
    usage(1);
  } catch (err) {
    const message = err && err.message ? err.message : String(err);
    process.stderr.write(`Error: ${message}\n`);
    process.exit(1);
  }
}

main();
