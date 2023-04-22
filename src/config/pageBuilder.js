const {
    StandardFonts,
    PageSizes
} = require('pdf-lib');

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

    const pdfPage = pdfDoc.addPage(PageSizes.A4);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    pdfPage.setFont(helveticaFont)

    for (const section of sections) {
        await drawSection(pdfDoc, section, page.config)
    }

}

module.exports = {
    buildPage,
}

/**
   await setFontSize(pdfPage, page.config.fontSize);
   
    await setMargins(pdfPage, page.config) */