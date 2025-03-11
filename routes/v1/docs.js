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
        }, 'Deposito': {
            type: 'object',
            properties: {
                valor: { 
                    type: 'number', 
                    example: 300 },
                data: {
                     type: 'string', 
                     format: 'date-time', 
                     example: '2024-12-11T21:14:25.127Z' },
                cancelado: { 
                    type: 'boolean', 
                    example: false },
                _id: { 
                    type: 'string', 
                    xample: '675a00b15a7665f715197081' }
            }
        },'Saque': {
            type: 'object',
            properties: {
                valor: {
                    type: 'number',
                    example: 10
                },
                data: {
                    type: 'string',
                    format: 'date-time',
                    example: '2024-12-14T12:16:42.095Z'
                },
                _id: {
                    type: 'string',
                    example: '675d772aecb16593a8cbf534'
                }
            }
        },
    }
};

const opcoes= {
    definition:swaggerBase,
    apis: ['./routes/v1/*.js'],
};

module.exports = swaggerJSDoc(opcoes);