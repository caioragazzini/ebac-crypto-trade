const Queue = require('bull');

const cotacoesWorker = require('./cotacoes');

const cotacaoQueue = new Queue('busca-cotacoes', process.env.REDIS_URL);

cotacaoQueue.process(cotacoesWorker);

const agendaTarefas = () =>{
    cotacaoQueue.add({}, { repeat: { cron: '0/15 * * * *'}})

};

module.exports ={ 
    agendaTarefas

}