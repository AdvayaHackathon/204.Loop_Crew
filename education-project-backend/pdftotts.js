const fs = require('fs');
const pdf = require('pdf-parse');
const gtts = require('google-tts-api');

async function convertPdfToTts(pdfPath) {
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdf(dataBuffer);

    const fullText = pdfData.text.substring(0, 5000); // optional limit if you want to keep audio short

    const urls = gtts.getAllAudioUrls(fullText, {
        lang: 'en',
        slow: false,
        host: 'https://translate.google.com',
    });

    return urls.map(obj => obj.url); // return array of audio chunk URLs
}

module.exports = { convertPdfToTts };

