const fs = require('fs');
const abntConfig = require('../config/abntConfig');
const {
    StandardFonts,
    PageSizes
} = require('pdf-lib');

async function createCoverPage(pdfDoc, data) {
    const { collegeLogoPath, collegeName, degreeName, studentName,
        paperTitle, paperSubtitle, location, year } = data;

    const { fontSize, marginTop, marginBottom, marginLeft,
        marginRight, collegeNameGap, degreeNameGap, studentNameGap,
        tccTitleGap, subtitleGap, cityYearGap, } = abntConfig.coverPage;

    const [pageWidth, pageHeight] = PageSizes.A4;

    // Embed the college logo image
    const logoImage = await pdfDoc.embedPng(fs.readFileSync(collegeLogoPath));

    const logoDims = logoImage.size();

    // Embed the default font
    const newFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Create the cover page
    const coverPage = pdfDoc.addPage(PageSizes.A4);

    // Draw the college logo the page have height of 841.89 and we are writing 700 for y axis
    coverPage.drawImage(logoImage, {
        x: pageWidth / 2 - logoDims.width / 2,
        y: 750,
        width: logoDims.width,
        height: logoDims.height,
    });

    const linesOfText = [
        { text: collegeName, font: newFont, size: fontSize, bold: false, linesAfter: 1 },
        { text: degreeName, font: newFont, size: fontSize, bold: false, linesAfter: 3 },
        { text: studentName, font: newFont, size: fontSize, bold: false, linesAfter: 16 },
        { text: paperTitle, font: fontBold, size: fontSize, bold: true, linesAfter: 1 },
        { text: paperSubtitle, font: newFont, size: fontSize, bold: false, linesAfter: 16.5 },
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
        coverPage.drawText(txt, {

            x: pageWidth / 2 - line.font.widthOfTextAtSize(`${txt}`, line.size) / 2,
            y: yOffset,
            size: line.size,
            font: line.bold ? fontBold : line.font,
        });

        yOffset -= lineSpacing * line.linesAfter;
        //console.table([line, yOffset])
    }

    // Return the created cover page
    return coverPage;
}


module.exports = {
    createCoverPage,
};