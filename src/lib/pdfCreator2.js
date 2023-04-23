const fs = require('fs');
const path = require('path');
const config = require('../config');
const { buildPage } = require('../config/pageBuilder')
const { PDFDocument } = require('pdf-lib');

async function newPDF(doc) {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const { pages } = doc

    // Loop through each page
    for (const page of pages) {
        await buildPage(pdfDoc, page)
    }

    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();
    // Write the PDF to a file
    const outputFilepath = path.join(config.outputDirectory, config.outputFile);
    fs.writeFileSync(outputFilepath, pdfBytes);
}

module.exports = {
    newPDF,
};