const {
    StandardFonts,
    PageSizes,
    setFillingColor,
    rgb,
} = require('pdf-lib');
const {
    drawMargins, 
    getPageLimits,
    drawGrid,
} = require('../lib/utils')

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


    // TODO fix this, we will split this text following the margin rules of this page
    // so we should check this at what point?
    const text = "Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet!";

    const { xMin, xMax,
        yMin, yMax } = getPageLimits(page.config, fontSize)
    //calculateTextBounds(text, fontSize, marginTop, marginBottom, marginLeft, marginRight)

    const width = helveticaFont.widthOfTextAtSize(text, fontSize);

    console.table(width)

    await drawGrid(pdfPage, PageSizes.A4);/// SEE GRID
    //await drawMargins(pdfPage, xMin, xMax, yMin, yMax)


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