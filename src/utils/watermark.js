/**
 * 水印工具函数
 * @param {Object} options 水印配置选项
 * @param {string} options.text 水印文本
 * @param {boolean} options.enableUserName 是否包含用户名
 * @param {string} options.color 水印颜色
 * @param {string} options.font 水印字体
 * @param {number} options.fontSize 水印字体大小
 * @param {number} options.rotate 水印旋转角度
 * @param {number} options.spacingX 水平间距
 * @param {number} options.spacingY 垂直间距
 */
export function createWatermark(options = {}) {
  const {
    text = 'WES Admin',
    enableUserName = false,
    color = 'rgba(0, 0, 0, 0.1)',
    font = '16px sans-serif',
    fontSize = 16,
    rotate = -15,
    spacingX = 200,
    spacingY = 150
  } = options;

  // 获取用户名（这里需要根据实际项目的用户信息获取方式进行调整）
  const userName = enableUserName ? (localStorage.getItem('userName') || 'admin') : '';
  const watermarkText = userName ? `${text}\n${userName}` : text;

  // 创建Canvas元素
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // 设置Canvas尺寸（考虑水印文本的长度、字体大小和旋转角度）
  ctx.font = font;
  const lines = watermarkText.split('\n');
  const maxLineWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
  const totalTextHeight = fontSize * 1.5 * lines.length;

  // 计算旋转后的画布尺寸，确保文本完全可见
  const radians = (rotate * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const rotatedWidth = maxLineWidth * cos + totalTextHeight * sin;
  const rotatedHeight = maxLineWidth * sin + totalTextHeight * cos;

  // 设置Canvas尺寸为旋转后的实际大小，并确保不小于指定的间距
  canvas.width = Math.max(rotatedWidth, spacingX);
  canvas.height = Math.max(rotatedHeight, spacingY);

  // 绘制水印
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // 将原点移动到合适位置，确保旋转后的文本居中显示在Canvas内
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(radians);
  ctx.translate(-maxLineWidth / 2, -totalTextHeight / 2);

  // 绘制多行文本
  lines.forEach((line, index) => {
    ctx.fillText(line, 0, index * fontSize * 1.5);
  });

  // 将Canvas转换为base64图片
  const base64Url = canvas.toDataURL('image/png');

  // 创建或更新水印元素
  let watermarkElement = document.getElementById('watermark');
  if (!watermarkElement) {
    watermarkElement = document.createElement('div');
    watermarkElement.id = 'watermark';
    document.body.appendChild(watermarkElement);
  }

  // 设置水印样式
  Object.assign(watermarkElement.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '9999',
    backgroundImage: `url(${base64Url})`,
    backgroundRepeat: 'repeat'
  });

  return watermarkElement;
}

/**
 * 移除水印
 */
export function removeWatermark() {
  const watermarkElement = document.getElementById('watermark');
  if (watermarkElement) {
    document.body.removeChild(watermarkElement);
  }
}

/**
 * 显示水印
 * @param {Object} options 水印配置选项
 */
export function showWatermark(options = {}) {
  return createWatermark(options);
}

/**
 * 隐藏水印
 */
export function hideWatermark() {
  removeWatermark();
}