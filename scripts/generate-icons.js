/**
 * Script para generar íconos PWA en diferentes tamaños
 *
 * Requisitos:
 * npm install sharp
 *
 * Uso:
 * node scripts/generate-icons.js ruta/a/tu/icono-original.png
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Tamaños necesarios para PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons(inputPath) {
  // Crear carpeta de íconos si no existe
  const iconsDir = path.join(__dirname, "../public/icons");
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  console.log("🎨 Generando íconos PWA...\n");

  for (const size of sizes) {
    const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);

    try {
      await sharp(inputPath)
        .resize(size, size, {
          fit: "contain",
          background: { r: 113, g: 154, b: 10, alpha: 1 }, // Color primario #719a0a
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ Generado: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`❌ Error generando ${size}x${size}:`, error.message);
    }
  }

  // Generar íconos adicionales para shortcuts
  console.log("\n🔗 Generando íconos para shortcuts...");

  try {
    await sharp(inputPath)
      .resize(96, 96)
      .png()
      .toFile(path.join(iconsDir, "shortcut-menu.png"));
    console.log("✅ Generado: shortcut-menu.png");

    await sharp(inputPath)
      .resize(96, 96)
      .png()
      .toFile(path.join(iconsDir, "shortcut-orders.png"));
    console.log("✅ Generado: shortcut-orders.png");
  } catch (error) {
    console.error("❌ Error generando shortcuts:", error.message);
  }

  console.log("\n✨ ¡Íconos generados exitosamente!");
  console.log("📁 Ubicación: public/icons/");
  console.log("\n💡 Siguiente paso: Actualizar manifest.json y layout.tsx");
}

// Obtener ruta del archivo de entrada
const inputPath = process.argv[2];

if (!inputPath) {
  console.error("❌ Error: Debes proporcionar la ruta del ícono original");
  console.log("\nUso:");
  console.log("  node scripts/generate-icons.js ruta/a/tu/icono.png");
  process.exit(1);
}

if (!fs.existsSync(inputPath)) {
  console.error(`❌ Error: El archivo "${inputPath}" no existe`);
  process.exit(1);
}

generateIcons(inputPath);
