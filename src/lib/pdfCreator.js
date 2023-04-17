const fs = require('fs');
const path = require('path');
const config = require('../config');
const { createCoverPage } = require('../templates/coverPage');

const { createCounterCoverPage } = require('../templates/counterCoverPage')

const { PDFDocument, StandardFonts } = require('pdf-lib');

async function createPDF(title, chapters, coverData, conterCoverData) {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add the cover page
    await createCoverPage(pdfDoc, coverData);

    // Add the counter cover page
    await createCounterCoverPage(pdfDoc, conterCoverData)

    




    // Add a default font for the document
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    // Define common styles
    const titleFontSize = 30;
    const chapterTitleFontSize = 20;
    const chapterContentFontSize = 14;
    // Add the title
    const titlePage = pdfDoc.addPage([600, 800]);
    titlePage.drawText(title, {
        x: 50,
        y: 750,
        size: titleFontSize,
        font: font,
    });
    // Add chapters
    let currentPage;
    let yOffset;
    for (const chapter of chapters) {
        // Add a new page for each chapter
        currentPage = pdfDoc.addPage([600, 800]);
        yOffset = 750;
        // Add chapter title
        currentPage.drawText(chapter.title, {
            x: 50,
            y: yOffset,
            size: chapterTitleFontSize,
            font: font,
        });
        yOffset -= chapterTitleFontSize + 10;
        // Add chapter content
        currentPage.drawText(chapter.content, {
            x: 50,
            y: yOffset,
            size: chapterContentFontSize,
            font: font,
            lineHeight: 20,
        });
    }




    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();

    // Write the PDF to a file
    const outputFilepath = path.join(config.outputDirectory, config.outputFile);
    fs.writeFileSync(outputFilepath, pdfBytes);
    //fs.writeFileSync('output.pdf', pdfBytes);
}

module.exports = {
    createPDF,
};