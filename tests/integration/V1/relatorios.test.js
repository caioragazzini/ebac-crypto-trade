const request = require('supertest');
const faker = require('faker-br');
const app = require('../../../app');

const { checaAutenticacao, geraJwt } = require('./shared/autenticacao');
const { Relatorio, Usuario } = require('../../../models');

describe('/v1/relatorios/pnl', () => {
  checaAutenticacao('/v1/relatorios/pnl');

  describe('quando o usuário existe', () => {
    let usuario, jwt;

    beforeEach(async () => {
      await Relatorio.deleteMany(); // limpa o BD entre os testes
      await Usuario.deleteMany();

      usuario = await Usuario.create({
        senha: 'qualquer-uma',
        email: faker.internet.email(),
        confirmado: true,
        nome: 'Um usuário de teste',
        cpf: faker.br.cpf(),
      });

      jwt = geraJwt(usuario._id);
    });

    describe('e não possui nenhum relatório', () => {
      test('deve retornar 200', () => {
        return request(app)
          .get('/v1/relatorios/pnl')
          .set('Authorization', `Bearer ${jwt}`)
          .expect(200);
      });

      test('deve retornar pnl zerado', () => {
        return request(app)
          .get('/v1/relatorios/pnl')
          .set('Authorization', `Bearer ${jwt}`)
          .then(res => {
            expect(res.body.pnl).toBe(0);
            expect(res.body.sucesso).toBe(true);
          });
      });
    });

    describe('e possui relatório de um único dia', () => {
      beforeEach(async () => {
        const dataRelatorio = new Date();
        dataRelatorio.setHours(0, 0, 0, 0); // zera a hora

        await Relatorio.create({
          saldo: 4200,
          usuario: usuario._id,
          data: dataRelatorio,
        });
      });

      test('deve retornar 200', () => {
        return request(app)
          .get('/v1/relatorios/pnl')
          .set('Authorization', `Bearer ${jwt}`)
          .expect(200);
      });

      test('deve retornar o saldo desse dia como pnl', () => {
        return request(app)
          .get('/v1/relatorios/pnl')
          .set('Authorization', `Bearer ${jwt}`)
          .then(res => {
            expect(res.body.pnl).toBe(4200);
            expect(res.body.sucesso).toBe(true);
          });
      });
    });

    describe('e possui relatórios de dois dias', () => {
      beforeEach(async () => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); // zera hora

        const ontem = new Date(hoje);
        ontem.setDate(hoje.getDate() - 1); // um dia antes

        await Relatorio.create({
          saldo: 4200,
          usuario: usuario._id,
          data: hoje,
        });

        await Relatorio.create({
          saldo: 4000,
          usuario: usuario._id,
          data: ontem,
        });
      });

      test('deve retornar 200', () => {
        return request(app)
          .get('/v1/relatorios/pnl')
          .set('Authorization', `Bearer ${jwt}`)
          .expect(200);
      });

      test('deve retornar a diferença entre os dias como pnl', () => {
        return request(app)
          .get('/v1/relatorios/pnl')
          .set('Authorization', `Bearer ${jwt}`)
          .then(res => {
            expect(res.body.pnl).toBe(200);
            expect(res.body.sucesso).toBe(true);
          });
      });
    });
  });
});
