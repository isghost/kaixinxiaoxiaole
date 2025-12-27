import { director, Node, Label, Graphics, Canvas, Color, color, v2, tween } from 'cc';

//一个简单的tost组件，用法：
// import Toast from './Toast'
// Toast(text,{gravity,duration,bg_color})
//text:要显示的字符串
//gravity(可选):位置，String类型，可选值('CENTER','TOP','BOTTOM'),默认为'CENTER'
//duration(可选):时间，Number类型，单位为秒，默认1s
//bg_color(可选):颜色，Color类型，默认color(102, 102, 102, 200)

export interface ToastOptions {
  gravity?: "CENTER" | "TOP" | "BOTTOM";
  duration?: number;
  bg_color?: Color;
}

function Toast(
  text: string = "",
  {
    gravity = "CENTER",
    duration = 1,
    bg_color = color(102, 102, 102, 200)
  }: ToastOptions = {}
): void {
  // canvas
  let canvas = director.getScene()!.getComponentInChildren(Canvas);
  if (!canvas) return;
  
  let width = canvas.node.width;
  let height = canvas.node.height;

  let bgNode = new Node();

  // Label文本格式设置
  let textNode = new Node();
  let textLabel = textNode.addComponent(Label);
  textLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
  textLabel.verticalAlign = Label.VerticalAlign.CENTER;
  textLabel.fontSize = 30;
  textLabel.string = text;

  // 当文本宽度过长时，设置为自动换行格式
  if (text.length * textLabel.fontSize > (width * 3) / 5) {
    textNode.width = (width * 3) / 5;
    textLabel.overflow = Label.Overflow.RESIZE_HEIGHT;
  } else {
    textNode.width = text.length * textLabel.fontSize;
  }
  let lineCount =
    ~~((text.length * textLabel.fontSize) / ((width * 3) / 5)) + 1;
  textNode.height = textLabel.fontSize * lineCount;

  // 背景设置
  let ctx = bgNode.addComponent(Graphics);
  ctx.arc(
    -textNode.width / 2,
    0,
    textNode.height / 2 + 20,
    0.5 * Math.PI,
    1.5 * Math.PI,
    true
  );
  ctx.lineTo(textNode.width / 2, -(textNode.height / 2 + 20));
  ctx.arc(
    textNode.width / 2,
    0,
    textNode.height / 2 + 20,
    1.5 * Math.PI,
    0.5 * Math.PI,
    true
  );
  ctx.lineTo(-textNode.width / 2, textNode.height / 2 + 20);
  ctx.fillColor = bg_color;
  ctx.fill();

  bgNode.addChild(textNode);

  // gravity 设置Toast显示的位置
  const pos = bgNode.position;
  if (gravity === "CENTER") {
    bgNode.setPosition(0, 0);
  } else if (gravity === "TOP") {
    bgNode.setPosition(0, (height / 5) * 2);
  } else if (gravity === "BOTTOM") {
    bgNode.setPosition(0, -(height / 5) * 2);
  }

  canvas.node.addChild(bgNode);

  // Use Cocos Creator 3.x tween API
  const uiOpacity = bgNode.addComponent('cc.UIOpacity') as any;
  tween(uiOpacity)
    .delay(duration)
    .to(0.3, { opacity: 0 })
    .call(() => {
      bgNode.destroy();
    })
    .start();
}

export default Toast;