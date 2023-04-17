const { createPDF } = require('./lib/pdfCreator');
const config = require('./config');


const title = 'My Book Title';

const coverData = {
    collegeLogoPath: 'assets/images/college_logo.png', // Replace with the actual file path
    collegeName: 'CENTRO UNIVERSITÁRIO INSTITUTO DE EDUCAÇÃO SUPERIOR DE BRASÍLIA',
    degreeName: 'BACHARELADO EM ENGENHARIA DE SOFTWARE',
    studentName: 'JOÃO VICTOR CARDOSO DOS SANTOS',
    paperTitle: 'Linguagens Formais e Autômatos:',
    paperSubtitle: 'Exercícios',
    location: 'Goiânia, GO',
    year: new Date().getFullYear(),
};

const conterCoverData = {
    
}

const chapters = [
    {
        title: 'Chapter 1: Introduction',
        content: 'This is the introduction to my book...',
    },
    {
        title: 'Chapter 2: Getting Started',
        content: 'In this chapter, we will explore...',
    },
];

createPDF(title, chapters, coverData)
    .then(() => {
        console.log('PDF created successfully');
        console.log(`Check the ${config.outputDirectory}/${config.outputFile} file.`);
    })
    .catch((error) => {
        console.error('Error creating PDF:', error);
    });
