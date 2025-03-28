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
    describe('se a rota de cotações retorna cotações validas', ()=> {
        let resposta;
        beforeEach(async() => {
            nock(process.env.COIN_MARKETCAP_URL)
            .get('/v2/cryptocurrency/quotes/latest?symbol=BTC,ETH,BNB,XRP,ADA,SOL&convert=BRL')
            .reply(200, {
                data: {
                    BTC: [{
                        symbol:'BTC',
                        quote: {
                            BRL: {
                                price: 100500
                            }
                        }
                    }],
                    ETH: [{
                        symbol:'ETH',
                        quote: {
                            BRL: {
                                price: 12000
                            }
                        }
                    }],

                }
            });

            resposta = await buscaCotacoesOnline(); 
        });

        test('ele retorna uma lista de cotações', async()=> {

            
            expect(resposta.length).toBe(2);
        });

        test('ele a cotação corretamente', async()=> {
           
            expect(resposta[0].valor).toBe(100500);
            expect(resposta[0].moeda).toBe('BTC');
            expect(resposta[1].valor).toBe(12000);
            expect(resposta[1].moeda).toBe('ETH');
        });

        test('ele adiciona hoje como a data da cotações', async()=> {
            
            expect(resposta[0].data.getDate()).toBe((new Date()).getDate());
            expect(resposta[0].data.getDate()).toBe((new Date()).getDate());
        });

    });
   
}); 