const {
    StandardFonts,
    PageSizes
} = require('pdf-lib');

function setMargins(pdfPage, config) {
    const { marginTop, marginBottom, marginLeft, marginRight } = config;
    const margins = [marginTop, marginRight, marginBottom, marginLeft];
    pdfPage.setMargins(...margins.map((m) => parseInt(m)));
}


async function buildPage(pdfDoc, page) {

    const {
        config: {
            fontSize,
            marginTop,
            marginBottom,
            marginLeft,
            marginRight
        },
        sections
    } = page;

    const pdfPage = pdfDoc.addPage(PageSizes.A4);

    //can we create these functions?
    for (let idx = 0; idx < array.length; idx++) {
        const element = array[idx];

        
    }
    await setFontSize(pdfPage, page.config.fontSize);
    await setMargins(pdfPage, page.config)


}

module.exports = {
    buildPage,
}