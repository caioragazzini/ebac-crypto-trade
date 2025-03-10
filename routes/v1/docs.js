const swaggerJSDoc = require('swagger-jsdoc');

const swaggerBase= {
    failOnErros: true,
    openapi: '3.0.0',
    info:{
        title: 'API da CryptoTrade',
        description: 'Trocar cryptos de forma fácil ',
        version: '0.0.1'
    }

};

const opcoes= {
    definition:swaggerBase,
    apis: ['./routes/v1/*.js'],
};

module.exports = swaggerJSDoc(opcoes);