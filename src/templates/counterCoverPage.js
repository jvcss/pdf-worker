const fs = require('fs');
const abntConfig = require('../config/abntConfig');
const {
    StandardFonts,
    PageSizes
} = require('pdf-lib');

async function createCounterCoverPage(pdfDoc, data) {
    const {  studentName, paperTitle, paperSubtitle,
        paperDescription, location, year } = data;

    const { fontSize, } = abntConfig.abntRules;

    const [pageWidth,] = PageSizes.A4;

    // Embed the default font
    const newFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Create the PAGE
    const counterCoverPage = pdfDoc.addPage(PageSizes.A4);

    const linesOfText = [

        { text: studentName, font: newFont, size: fontSize, bold: false, linesAfter: 12 },
        { text: paperTitle, font: fontBold, size: fontSize, bold: true, linesAfter: 1 },
        { text: paperSubtitle, font: newFont, size: fontSize, bold: false, linesAfter: 5 },
        { text: paperDescription, font: newFont, size: fontSize, bold: false, linesAfter: 1 },
        { text: location, font: newFont, size: fontSize, bold: false, linesAfter: 1 },
        { text: year, font: newFont, size: fontSize, bold: false, linesAfter: 1 },
    ];

    // Define Y offsets for each text element
    let yOffset = 725;
    const lineSpacing = fontSize * 1.5

    for (let i = 0; i < linesOfText.length; i++) {
        const line = linesOfText[i];

        const txt = String(line.text);
        // Draw the line of text
        counterCoverPage.drawText(txt, {

            x: pageWidth / 2 - line.font.widthOfTextAtSize(`${txt}`, line.size) / 2,
            y: yOffset,
            size: line.size,
            font: line.bold ? fontBold : line.font,
        });

        yOffset -= lineSpacing * line.linesAfter;
        console.table([line, yOffset])
    }

    // Return the created cover page
    return counterCoverPage;
}


module.exports = {
    createCounterCoverPage,
};