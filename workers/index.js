const Queue = require('bull');

const cotacoesWorker = require('./cotacoes');

const cotacaoQueue = new Queue('busca-cotacoes', process.env.REDIS_URL);

cotacaoQueue.process(cotacoesWorker);

const agendaTarefas = async () => {
    const  cotacaoAgendadas = await cotacaoQueue.getRepeatableJobs();

    for(const jobDeBusca of cotacaoAgendadas){
        await cotacaoQueue.removeRepeatableByKey(jobDeBusca.key)
    }
    
    cotacaoQueue.add({}, 
        { 
            repeat: { cron: '0/15 * * * *'},
            attempts:3,
            backoff: 5000,
        }
    );

};

module.exports ={ 
    agendaTarefas

}