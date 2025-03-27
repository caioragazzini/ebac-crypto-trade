const { Usuario } = require('../../../models');
const criarUsuario = require('../../../services/cria-usuario');
const { enviaEmailDeConfirmacao } =require('../../../services/envia-email');

jest.mock('../../../services/envia-email', ()=> {
    return{
        enviaEmailDeConfirmacao: jest.fn(),
    };
});

const usuarioMock = {
    email: 'teste@ebac.com.br',
    senha: 'teste@123456',
    cpf: '213.981.818-03',
    nome: 'Usuario de Teste',
};

describe('se uma senha não é informada', ()=> {
    test('ele da um erro informando a ausência da senha', ()=> {

        const usuarioTest = { ...usuarioMock, senha: undefined};
        
        console.log("🚀 ~ test ~ usuarioTest:", usuarioTest)

        return expect(()=> criarUsuario(usuarioTest, 'http://www.google.com.br')).rejects.toThrow('O campo senha é obrigatório')

    });
});

describe('se uma senha informada é fraca', ()=> {
    test('ele da um erro de senha', ()=> {

        const usuarioTest = { ...usuarioMock, senha: '123'};
        
        console.log("🚀 ~ test ~ usuarioTest:", usuarioTest)

        return expect(()=> criarUsuario(usuarioTest, 'http://www.google.com.br')).rejects.toThrow('O campo senha deve ter no minimo 5 caracteres');

    });
});

describe('se a URL de redirecionamento não for passada', ()=> {
    test('ele da um erro de URL', async()=> {
        await expect(()=> criarUsuario(usuarioMock, null)).rejects.toThrow('A URL de redirecionamento é obrigatória');

    });
});


describe.only('quando as informações são válidas', ()=> {
  
    let resposta;
    beforeEach(async()=> { 
        resposta = await criarUsuario(usuarioMock, 'http://www.google.com.br');
    });
        
    test('ele retorna usuário salvo', async()=> {
        expect(resposta.email).toBe(usuarioMock.email);
    });

    test('ele não retorna senha', async()=> {
        expect(resposta.senha).toBeUndefined();
    });

    test('ele cria um usuario não confirmado', ()=> {
        expect(resposta.confirmado).toBe(false);
    });

    test('ele insere apenas um usuario no banco', async()=> {
        expect((await Usuario.find()).length).toBe(1);
    });

    test('ele chama corretamente o envio do email de confirmação', ()=> {
        expect(enviaEmailDeConfirmacao.mock.calls.length).toBe(1);
        expect(enviaEmailDeConfirmacao.mock.calls[0][1]).toBe('http://www.google.com.br');
        expect(enviaEmailDeConfirmacao.mock.calls[0][0].email).toBe(usuarioMock.email);
    });

    });

       
        
   
