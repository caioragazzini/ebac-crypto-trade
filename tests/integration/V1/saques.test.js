const request = require('supertest');
const faker = require('faker-br');
const app = require('../../../app');
const { geraJwt } = require('./shared/autenticacao');
const { Usuario } = require('../../../models');

describe('/v1/saques', () => {
  let usuario, jwt;

  beforeEach(async () => {
    await Usuario.deleteMany();

    usuario = await Usuario.create({
      nome: faker.name.findName(),
      email: faker.internet.email(),
      senha: 'senhasegura',
      cpf: faker.br.cpf(),
      confirmado: true,
      moedas: [
        {
          codigo: 'BRL',
          quantidade: 1000,
        },
      ],
      saques: [],
    });

    jwt = geraJwt(usuario._id);
  });

  describe('GET /v1/saques-e-saldo', () => {
    test('deve retornar 200 e array de saques vazio', async () => {
      const res = await request(app)
        .get('/v1/saques')
        .set('Authorization', `Bearer ${jwt}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.saques)).toBe(true);
      expect(res.body.sucesso).toBe(true);
    });
  });

  describe('POST /v1/saques - saque com saldo suficiente e OTP válido', () => {
    test('deve sacar com sucesso', async () => {
      const segredo = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD';
      usuario.segredoOtp = segredo;
      await usuario.save();

      const { authenticator } = require('otplib');
      const otp = authenticator.generate(segredo);

      const res = await request(app)
        .post('/v1/saques')
        .set('Authorization', `Bearer ${jwt}`)
        .set('totp', otp)
        .send({ valor: 200 });

      expect(res.status).toBe(200);
      expect(res.body.sucesso).toBe(true);
      expect(res.body.saldo).toBeLessThan(1000);
      expect(res.body.saques.length).toBe(1);
    });
  });

  describe('POST /v1/saques - saque com saldo insuficiente', () => {
    test('deve retornar erro 422', async () => {
      const segredo = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD';
      usuario.segredoOtp = segredo;
      await usuario.save();

      const { authenticator } = require('otplib');
      const otp = authenticator.generate(segredo);

      const res = await request(app)
        .post('/v1/saques')
        .set('Authorization', `Bearer ${jwt}`)
        .set('totp', otp)
        .send({ valor: 99999 });

      expect(res.status).toBe(422);
      expect(res.body.sucesso).toBe(false);
      expect(res.body.erro).toBe('Saldo insuficiente. Tente outro valor.');
    });
  });

  describe('POST /v1/saques - saque com OTP inválido', () => {
    test('deve retornar erro 401', async () => {
      const segredo = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD';
      usuario.segredoOtp = segredo;
      await usuario.save();

      const res = await request(app)
        .post('/v1/saques')
        .set('Authorization', `Bearer ${jwt}`)
        .set('totp', '000000')
        .send({ valor: 100 });

      expect(res.status).toBe(401);
      expect(res.body.sucesso).toBe(false);
      expect(res.body.erro).toMatch(/OTP inválido/);
    });
  });
});
