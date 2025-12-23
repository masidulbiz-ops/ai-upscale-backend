const folderInput = document.getElementById("folderInput");
const startBtn = document.getElementById("start");
const downloads = document.getElementById("downloads");
const status = document.getElementById("status");

startBtn.onclick = async () => {
  const files = [...folderInput.files];
  if (!files.length) return alert("Select a folder with images");

  downloads.innerHTML = "";
  status.textContent = "Processing...";

  const scale = Number(document.getElementById("scale").value);
  const sharp = Number(document.getElementById("sharpness").value);
  const noise = Number(document.getElementById("noise").value);

  for (const file of files) {
    if (!file.type.startsWith("image")) continue;

    const img = await loadImage(file);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.filter = `
      blur(${noise}px)
      contrast(${1 + sharp})
    `;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = file.name.replace(/\.(jpg|jpeg|png)$/i, "_UPSCALED.png");
    link.textContent = link.download;

    downloads.appendChild(link);
  }

  status.textContent = "Done ✔ Download images below";
};

function loadImage(file) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = URL.createObjectURL(file);
  });
}
