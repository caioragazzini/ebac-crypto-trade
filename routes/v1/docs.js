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
            otp: {
                type: 'apiKey',
                in: 'header',
                name: 'totp',
            },
        },
        schemas: {
            Deposito: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '675a00b15a7665f715197081' },
                    valor: { type: 'number', example: 300 },
                    data: { type: 'string', format: 'date-time', example: '2024-12-11T21:14:25.127Z' },
                    cancelado: { type: 'boolean', example: false },
                },
            },
        },
    },
    paths: {
        '/v1/saques': {
            post: {
                description: 'Realiza um saque em BRL',
                security: [
                    { auth: [] },
                    { otp: [] },
                ],
                tags: ['saques'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    valor: {
                                        type: 'number',
                                        example: 3000,
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Saque realizado com sucesso' },
                    422: { description: 'Saldo insuficiente ou erro no saque' },
                },
            },
        },
        '/v1/depositos': {
            get: {
                description: 'Retorna a lista de depósitos do usuário',
                security: [
                    { auth: [] },
                    { otp: [] },
                ],
                tags: ['depósitos'],
                responses: {
                    200: {
                        description: 'Lista de depósitos do usuário',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        sucesso: { type: 'boolean', example: true },
                                        depositos: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Deposito' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                description: 'Realiza um novo depósito para o usuário',
                security: [
                    { auth: [] },
                    { otp: [] },
                ],
                tags: ['depósitos'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    valor: { type: 'number', example: 300 },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Depósito realizado com sucesso',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        sucesso: { type: 'boolean', example: true },
                                        saldo: { type: 'number', example: 1500 },
                                        depositos: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Deposito' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    422: {
                        description: 'Erro ao processar o depósito',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        sucesso: { type: 'boolean', example: false },
                                        erro: { type: 'string', example: 'Erro ao processar depósito' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

const opcoes = {
    definition: swaggerBase,
    apis: ['./routes/v1/*.js'],
};

module.exports = swaggerJSDoc(opcoes);
