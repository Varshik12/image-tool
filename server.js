import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import multer from "multer";
import sharp from "sharp";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Get Image Metadata
app.post("/api/metadata", upload.single("file"), async (req, res) => {
  try {
    console.log('Metadata request received');
    if (!req.file) {
      console.error('No file in metadata request');
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    console.log(`Processing metadata for file: ${req.file.originalname} (${req.file.size} bytes)`);
    const metadata = await sharp(req.file.buffer).metadata();
    
    console.log('Metadata extracted successfully:', metadata.width, 'x', metadata.height);
    res.json({
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: req.file.size,
    });
  } catch (error) {
    console.error('Metadata extraction error:', error);
    res.status(500).json({ error: "Failed to read metadata: " + error.message });
  }
});

// Image Processing Endpoints
app.post("/process/rotate", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const angle = parseInt(req.query.angle) || 0;
    
    const processedImage = await sharp(req.file.buffer)
      .rotate(angle)
      .toBuffer();
    
    res.set("Content-Type", req.file.mimetype);
    res.send(processedImage);
  } catch (error) {
    res.status(500).json({ error: "Rotation failed" });
  }
});

app.post("/image/png-to-jpg", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    
    const processedImage = await sharp(req.file.buffer)
      .jpeg()
      .toBuffer();
    
    res.set("Content-Type", "image/jpeg");
    res.send(processedImage);
  } catch (error) {
    res.status(500).json({ error: "Conversion failed" });
  }
});

app.post("/image/jpg-to-png", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    
    const processedImage = await sharp(req.file.buffer)
      .png()
      .toBuffer();
    
    res.set("Content-Type", "image/png");
    res.send(processedImage);
  } catch (error) {
    res.status(500).json({ error: "Conversion failed" });
  }
});

app.post("/process/resize", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const width = parseInt(req.query.width || req.body.width) || 300;
    const height = parseInt(req.query.height || req.body.height) || 300;
    
    const processedImage = await sharp(req.file.buffer)
      .resize(width, height)
      .toBuffer();
    
    res.set("Content-Type", req.file.mimetype);
    res.send(processedImage);
  } catch (error) {
    res.status(500).json({ error: "Resizing failed" });
  }
});

app.post("/process/crop", upload.single("file"), async (req, res) => {
  try {
    console.log('Crop request received:', req.body);
    if (!req.file) {
      console.error('No file in crop request');
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    const metadata = await sharp(req.file.buffer).metadata();
    const imgWidth = metadata.width || 0;
    const imgHeight = metadata.height || 0;

    let x = Math.max(0, parseInt(req.query.x || req.body.x) || 0);
    let y = Math.max(0, parseInt(req.query.y || req.body.y) || 0);
    let width = Math.max(1, parseInt(req.query.width || req.body.width) || 0);
    let height = Math.max(1, parseInt(req.query.height || req.body.height) || 0);
    
    console.log(`Original dimensions: ${imgWidth}x${imgHeight}`);
    console.log(`Requested crop: x=${x}, y=${y}, w=${width}, h=${height}`);

    // Ensure crop is within bounds
    if (x >= imgWidth) x = imgWidth - 1;
    if (y >= imgHeight) y = imgHeight - 1;
    if (x + width > imgWidth) width = imgWidth - x;
    if (y + height > imgHeight) height = imgHeight - y;
    
    console.log(`Adjusted crop: x=${x}, y=${y}, w=${width}, h=${height}`);

    if (width <= 0 || height <= 0) {
      return res.status(400).json({ error: "Invalid crop dimensions after adjustment" });
    }

    const processedImage = await sharp(req.file.buffer)
      .extract({ left: x, top: y, width, height })
      .toBuffer();
    
    res.set("Content-Type", req.file.mimetype);
    res.send(processedImage);
  } catch (error) {
    console.error('Crop error details:', error);
    res.status(500).json({ error: "Cropping failed: " + error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
