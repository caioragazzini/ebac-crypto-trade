const swaggerJSDoc = require('swagger-jsdoc');

const swaggerBase = {
    failOnErrors: true,
    openapi: '3.0.0',
    info: {
        title: 'API da CryptoTrade',
        description: 'Trocar cryptos de forma fácil',
        version: '0.0.1',
    },
    components: {
        securitySchemes: {
            auth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    schemas: {
        'Cotação': {
            type: 'object',
            properties: {
                moeda: {
                    type: 'string',
                    example: 'ETH',
                },
                data: {
                    type: 'string',
                    format: 'date-time',
                    example: '2025-03-07T21:45:01.152Z',
                },
                id: {
                    type: 'string',
                    example: '67cb68dd843502e0058031e3',
                },
                valor: {
                    type: 'number',
                    example: 500146.65366733563,
                },
            },
        },
        'Deposito': {
            type: 'object',
            properties: {
                valor: {
                    type: 'number',
                    example: 300,
                },
                data: {
                    type: 'string',
                    format: 'date-time',
                    example: '2024-12-11T21:14:25.127Z',
                },
                cancelado: {
                    type: 'boolean',
                    example: false,
                },
                _id: {
                    type: 'string',
                    example: '675a00b15a7665f715197081',
                },
            },
        },
        'Saque': {
            type: 'object',
            properties: {
                valor: {
                    type: 'number',
                    example: 10,
                },
                data: {
                    type: 'string',
                    format: 'date-time',
                    example: '2024-12-14T12:16:42.095Z',
                },
                _id: {
                    type: 'string',
                    example: '675d772aecb16593a8cbf534',
                },
            },
        },
        'CancelarDepositoResponse': {
            type: 'object',
            properties: {
                sucesso: {
                    type: 'boolean',
                    example: true,
                },
                mensagem: {
                    type: 'string',
                    example: 'Depósito cancelado com sucesso',
                },
                deposito: {
                    type: 'object',
                    properties: {
                        valor: {
                            type: 'number',
                            example: 300,
                        },
                        data: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-12-14T11:53:41.821Z',
                        },
                        cancelado: {
                            type: 'boolean',
                            example: true,
                        },
                    },
                },
            },
        },
        'Usuario': {
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    example: 'caioragazzini@gmail.com.br',
                },
                cpf: {
                    type: 'string',
                    example: '146.897.780-60',
                },
                nome: {
                    type: 'string',
                    example: 'João',
                },
                senha: {
                    type: 'string',
                    example: '1234@ebac',
                },
            },
        }        
    },
};

const opcoes = {
    definition: swaggerBase,
    apis: ['./routes/v1/*.js'],  // Certifique-se de que as rotas estão no caminho correto e com as anotações Swagger
};

module.exports = swaggerJSDoc(opcoes);
