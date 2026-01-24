const { test, expect } = require('@playwright/test');

const DEFAULT_TIMEOUT = 20_000;

async function waitForCocosFrame(page) {
  const deadline = Date.now() + DEFAULT_TIMEOUT;
  while (Date.now() < deadline) {
    for (const frame of page.frames()) {
      try {
        const hasRuntime = await frame.evaluate(() => {
          return !!(window.cc && window.cc.director && window.cc.director.getScene);
        });
        if (hasRuntime) {
          return frame;
        }
      } catch {
        // ignore cross-origin or detached frames
      }
    }
    await page.waitForTimeout(300);
  }
  throw new Error('Cocos runtime not found in any frame');
}

async function waitForCocosReady(frame) {
  await frame.waitForFunction(() => {
    return !!(window.cc && window.cc.director && window.cc.director.getScene);
  }, { timeout: DEFAULT_TIMEOUT });
}

async function waitForComponent(frame, className) {
  await frame.waitForFunction((name) => {
    const cc = window.cc;
    if (!cc?.director?.getScene) return false;
    const scene = cc.director.getScene();
    if (!scene) return false;
    const klass = cc.js?.getClassByName?.(name);
    if (!klass) return false;
    return !!scene.getComponentInChildren(klass);
  }, className, { timeout: DEFAULT_TIMEOUT });
}

async function callComponentMethod(frame, className, methodName, args = []) {
  return frame.evaluate(({ className, methodName, args }) => {
    const cc = window.cc;
    if (!cc) {
      throw new Error('Cocos runtime not found on window.cc');
    }
    const klass = cc.js?.getClassByName?.(className);
    if (!klass) {
      throw new Error(`Component class not found: ${className}`);
    }
    const scene = cc.director?.getScene?.();
    if (!scene) {
      throw new Error('Active scene not found');
    }
    const comp = scene.getComponentInChildren(klass);
    if (!comp) {
      throw new Error(`Component instance not found: ${className}`);
    }
    const fn = comp[methodName];
    if (typeof fn !== 'function') {
      throw new Error(`Method not found on ${className}: ${methodName}`);
    }
    return fn.apply(comp, args);
  }, { className, methodName, args });
}

async function ensureScene(frame, sceneName) {
  await frame.evaluate((name) => {
    const cc = window.cc;
    if (!cc?.director?.loadScene) {
      throw new Error('Cocos director not ready');
    }
    const current = cc.director.getScene?.();
    if (!current || current.name !== name) {
      cc.director.loadScene(name);
    }
  }, sceneName);
}

test('进入游戏 -> 选择关卡 -> 退出到关卡', async ({ page, baseURL }) => {
  await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
  const cocosFrame = await waitForCocosFrame(page);
  await waitForCocosReady(cocosFrame);

  await ensureScene(cocosFrame, 'Login');
  await waitForComponent(cocosFrame, 'LoginController');

  await callComponentMethod(cocosFrame, 'LoginController', 'onLogin');
  await waitForComponent(cocosFrame, 'LevelSelectController');

  await callComponentMethod(cocosFrame, 'LevelSelectController', 'onSelectLevel', [1]);
  await waitForComponent(cocosFrame, 'GameController');

  await callComponentMethod(cocosFrame, 'GameController', 'loadLevelSceneWithBootstrap');
  await waitForComponent(cocosFrame, 'LevelSelectController');

  const activeScene = await cocosFrame.evaluate(() => window.cc?.director?.getScene?.()?.name || '');
  expect(activeScene).toBe('Level');
});
