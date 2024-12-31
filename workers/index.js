const Queue = require('bull');
const rankingWorker = require('./ranking');
const cotacoesWorker = require('./cotacoes');

const cotacaoQueue = new Queue('busca-cotacoes', process.env.REDIS_URL);
const rankingQueue = new Queue('calculo-ranking', process.env.REDIS_URL);

cotacaoQueue.process(cotacoesWorker);
rankingQueue.process(rankingWorker);

const agendaTarefas = async () => {
    const cotacaoAgendadas = await cotacaoQueue.getRepeatableJobs();

    for (const jobDeBusca of cotacaoAgendadas) {
        await cotacaoQueue.removeRepeatableByKey(jobDeBusca.key);
    }

    cotacaoQueue.add({}, {
        repeat: { cron: '*/1 * * * *' },  // Executa a cada minuto para teste
        attempts: 3,
        backoff: 5000,
    });
};

const agendaRanking = async () => {
    const rankingsAgendados = await rankingQueue.getRepeatableJobs();

    for (const jobDeRanking of rankingsAgendados) {
        await rankingQueue.removeRepeatableByKey(jobDeRanking.key);
    }

    rankingQueue.add({}, {
        repeat: { cron: '*/1 * * * *' },  // Executa a cada minuto para teste
        attempts: 3,
        backoff: 5000,
    });
};

module.exports = {
    agendaTarefas,
    agendaRanking,
};
