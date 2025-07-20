const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const inputDir = path.join(__dirname, "../public");
const outputDir = path.join(__dirname, "../public/optimized");

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeImages() {
  const files = fs.readdirSync(inputDir);
  const imageFiles = files.filter(
    (file) =>
      /\.(jpg|jpeg|png|webp)$/i.test(file) && !file.startsWith("optimized-")
  );

  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    const fileName = path.parse(file).name;
    const stats = fs.statSync(inputPath);

    console.log(`Optimizing ${file} (${(stats.size / 1024).toFixed(2)}KB)...`);

    try {
      // Generate WebP version
      const webpOutput = path.join(outputDir, `${fileName}.webp`);
      await sharp(inputPath)
        .webp({ quality: 80, effort: 6 })
        .toFile(webpOutput);

      // Generate AVIF version (better compression)
      const avifOutput = path.join(outputDir, `${fileName}.avif`);
      await sharp(inputPath)
        .avif({ quality: 70, effort: 9 })
        .toFile(avifOutput);

      // Generate multiple sizes for responsive images
      const sizes = [400, 800, 1200, 1920];
      for (const size of sizes) {
        const resizedWebp = path.join(outputDir, `${fileName}-${size}w.webp`);
        const resizedAvif = path.join(outputDir, `${fileName}-${size}w.avif`);

        await sharp(inputPath)
          .resize(size, null, {
            withoutEnlargement: true,
            fit: "inside",
          })
          .webp({ quality: 80, effort: 6 })
          .toFile(resizedWebp);

        await sharp(inputPath)
          .resize(size, null, {
            withoutEnlargement: true,
            fit: "inside",
          })
          .avif({ quality: 70, effort: 9 })
          .toFile(resizedAvif);
      }

      const webpStats = fs.statSync(webpOutput);
      const avifStats = fs.statSync(avifOutput);

      console.log(
        `  WebP: ${(webpStats.size / 1024).toFixed(2)}KB (${(
          (1 - webpStats.size / stats.size) *
          100
        ).toFixed(1)}% smaller)`
      );
      console.log(
        `  AVIF: ${(avifStats.size / 1024).toFixed(2)}KB (${(
          (1 - avifStats.size / stats.size) *
          100
        ).toFixed(1)}% smaller)`
      );
    } catch (error) {
      console.error(`Error optimizing ${file}:`, error.message);
    }
  }

  console.log("\nOptimization complete!");
}

optimizeImages().catch(console.error);
