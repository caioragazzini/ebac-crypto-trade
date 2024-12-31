const { Schema } = require('mongoose');

const RankingDiarioSchema = new Schema({
  dia: {
    type: Date,
    required: true,
  },
  gainers: [{
    moeda: {
      type: String,
      required: true,
    },
    variacao: {
      type: Number,
      required: true,
    },
  }],
  loosers: [{
    moeda: {
      type: String,
      required: true,
    },
    variacao: {
      type: Number,
      required: true,
    },
  }],
});

module.exports = RankingDiarioSchema;