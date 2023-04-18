const fs = require('fs');
const abntConfig = require('../config/abntConfig');
const {
    StandardFonts,
    PageSizes
} = require('pdf-lib');

const { splitTextIntoLines } = require('../lib/utils')

async function createCounterCoverPage(pdfDoc, data) {
    const { studentName, paperTitle, paperSubtitle,
        paperDescription, teacher, location, year } = data;

    const { fontSize, oneCentimeter, threeCentimeter, twoCentimeter } = abntConfig.abntRules;

    const [pageWidth, pageHeight] = PageSizes.A4;//A4: [595.28, 841.89] as [number, number],

    // Embed the default font
    const newFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Create the PAGE
    const counterCoverPage = pdfDoc.addPage(PageSizes.A4);

    const linesOfText = [
        { text: studentName, font: newFont, size: fontSize, bold: false, linesAfter: 12, extraMargin: false },
        { text: paperTitle, font: fontBold, size: fontSize, bold: true, linesAfter: 1, extraMargin: false },
        { text: paperSubtitle, font: newFont, size: fontSize, bold: false, linesAfter: 5, extraMargin: false },
        {
            text: paperDescription,
            font: newFont, size: fontSize,
            bold: false, linesAfter: 1,
            extraMargin: true,
        },
        { text: teacher, font: newFont, size: fontSize, bold: true, linesAfter: 1, extraMargin: false },
        { text: location, font: newFont, size: fontSize, bold: false, linesAfter: 1, extraMargin: false },
        { text: year, font: newFont, size: fontSize, bold: false, linesAfter: 1, extraMargin: false },
    ];

    // Define Y offsets for each text element
    let yOffset = pageHeight - threeCentimeter;
    // Create the line space with 1.5 times
    const lineSpacing = fontSize * 1.5

    // Define the left margin as 8cm + 3cm [marginleft]
    const leftMargin = 12 * abntConfig.abntRules.oneCentimeter;
    const x_extra = leftMargin;
    // Define the width of the text area as 9cm (pageWidth - leftMargin - rightMargin)
    const textWidth = pageWidth - leftMargin - 2 * abntConfig.abntRules.twoCentimeter;
    const lines = splitTextIntoLines(paperDescription, newFont, fontSize, textWidth);
    console.table(lines)


    for (let i = 0; i < linesOfText.length; i++) {
        const line = linesOfText[i];

        const txt = String(line.text);
        // Draw the line of text or the ajusted lines with extra margin 
        if (line.extraMargin) {
            for (let j = 0; j < lines.length; j++) {
                const newLine = lines[j];//we are breaking into multiple lines one sentence
                counterCoverPage.drawText(newLine, {
                    x: x_extra,
                    y: yOffset,
                    size: fontSize,
                    font: newFont,
                });
                yOffset -= lineSpacing;//new lines
            }

        } else {
            counterCoverPage.drawText(txt, {
                x: pageWidth / 2 - line.font.widthOfTextAtSize(`${txt}`, line.size) / 2,
                y: yOffset,
                size: line.size,
                font: line.bold ? fontBold : line.font,
            });

            yOffset -= lineSpacing * line.linesAfter;
        }
        //console.table([line, yOffset])
    }

    // Return the created cover page
    return counterCoverPage;
}


module.exports = {
    createCounterCoverPage,
};