const nock = require('nock');
const { buscaCotacoesOnline } = require('../../../services/busca-cotacoes');

describe('buscaCotacoesOnLine', ()=> {
    describe('se a rota de cotações não retornar nenhuma cotação', ()=> {
        beforeEach(() => {
            nock(process.env.COIN_MARKETCAP_URL)
            .get('/v2/cryptocurrency/quotes/latest?symbol=BTC,ETH,BNB,XRP,ADA,SOL&convert=BRL')
            .reply(200, {
                data: {}
            });


        });

        test('ele retorna uma lista vazia', async()=> {
           
            const resposta = await buscaCotacoesOnline()
                                    ;
            expect(resposta.length).toBe(0);
    
        });  
           
        
    });
    
   
}); 