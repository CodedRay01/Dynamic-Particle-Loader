let maple = document.getElementById("mapleCanvas");
// setTimeout(() => {
//     maple.style.display = "none"
// }, 20000); //timeout of loader
const canvas = document.getElementById("mapleCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const dots = [];
const mapleImage = new Image();
mapleImage.src = "https://codedray01.github.io/Dynamic-Particle-Loader/loader.svg";

mapleImage.onload = function () {
  createDots();
};

function createDots() {
  const imageWidth = 300;
  const imageHeight = 300;
  const startX = (canvas.width - imageWidth) / 2;
  const startY = (canvas.height - imageHeight) / 2;

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = imageWidth;
  tempCanvas.height = imageHeight;
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.drawImage(mapleImage, 0, 0, imageWidth, imageHeight);

  setTimeout(() => {
    const imageData = tempCtx.getImageData(0, 0, imageWidth, imageHeight);
    const data = imageData.data;

    for (let y = 0; y < imageHeight; y += 2) {
      for (let x = 0; x < imageWidth; x += 2) {
        const index = (y * imageWidth + x) * 4;
        const alpha = data[index + 3];
        if (alpha > 128) {
          dots.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            targetX: startX + x,
            targetY: startY + y,
            alpha: 0,
            speedX: (Math.random() - 0.5) * 2,
            speedY: Math.random() * -3,
          });
        }
      }
    }
    animateDots();
  }, 100);
}

function animateDots() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let allDotsArrived = true;
  dots.forEach((dot) => {
    dot.x += (dot.targetX - dot.x) * 0.02;
    dot.y += (dot.targetY - dot.y) * 0.02;
    dot.alpha = Math.min(dot.alpha + 0.02, 1);
    ctx.fillStyle = `rgba(239, 173, 1, ${dot.alpha})`;      // rgba(255, 0, 0, ${dot.alpha})
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2);
    ctx.fill();

    if (
      Math.abs(dot.x - dot.targetX) > 0.5 ||
      Math.abs(dot.y - dot.targetY) > 0.5
    ) {
      allDotsArrived = false;
    }
  });
  if (!allDotsArrived) {
    requestAnimationFrame(animateDots);
  } else {
    blowAwayDots();
  }
}

function blowAwayDots() {
  function animateBlowAway() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let allDotsGone = true;
    dots.forEach((dot) => {
      dot.x += dot.speedX;
      dot.y += dot.speedY;
      dot.speedY -= 0.02;
      dot.alpha -= 0.02;

      if (dot.alpha > 0) {
        ctx.fillStyle = `rgba(239, 173, 1, ${dot.alpha})`;    // rgba(255, 0, 0, ${dot.alpha})
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2);
        ctx.fill();
        allDotsGone = false;
      }
    });

    if (!allDotsGone) {
      requestAnimationFrame(animateBlowAway);
    } else {
      dots.length = 0;
      setTimeout(createDots, 1000);
    }
  }
  animateBlowAway();
}
