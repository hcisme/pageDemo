const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
const upload = multer({ dest: 'uploads/' });

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle the upload of individual file chunks
app.post('/upload', upload.single('file'), (req, res) => {
  const { filename, chunkIndex } = req.body;
  const chunkPath = req.file.path;
  const destination = path.join('uploads/', filename + '-' + chunkIndex);

  // Move the uploaded chunk to a specific location
  fs.renameSync(chunkPath, destination);

  res.sendStatus(200);
});

// Handle the merging of uploaded chunks into the final file
app.post('/merge', (req, res) => {
  const { filename, totalChunks } = req.body;
  const destination = path.join('uploads/', filename);
  const chunksFolder = path.join('uploads/');

  const writeStream = fs.createWriteStream(destination);
  for (let i = 0; i < totalChunks; i++) {
    const chunkPath = path.join(chunksFolder, filename + '-' + i);
    const chunkData = fs.readFileSync(chunkPath);
    writeStream.write(chunkData);
    fs.unlinkSync(chunkPath); // Remove the temporary chunk file after merging
  }

  writeStream.end();
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
