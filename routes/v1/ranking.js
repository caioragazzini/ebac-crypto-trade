const express = require('express');
const { buscaRankingNoBanco } = require('../../services');
const { logger } = require('../../utils');

const router = express.Router();


function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('/').map(num => parseInt(num, 10));
  
    return new Date(year, month - 1, day);
}

router.get('/', async (req, res) => {
    try {
        let dia;
        const diaStr = req.query.dia; 

        if (diaStr) {
           
            const regex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (regex.test(diaStr)) {
                dia = parseDate(diaStr);
            } else {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Formato de data inválido. Use o formato dd/mm/yyyy.'
                });
            }
        } else {
           
            dia = new Date(); 
        }

        const ranking = await buscaRankingNoBanco(dia);

        console.log("🚀 ~ router.get ~ ranking:", ranking)

        res.json({
            sucesso: true,
            ranking: ranking[0], 
        });
    } catch (e) {
        logger.error(`Erro ao buscar o ranking: ${e.message}`);
        
        res.status(500).json({
            sucesso: false,
            erro: e.message,
        });
    }
});

module.exports = router;
