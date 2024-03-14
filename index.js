const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Connection from ${req.ip}`);
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  const files = fs.readdirSync(path.join(__dirname, 'uploads'));
  res.render('index', { files });
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    const filePath = path.join('/uploads', req.file.filename);
    console.log(`[${new Date().toISOString()}] File upload started - Type: ${req.file.mimetype}, Name: ${req.file.originalname}`);
    if (req.file.mimetype.startsWith('image')) {
      console.log(`[${new Date().toISOString()}] Image file uploaded successfully`);
      res.send(`
        <h2>File uploaded successfully!</h2>
        <p>File Type: ${req.file.mimetype}</p>
        <p>File Name: ${req.file.originalname}</p>
        <img src="${filePath}" alt="Uploaded Image">
      `);
    } else if (req.file.mimetype === 'application/pdf') {
      console.log(`[${new Date().toISOString()}] PDF file uploaded successfully`);
      res.send(`
        <h2>File uploaded successfully!</h2>
        <p>File Type: ${req.file.mimetype}</p>
        <p>File Name: ${req.file.originalname}</p>
        <iframe src="${filePath}" style="width: 100%; height: 847px;" frameborder="0"></iframe>
      `);
    } else {
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
