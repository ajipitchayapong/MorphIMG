const https = require("https");
const fs = require("fs");
const path = require("path");

const files = [
  "https://unpkg.com/heic2any@0.0.4/dist/heic2any.min.js",
  "https://unpkg.com/heic2any@0.0.4/dist/libheif.js",
  "https://unpkg.com/heic2any@0.0.4/dist/libheif.wasm",
];

const publicPath = path.join(process.cwd(), "public");

if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath, { recursive: true });
}

async function download(url) {
  const filename = path.basename(url);
  const dest = path.join(publicPath, filename);

  console.log(`Downloading ${url} to ${dest}...`);

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(
            new Error(`Failed to download ${url}: ${response.statusCode}`),
          );
          return;
        }
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log(`Finished downloading ${filename}`);
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

async function main() {
  try {
    for (const url of files) {
      await download(url);
    }
    console.log("All files downloaded successfully.");
  } catch (err) {
    console.error("Download failed:", err);
    process.exit(1);
  }
}

main();
