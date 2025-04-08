const { Types } = require('mongoose'); // ✅ importante importar isso
const faker = require('faker-br');
const request = require('supertest');
const jsonwebtoken = require('jsonwebtoken');
const app = require('../../../../app');

const geraJwt = (usuarioId) => {
  return jsonwebtoken.sign({ id: usuarioId }, process.env.JWT_SECRET_KEY);
};

const checaAutenticacao = (rota) => {
  describe('se o usuário não está logado', () => {
    test('ele recebe um 401', async () => {
      await request(app).get(rota).expect(401);
    });

    test('ele informa o erro de autenticação', async () => {
      const resposta = await request(app).get(rota);
      expect(resposta.text).toBe('Unauthorized');
    });
  });

  describe('se o usuário está logado mas não existe', () => {
    const usuarioIdFake = Types.ObjectId(); // ✅ corrigido aqui
    const jwt = geraJwt(usuarioIdFake);

    test('ele recebe um 401', async () => {
      await request(app)
        .get(rota)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(401);
    });

    test('ele informa o erro de autenticação', async () => {
      const resposta = await request(app)
        .get(rota)
        .set('Authorization', `Bearer ${jwt}`);
      expect(resposta.text).toBe('Unauthorized');
    });
  });
};

module.exports = {
  geraJwt,
  checaAutenticacao,
};
