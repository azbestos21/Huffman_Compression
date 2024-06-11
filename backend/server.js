const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const { huffmanCompress } = require('./huffman');

mongoose.connect('mongodb+srv://rishibcbs:TGXlWMV3Z2sYAyLI@cluster0.thodduu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

const app = express();
app.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });

const FileSchema = new mongoose.Schema({
    originalName: String,
    compressedData: String,
    codes: Object,
});

const File = mongoose.model('File', FileSchema);

app.post('/upload', upload.single('file'), async (req, res) => {
    const { file } = req;
    const { compressedData, codes } = huffmanCompress(file.path);

    const newFile = new File({
        originalName: file.originalname,
        compressedData,
        codes,
    });

    await newFile.save();
    fs.unlinkSync(file.path); // remove the uploaded file

    res.json({ message: 'File compressed and saved.', compressedData });
});

app.listen(5000, () => console.log('Server started on port 5000'));
