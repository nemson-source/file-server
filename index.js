const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Set up the file upload storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep the original file name
  },
});

// Define a file filter for image and PDF files
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['.jpg', '.jpeg', '.png', '.pdf'];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedFileTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    const errorMessage = 'Type de fichier invalide. Seules les images (jpg, jpeg, png) et PDF sont autorisées.';
    console.error(`[${new Date().toISOString()}] ${errorMessage}`);
    cb(new Error(errorMessage));
  }
};

const upload = multer({ storage, fileFilter });

// Middleware to log connection information
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Connection from ${req.ip}`);
  next();
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve the HTML form for file upload
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    const filePath = path.join('/uploads', req.file.filename);
    console.log(`[${new Date().toISOString()}] File upload started - Type: ${req.file.mimetype}, Name: ${req.file.originalname}`);

    // Determine whether the file is an image or a PDF
    if (req.file.mimetype.startsWith('image')) {
      // If it's an image, display it using an <img> tag
      console.log(`[${new Date().toISOString()}] Image file uploaded successfully`);
      res.send(`
        <h2>File uploaded successfully!</h2>
        <p>File Type: ${req.file.mimetype}</p>
        <p>File Name: ${req.file.originalname}</p>
        <img src="${filePath}" alt="Uploaded Image">
      `);
    } else if (req.file.mimetype === 'application/pdf') {
      // If it's a PDF, embed it using an <iframe> tag
      console.log(`[${new Date().toISOString()}] PDF file uploaded successfully`);
      res.send(`
        <h2>File uploaded successfully!</h2>
        <p>File Type: ${req.file.mimetype}</p>
        <p>File Name: ${req.file.originalname}</p>
        <iframe src="${filePath}" style="width: 100%; height: 500px;" frameborder="0"></iframe>
      `);
    } else {
      // For unsupported file types
      console.log(`[${new Date().toISOString()}] Unsupported file type. Unable to display.`);
      res.send(`
        <h2>File uploaded successfully!</h2>
        <p>File Type: ${req.file.mimetype}</p>
        <p>File Name: ${req.file.originalname}</p>
        <p>Unsupported file type. Unable to display.</p>
      `);
    }
  } else {
    console.log(`[${new Date().toISOString()}] File upload failed`);
    res.status(400).send('File upload failed.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
