import cloudinary from "cloudinary";
import formidable from "formidable";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Disable Next.js body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { fileFolder } = req.query;
  const form = formidable({ multiples: true, keepExtensions: true });

  try {
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    if (!files.file) {
      return res.status(400).json({ error: "No files uploaded." });
    }

    const fileArray = Array.isArray(files.file) ? files.file : [files.file];

    const uploadResults = await Promise.allSettled(
      fileArray.map(async (file) => {
        const ext = path.extname(file.originalFilename || "").toLowerCase();

        try {
          let uploadOptions = {
            folder: fileFolder || "uploads",
            resource_type: ["mp4", "mov", "avi", "webm"].includes(ext.slice(1))
              ? "video"
              : "image", // auto-detect type
          };

          let buffer;

          if ([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tiff"].includes(ext)) {
            // Image processing with sharp
            const metadata = await sharp(file.filepath).metadata();
            let pipeline = sharp(file.filepath).resize({ width: 1920 });
            pipeline = metadata.hasAlpha
              ? pipeline.png({ quality: 80, compressionLevel: 8 })
              : pipeline.jpeg({ quality: 80 });
            buffer = await pipeline.toBuffer();
          } else {
            // Videos → read as buffer
            buffer = await fs.readFile(file.filepath);
          }

          const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.v2.uploader.upload_stream(
              uploadOptions,
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            stream.end(buffer);
          });

          return {
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
            type: result.resource_type,
          };
        } catch (err) {
          console.error(`❌ Error processing ${file.originalFilename}:`, err);
          return { success: false, error: err.message || "Processing failed" };
        } finally {
          try {
            await fs.unlink(file.filepath);
          } catch {
            console.warn(`⚠️ Failed to remove temp file: ${file.filepath}`);
          }
        }
      })
    );

    const success = uploadResults
      .filter((r) => r.status === "fulfilled" && r.value.success)
      .map((r) => r.value);
    const failures = uploadResults.filter(
      (r) => r.status === "fulfilled" && !r.value.success
    );

    if (success.length === 0) {
      return res.status(500).json({
        error: "All uploads failed",
        details: failures.map((f) => f.value.error),
      });
    }

    res.status(200).json({
      message: `${success.length} file(s) uploaded successfully`,
      uploads: success,
      failed: failures.map((f) => f.value.error),
    });
  } catch (err) {
    console.error("🚨 Unexpected server error:", err);
    res.status(500).json({
      error: "Unexpected server error",
      details: err.message,
    });
  }
}
