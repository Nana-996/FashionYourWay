/**
 * Logo Image Adapter & Canvas Processing Engine
 * Provides client-side utilities for:
 * - Smart background transparency / keying (removes solid white or black backgrounds)
 * - Cropping, Scaling, Panning, and Rotation
 * - Luxury metallic filters (Gold foil, Rose blush, Crisp white, High contrast)
 * - Monogram atelier emblem generation
 * - Dynamic browser tab favicon updates
 */

/**
 * Process an image source with canvas transformations and optional background removal
 */
export const processLogoImage = async ({
  imageSrc,
  scale = 100,
  offsetX = 0,
  offsetY = 0,
  rotation = 0,
  cropShape = 'circle', // 'circle' | 'square' | 'rounded' | 'banner' | 'natural'
  removeBg = false,
  bgTolerance = 25, // 0-100 tolerance for white/light color removal
  bgTarget = 'white', // 'white' | 'black'
  canvasSize = 400
}) => {
  return new Promise((resolve, reject) => {
    if (!imageSrc) {
      resolve(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          resolve(imageSrc);
          return;
        }

        ctx.clearRect(0, 0, canvasSize, canvasSize);

        // Center point
        const cx = canvasSize / 2;
        const cy = canvasSize / 2;

        ctx.save();
        ctx.translate(cx + (offsetX * (canvasSize / 200)), cy + (offsetY * (canvasSize / 200)));
        ctx.rotate((rotation * Math.PI) / 180);

        // Calculate aspect-ratio fit
        const zoom = scale / 100;
        let drawWidth = canvasSize * zoom;
        let drawHeight = canvasSize * zoom;

        const imgAspect = img.width / img.height;
        if (imgAspect > 1) {
          drawHeight = drawWidth / imgAspect;
        } else {
          drawWidth = drawHeight * imgAspect;
        }

        ctx.drawImage(
          img,
          -drawWidth / 2,
          -drawHeight / 2,
          drawWidth,
          drawHeight
        );
        ctx.restore();

        // Optional Smart Background Removal (Color Keying)
        if (removeBg) {
          const imgData = ctx.getImageData(0, 0, canvasSize, canvasSize);
          const data = imgData.data;
          const threshold = (bgTolerance / 100) * 255;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            if (a === 0) continue;

            if (bgTarget === 'white') {
              // Check if pixel is close to white/light grey
              const brightness = (r + g + b) / 3;
              const maxDiff = Math.max(Math.abs(r - g), Math.abs(r - b), Math.abs(g - b));
              if (brightness > (255 - threshold) && maxDiff < 30) {
                // Soft alpha feathering near edges
                const alphaFactor = Math.max(0, (255 - brightness) / threshold);
                data[i + 3] = Math.round(a * Math.pow(alphaFactor, 1.5));
              }
            } else if (bgTarget === 'black') {
              // Check if pixel is close to black/dark grey
              const brightness = (r + g + b) / 3;
              const maxDiff = Math.max(Math.abs(r - g), Math.abs(r - b), Math.abs(g - b));
              if (brightness < threshold && maxDiff < 30) {
                const alphaFactor = Math.max(0, brightness / threshold);
                data[i + 3] = Math.round(a * Math.pow(alphaFactor, 1.5));
              }
            }
          }

          ctx.putImageData(imgData, 0, 0);
        }

        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        console.warn('Canvas processing error, using fallback image', err);
        resolve(imageSrc);
      }
    };

    img.onerror = () => {
      resolve(imageSrc);
    };

    img.src = imageSrc;
  });
};

/**
 * Generate a luxury typographic Monogram Emblem on canvas
 */
export const generateMonogramLogo = ({
  initials = 'FYW',
  fontStyle = 'serif', // 'serif' | 'script' | 'modern' | 'geometric'
  crestStyle = 'wreath', // 'wreath' | 'circle' | 'diamond' | 'shield' | 'minimal'
  colorScheme = 'gold', // 'gold' | 'rose' | 'white' | 'burgundy'
  size = 400
}) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const cx = size / 2;
  const cy = size / 2;

  // Colors
  const colors = {
    gold: {
      primary: '#D4AF37',
      gradientStart: '#FFF5D6',
      gradientMid: '#D4AF37',
      gradientEnd: '#997A15',
      glow: 'rgba(212, 175, 55, 0.4)'
    },
    rose: {
      primary: '#E8A598',
      gradientStart: '#FFF0ED',
      gradientMid: '#E8A598',
      gradientEnd: '#B33D62',
      glow: 'rgba(232, 165, 152, 0.4)'
    },
    white: {
      primary: '#FFFFFF',
      gradientStart: '#FFFFFF',
      gradientMid: '#F5CCD4',
      gradientEnd: '#D1D5DB',
      glow: 'rgba(255, 255, 255, 0.4)'
    },
    burgundy: {
      primary: '#B33D62',
      gradientStart: '#F7D6DC',
      gradientMid: '#B33D62',
      gradientEnd: '#4A0E23',
      glow: 'rgba(179, 61, 98, 0.4)'
    }
  }[colorScheme] || {
    primary: '#D4AF37',
    gradientStart: '#FFF5D6',
    gradientMid: '#D4AF37',
    gradientEnd: '#997A15',
    glow: 'rgba(212, 175, 55, 0.4)'
  };

  // Gradient
  const grad = ctx.createLinearGradient(0, 50, size, size - 50);
  grad.addColorStop(0, colors.gradientStart);
  grad.addColorStop(0.5, colors.gradientMid);
  grad.addColorStop(1, colors.gradientEnd);

  // Draw Crest Framing
  ctx.strokeStyle = grad;
  ctx.lineWidth = size * 0.022;

  if (crestStyle === 'circle') {
    // Outer double ring
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.44, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = size * 0.008;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.39, 0, Math.PI * 2);
    ctx.stroke();
  } else if (crestStyle === 'diamond') {
    ctx.beginPath();
    ctx.moveTo(cx, size * 0.08);
    ctx.lineTo(size * 0.92, cy);
    ctx.lineTo(cx, size * 0.92);
    ctx.lineTo(size * 0.08, cy);
    ctx.closePath();
    ctx.stroke();

    ctx.lineWidth = size * 0.008;
    ctx.beginPath();
    ctx.moveTo(cx, size * 0.14);
    ctx.lineTo(size * 0.86, cy);
    ctx.lineTo(cx, size * 0.86);
    ctx.lineTo(size * 0.14, cy);
    ctx.closePath();
    ctx.stroke();
  } else if (crestStyle === 'shield') {
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.36, cy - size * 0.36);
    ctx.lineTo(cx + size * 0.36, cy - size * 0.36);
    ctx.lineTo(cx + size * 0.36, cy + size * 0.05);
    ctx.quadraticCurveTo(cx + size * 0.36, cy + size * 0.42, cx, cy + size * 0.45);
    ctx.quadraticCurveTo(cx - size * 0.36, cy + size * 0.42, cx - size * 0.36, cy + size * 0.05);
    ctx.closePath();
    ctx.stroke();
  } else if (crestStyle === 'wreath') {
    // Classic luxury laurel wreath arcs
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.42, 0.4 * Math.PI, 1.6 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.42, 1.4 * Math.PI, 0.6 * Math.PI, true);
    ctx.stroke();

    // Little luxury star top and bottom
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, size * 0.12, size * 0.02, 0, Math.PI * 2);
    ctx.arc(cx, size * 0.88, size * 0.02, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw Monogram Typography
  ctx.fillStyle = grad;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const cleanInitials = initials.toUpperCase().slice(0, 4);
  const charCount = cleanInitials.length;

  let fontSize = size * 0.38;
  if (charCount >= 3) fontSize = size * 0.28;
  if (charCount >= 4) fontSize = size * 0.22;

  let fontFam = "'Playfair Display', Georgia, serif";
  if (fontStyle === 'script') fontFam = "'Cormorant Garamond', 'Great Vibes', cursive, serif";
  if (fontStyle === 'modern') fontFam = "'Cinzel', 'Trajan Pro', serif";
  if (fontStyle === 'geometric') fontFam = "'Montserrat', 'Inter', sans-serif";

  ctx.font = `700 ${fontSize}px ${fontFam}`;
  ctx.shadowColor = colors.glow;
  ctx.shadowBlur = 12;

  // Render centered initials
  ctx.fillText(cleanInitials, cx, cy + (fontSize * 0.06));

  return canvas.toDataURL('image/png');
};

/**
 * Update the dynamic browser favicon
 */
export const updateBrowserFavicon = (logoDataUrl, storeName) => {
  try {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }

    if (logoDataUrl) {
      link.href = logoDataUrl;
    }

    if (storeName) {
      document.title = `${storeName} | Haute Couture & Ready-to-Wear`;
    }
  } catch (e) {
    console.warn('Favicon update error', e);
  }
};
