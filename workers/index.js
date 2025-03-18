const Queue = require('bull');
const rankingWorker = require('./ranking');
const cotacoesWorker = require('./cotacoes');
const saldoWorker = require('./saldo');
const rankingUsuariosWorker = require('./ranking-usuarios-worker');
const lucroUsuarioWorker = require('./usuario-lucro');


const cotacaoQueue = new Queue('busca-cotacoes', process.env.REDIS_URL);
const rankingQueue = new Queue('calculo-ranking', process.env.REDIS_URL);
const aumentaSaldoQueue = new Queue('saldo', process.env.REDIS_URL);
const rankingUsuariosQueue = new Queue('ranking-usuarios', process.env.REDIS_URL);
const lucroUsuariosQueue = new Queue('usuario-lucro', process.env.REDIS_URL);

cotacaoQueue.process(cotacoesWorker);
rankingQueue.process(rankingWorker);
aumentaSaldoQueue.process(saldoWorker);
rankingUsuariosQueue.process(rankingUsuariosWorker);
lucroUsuariosQueue.process(lucroUsuarioWorker);

const agendaTarefas = async () => {
    const cotacaoAgendadas = await cotacaoQueue.getRepeatableJobs();

    for (const jobDeBusca of cotacaoAgendadas) {
        await cotacaoQueue.removeRepeatableByKey(jobDeBusca.key);
    }

    cotacaoQueue.add({}, {
        repeat: { cron: '*/15 * * * *' }, 
        attempts: 3,
        backoff: 5000,
    });

    aumentaSaldoQueue.add({}, {
        repeat: { cron: '0 0 * * *' }, 
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
        repeat: { cron: '59 23 * * *' },  
        attempts: 3,
        backoff: 5000,
    });

    rankingUsuariosQueue.add({}, { 
        repeat: { cron: '*/2 * * * *' },
        attempts: 3,
        backoff: 5000,
    });
};

const saldoTarefas = async () => {
    const saldoAgendados = await aumentaSaldoQueue.getRepeatableJobs();

    for (const jobDeBusca of saldoAgendados) {
        await aumentaSaldoQueue.removeRepeatableByKey(jobDeBusca.key);
    }

    aumentaSaldoQueue.add({}, {
        repeat: { cron: '0 0 * * *' }, 
        attempts: 3,
        backoff: 5000,
    });
};

const agendaLucroUsuarios = async () => {
    const jobsAgendados = await lucroUsuariosQueue.getRepeatableJobs();

    for (const job of jobsAgendados) {
        await lucroUsuariosQueue.removeRepeatableByKey(job.key);
    }

    lucroUsuariosQueue.add({}, {
        repeat: { cron: '0 8 * * *' }, 
        attempts: 3,
        backoff: 5000,
    });
};

module.exports = {
    agendaTarefas,
    agendaRanking,
    saldoTarefas,
    agendaLucroUsuarios,
};
