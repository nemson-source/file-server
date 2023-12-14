const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs')

function createFolder(folderName) {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
    console.log(`Folder "${folderName}" created successfully.`);
  } else {
    console.log(`Folder "${folderName}" already exists.`);
  }
}
const folderName = 'uploads';
createFolder(folderName);

const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

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

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Connection from ${req.ip}`);
  next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    const filePath = path.join('/uploads', req.file.filename);
    console.log(`[${new Date().toISOString()}] File upload started - Type: ${req.file.mimetype}, Name: ${req.file.originalname}`);
    if (req.file.mimetype.startsWith('image')) {
      console.log(`[${new Date().toISOString()}] Image file uploaded successfully`);
      res.send(`
        <h2>Fichier téléchargé avec succès!</h2>
        <p>Type de Fichier: ${req.file.mimetype}</p>
        <p>Nom de Fichier: ${req.file.originalname}</p>
        <img src="${filePath}" alt="Uploaded Image">
      `);
    } else if (req.file.mimetype === 'application/pdf') {
      console.log(`[${new Date().toISOString()}] PDF file uploaded successfully`);
      res.send(`
        <h2>Fichier téléchargé avec succès!</h2>
        <p>Type de Fichier: ${req.file.mimetype}</p>
        <p>Nom de Fichier: ${req.file.originalname}</p>
        <iframe src="${filePath}" style="width: 100%; height: 847px;" frameborder="0"></iframe>
      `);
    } else {
      console.log(`[${new Date().toISOString()}] Type de fichier non pris en charge. Impossible d'afficher.`);
      res.send(`
        <h2>Fichier téléchargé avec succès!</h2>
        <p>Type de Fichier: ${req.file.mimetype}</p>
        <p>Nom de Fichier: ${req.file.originalname}</p>
        <p>Type de fichier non pris en charge. Impossible d'afficher.</p>
      `);
    }
  } else {
    console.log(`[${new Date().toISOString()}] File upload failed`);
    res.status(400).send('Échec du téléchargement du fichier.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
