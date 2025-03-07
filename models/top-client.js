const {Schema} = require('mongoose');

const TopClientsSchema = new Schema({
  dia: {
    type: Date,
    required: true,
  },
  gainers: [{
    usuario: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    variacao: {
      type: Number,
      required: true,
    },
  }],
  loosers: [{
    usuario: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    variacao: {
      type: Number,
      required: true,
    },
  }],
});

module.exports = TopClientsSchema;
