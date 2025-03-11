const swaggerJSDoc = require('swagger-jsdoc');

const swaggerBase= {
    failOnErros: true,
    openapi: '3.0.0',
    info:{
        title: 'API da CryptoTrade',
        description: 'Trocar cryptos de forma fácil ',
        version: '0.0.1'
    },
    components: {
        securitySchemes: {
            auth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }

        }
    },
    schemas:{
        'Cotação': {
            type: 'object',
            properties:{
                moeda:{
                    type:'string',
                    exemple:'ETH',
                },
                data:{
                    type: 'datetime',
                    exemple:'2025-03-07T21:45:01.152Z',
                },
                id:{
                    type: 'string',
                    exemple: '67cb68dd843502e0058031e3'
                },
                valor: {
                    type: 'number',
                    exemple:'500146.65366733563'
                }
            }
        }
        
    }

};

const opcoes= {
    definition:swaggerBase,
    apis: ['./routes/v1/*.js'],
};

module.exports = swaggerJSDoc(opcoes);