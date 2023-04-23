const {
    StandardFonts,
    PageSizes,
    setFillingColor,
    rgb,
} = require('pdf-lib');

async function drawGrid(pdfPage, pageSize) {
    const [ width, height ] = pageSize;
    const marginX = 0;
    const marginY = 0;
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

/**
 * page.drawText(
   *   `Humpty Dumpty sat on a wall \n` +
   *   `Humpty Dumpty had a great fall; \n` +
   *   `All the king's horses and all the king's men \n` +
   *   `Couldn't put Humpty together again. \n`,
   *   {
   *     x: 25,
   *     y: 100,
   *     font: timesRomanFont,
   *     size: 24,
   *     color:  ,
   *     lineHeight: 24,
   *     opacity: 0.75,
   *   },
 */
async function writeText(pdfPage, text, sectionConfig) {
    const {
        text: contentText,
        config: {
            align = 'left',
            bold = false,
            italic = false,
            color = 'black'
        } = {}
    } = text;
    pdfPage.drawText(contentText, {
        x: sectionConfig.marginLeft,
        y: sectionConfig.marginTop,
        size: sectionConfig.fontSize
    })
}

async function buildPage(pdfDoc, page) {

    const {
        config: { fontSize, marginTop, marginBottom, marginLeft, marginRight },
        sections
    } = page;

    const pdfPage = pdfDoc.addPage(PageSizes.A4)//A4: [595.28, 841.89]
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    pdfPage.setFont(helveticaFont)



    const text = "Lorem ipsum dolor sit amet!";

    const { xMin, xMax,
        yMin, yMax } = getPageLimits(page.config, fontSize)
    //calculateTextBounds(text, fontSize, marginTop, marginBottom, marginLeft, marginRight)

    const width = helveticaFont.widthOfTextAtSize(text, fontSize);

    console.table(width)

    await drawGrid(pdfPage, PageSizes.A4);


    pdfPage.drawText(text, { x: xMin, y: yMin, size: fontSize });



    /*
    
        pdfPage.drawText(`Humpty Dumpty sat on a wall \n` +
            `Humpty Dumpty had a great fall; \n` +
            `All the king's horses and all the king's men \n` +
            `Couldn't put Humpty together again. \n`,
            {
                x: 0,
                y: 841.89 - fontSize,
                font: helveticaFont,
                size: fontSize, // PAGE CONFIG
                color: rgb(1, 0, 0), // setFillingColor || setStrokingColor
                lineHeight: 12,
                opacity: 0.75,
            },)*/


    /*for (const section of sections) {
        //await drawSection(pdfDoc, section, page.config)
    }*/

}

module.exports = {
    buildPage,
}

/**
   await setFontSize(pdfPage, page.config.fontSize);
   
    await setMargins(pdfPage, page.config) */