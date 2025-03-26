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
        '/v1/auth': {
            post: {
                description: 'Autentica um usuário e retorna um token JWT',
                tags: ['autenticação'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string', example: 'user@example.com' },
                                    senha: { type: 'string', example: 'senha123' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Login bem-sucedido, retorna um JWT' },
                    401: { description: 'Credenciais inválidas ou conta não confirmada' },
                },
            },
        },
        '/v1/auth/confirma-conta': {
            get: {
                description: 'Confirma a conta do usuário através do token enviado por e-mail',
                tags: ['autenticação'],
                parameters: [
                    { name: 'token', in: 'query', required: true, schema: { type: 'string' } },
                    { name: 'redirect', in: 'query', required: true, schema: { type: 'string' } },
                ],
                responses: {
                    302: { description: 'Redireciona para a URL fornecida' },
                    422: { description: 'Token inválido ou expirado' },
                },
            },
        },
        '/v1/auth/pede-recuperacao': {
            get: {
                description: 'Solicita a recuperação de senha e envia um e-mail com o link',
                tags: ['autenticação'],
                parameters: [
                    { name: 'email', in: 'query', required: true, schema: { type: 'string' } },
                    { name: 'redirect', in: 'query', required: true, schema: { type: 'string' } },
                ],
                responses: {
                    200: { description: 'E-mail de recuperação enviado com sucesso' },
                    422: { description: 'Erro no envio do e-mail' },
                },
            },
        },
        '/v1/auth/valida-token': {
            get: {
                description: 'Valida o token de recuperação de senha e retorna um novo JWT',
                tags: ['autenticação'],
                parameters: [
                    { name: 'token', in: 'query', required: true, schema: { type: 'string' } },
                    { name: 'redirect', in: 'query', required: true, schema: { type: 'string' } },
                ],
                responses: {
                    302: { description: 'Redireciona para a URL com o novo JWT' },
                    422: { description: 'Token inválido ou expirado' },
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
