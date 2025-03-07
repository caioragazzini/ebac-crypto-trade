const express = require('express');
const { buscaRankingUsuarios } = require('../../services');
const { logger } = require('../../utils');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let dia;
        const diaStr = req.query.dia;

        console.log("Iniciando busca de ranking de usuários..."); 

        if (diaStr) {
            const regex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (regex.test(diaStr)) {
                const [day, month, year] = diaStr.split('/').map(Number);
                dia = new Date(year, month - 1, day);
                console.log(`Data fornecida: ${dia}`); 
            } else {
                console.log(`Formato de data inválido: ${diaStr}`); 
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Formato de data inválido. Use o formato dd/mm/yyyy.',
                });
            }
        } else {
            dia = new Date();
            console.log(`Nenhuma data fornecida, usando data atual: ${dia}`);
        }

        console.log("Chamando buscaRankingUsuarios..."); 
        console.log(`buscaRankingUsuarios: ${typeof buscaRankingUsuarios}`); 
        const ranking = await buscaRankingUsuarios(dia);

        console.log("Ranking obtido:", ranking); 

        res.json({
            sucesso: true,
            ranking,
        });
        console.log("Ranking enviado com sucesso."); 
    } catch (e) {
        logger.error(`Erro ao buscar ranking de usuários: ${e.message}`);
        console.error(`Erro ao buscar ranking de usuários: ${e.message}`); 
        res.status(500).json({
            sucesso: false,
            erro: e.message,
        });
        console.log("Erro ao buscar ranking de usuários."); 
    }
});

module.exports = router;