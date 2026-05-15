const fileInput = document.getElementById('fileInput');
const sourceImg = document.getElementById('sourceImg');
const sourceWrap = document.getElementById('sourceWrap');
const selection = document.getElementById('selection');
const previewCanvas = document.getElementById('previewCanvas');
const ctx = previewCanvas.getContext('2d');
const updateBtn = document.getElementById('updateBtn');

const selSize = 320;
let selX = 0,
  selY = 0;
let dragging = false;
let imgLoaded = false;
let naturalW = 0,
  naturalH = 0;
let displayW = 0,
  displayH = 0;

// 加载图片
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  sourceImg.onload = () => {
    naturalW = sourceImg.naturalWidth;
    naturalH = sourceImg.naturalHeight;
    displayW = sourceImg.clientWidth;
    displayH = sourceImg.clientHeight;
    imgLoaded = true;
    selX = Math.floor(naturalW / 2 - selSize / 2);
    selY = Math.floor(naturalH / 2 - selSize / 2);
    clampSel();
    renderSelection();
    renderPreview();
  };
  sourceImg.src = url;
});

function mouseToImg(e) {
  const rect = sourceWrap.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const scaleX = naturalW / displayW;
  const scaleY = naturalH / displayH;
  return { x: mx * scaleX, y: my * scaleY };
}

function clampSel() {
  selX = Math.max(0, Math.min(selX, naturalW - selSize));
  selY = Math.max(0, Math.min(selY, naturalH - selSize));
}

function renderSelection() {
  if (!imgLoaded) return;
  const scaleX = displayW / naturalW;
  const scaleY = displayH / naturalH;
  selection.style.display = 'block';
  selection.style.left = selX * scaleX + 'px';
  selection.style.top = selY * scaleY + 'px';
  selection.style.width = selSize * scaleX + 'px';
  selection.style.height = selSize * scaleY + 'px';
}

function renderPreview() {
  if (!imgLoaded) return;
  ctx.clearRect(0, 0, 300, 300);
  ctx.drawImage(sourceImg, selX, selY, selSize, selSize, 0, 0, 300, 300);
}

sourceWrap.addEventListener('mousedown', (e) => {
  e.preventDefault();
  if (!imgLoaded) return;
  dragging = true;
  const p = mouseToImg(e);
  selX = p.x - selSize / 2;
  selY = p.y - selSize / 2;
  clampSel();
  renderSelection();
  renderPreview();
});

document.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  const p = mouseToImg(e);
  selX = p.x - selSize / 2;
  selY = p.y - selSize / 2;
  clampSel();
  renderSelection();
  renderPreview();
});

document.addEventListener('mouseup', () => {
  dragging = false;
});

updateBtn.addEventListener('click', () => {
  if (!imgLoaded) return;
  previewCanvas.toBlob((blob) => {
    const file = new File([blob], 'preview_' + Date.now() + '.png', { type: 'image/png' });
    console.log('预览图片 File 对象:', file);
    console.log('  name:', file.name);
    console.log('  size:', file.size, 'bytes');
    console.log('  type:', file.type);
  }, 'image/png');
});
