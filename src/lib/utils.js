// pdf-worker\src\lib\utils.js
const {
    PageSizes,
    rgb,
} = require('pdf-lib');

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

async function drawMargins(pdfPage, xMin, xMax, yMin, yMax) {
    const lineColor = rgb(0.5, 0.5, 0.5);
    const lineWidth = 0.5;

    // Draw top margin line
    await pdfPage.drawLine({
        start: { x: xMin, y: yMin },
        end: { x: xMax, y: yMin },
        color: lineColor,
        thickness: lineWidth,
    });

    // Draw bottom margin line
    await pdfPage.drawLine({
        start: { x: xMin, y: yMax },
        end: { x: xMax, y: yMax },
        color: lineColor,
        thickness: lineWidth,
    });

    // Draw left margin line
    await pdfPage.drawLine({
        start: { x: xMin, y: yMin },
        end: { x: xMin, y: yMax },
        color: lineColor,
        thickness: lineWidth,
    });

    // Draw right margin line
    await pdfPage.drawLine({
        start: { x: xMax, y: yMin },
        end: { x: xMax, y: yMax },
        color: lineColor,
        thickness: lineWidth,
    });
}

function getPageLimits(pageConfig, fontSize) {
    //const pageSize = PageSizes.A4;
    const [width, height] = PageSizes.A4;

    const { marginTop, marginBottom, marginLeft, marginRight } = pageConfig;

    const marginTopPts = Math.floor(parseFloat(marginTop) * 28.346);
    const marginBottomPts = Math.floor(parseFloat(marginBottom) * 28.346);
    const marginLeftPts = Math.floor(parseFloat(marginLeft) * 28.346);
    const marginRightPts = Math.floor(parseFloat(marginRight) * 28.346);

    const xMin = marginLeftPts + (fontSize / 2);
    const xMax = width - marginRightPts - (fontSize / 2);
    const yMin = height - marginTopPts - (fontSize / 2);
    const yMax = marginBottomPts + (fontSize / 2);

    return { xMin, xMax, yMin, yMax };
}

async function drawGrid(pdfPage, pageSize) {
    const [width, height] = pageSize;
    const marginX = 2;
    const marginY = 2;
    const gridSpacing = 28.3465; // 1cm in PDF units (72 DPI)

    for (let x = marginX; x < width - marginX; x += gridSpacing) {
        pdfPage.drawLine({
            start: { x, y: marginY },
            end: { x, y: height - marginY },
            thickness: 0.5,
            color: rgb(0.5, 0.5, 0.5),
        });
    }

    for (let y = marginY; y < height - marginY; y += gridSpacing) {
        pdfPage.drawLine({
            start: { x: marginX, y },
            end: { x: width - marginX, y },
            thickness: 0.5,
            color: rgb(0.5, 0.5, 0.5),
        });
    }
}

function calculateTextBounds(text, fontSize, marginTop, marginBottom, marginLeft, marginRight) {
    const fontHeight = (fontSize / 2.54) * 72; // Convert font size from cm to points
    const margin = {
        top: (marginTop / 2.54) * 72,
        bottom: (marginBottom / 2.54) * 72,
        left: (marginLeft / 2.54) * 72,
        right: (marginRight / 2.54) * 72
    };
    const pageHeight = PageSizes.A4[1];
    const textHeight = text.split('\n').length * fontHeight;
    const minY = margin.bottom + textHeight;
    const maxY = pageHeight - margin.top;
    const minX = margin.left;
    const maxX = PageSizes.A4[0] - margin.right;

    return { minX, minY, maxX, maxY };
}

async function drawSection(pdfPage, section, pageConfig) {
    const {
        config: {
            marginTop: sectionMarginTop = marginTop,
            marginBottom: sectionMarginBottom = marginBottom,
            marginLeft: sectionMarginLeft = marginLeft,
            marginRight: sectionMarginRight = marginRight
        },
        content
    } = section;

    for (const text of content) {
        await writeText(pdfPage, text, section.config)
    }
}

module.exports = {
    centerTextOnPage,
    addIndent,
    createTopicHeader,
    splitTextIntoLines,
    drawMargins,
    getPageLimits,
    drawGrid,
    calculateTextBounds,
    drawSection,


};