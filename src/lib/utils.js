// pdf-worker\src\lib\utils.js

function centerTextOnPage(pdfPage, text, font, fontSize, yOffset) {
    const pageWidth = pdfPage.getSize().width;
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const x = (pageWidth - textWidth) / 2;
    pdfPage.drawText(text, { x, y: yOffset, font, fontSize });
}

function addIndent(pdfPage, text, font, fontSize, xOffset, yOffset) {
    pdfPage.drawText(text, { x: xOffset, y: yOffset, font, fontSize });
}

function createTopicHeader(pdfPage, title, subtitle, font, fontSize, xOffset, yOffset) {
    pdfPage.drawText(title, { x: xOffset, y: yOffset, font, fontSize, bold: true });
    pdfPage.drawText(subtitle, { x: xOffset, y: yOffset - fontSize * 1.5, font, fontSize });
}

function splitTextIntoLines(text, font, size, width) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const lineWidth = font.widthOfTextAtSize(`${currentLine} ${word}`, size);

        if (lineWidth <= width) {
            currentLine += ` ${word}`;
        } else {
            lines.push(currentLine.trim());
            currentLine = word;
        }
    }

    if (currentLine) {
        lines.push(currentLine.trim());
    }

    return lines;
}

module.exports = {
    centerTextOnPage, addIndent, createTopicHeader, splitTextIntoLines
};