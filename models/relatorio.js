const { Schema } = require('mongoose');

const RelatorioSchema= new Schema({
    saldo: {
        type: Number,
        required: true,
        min: 0,
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    data: {
        type: Date,
        required: true,
    },
});

module.exports = RelatorioSchema;