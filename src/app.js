const { createPDF } = require('./lib/pdfCreator');
const config = require('./config');

const coverData = {
    collegeLogoPath: 'assets/images/college_logo.png',
    collegeName: 'CENTRO UNIVERSITÁRIO INSTITUTO DE EDUCAÇÃO SUPERIOR DE BRASÍLIA',
    degreeName: 'BACHARELADO EM ENGENHARIA DE SOFTWARE',
    studentName: 'JOÃO VICTOR CARDOSO DOS SANTOS',
    paperTitle: 'Linguagens Formais e Autômatos',
    paperSubtitle: 'Exercícios',
    location: 'Goiânia, GO',
    year: new Date().getFullYear(),
};

const conterCoverData = {
    studentName: 'JOÃO VICTOR CARDOSO DOS SANTOS',
    paperTitle: 'Linguagens Formais e Autômatos',
    paperSubtitle: 'Exercícios',
    paperDescription: 'Trabalho Acadêmico apresentado como requisito parcial para obtenção do título de Bacharel em Engenharia de Software, pelo Programa de Graduação da Faculdade IESB.',
    teacher: 'Orientador: Prof. Silva, William de Almeida',
    location: 'Goiânia, GO',
    year: new Date().getFullYear(),
}

const title = 'My Book Title';
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

createPDF(title, chapters, coverData, conterCoverData)
    .then(() => {
        console.log('PDF created successfully');
        console.log(`Check the ${config.outputDirectory}/${config.outputFile} file.`);
    })
    .catch((error) => {
        console.error('Error creating PDF:', error);
    });
