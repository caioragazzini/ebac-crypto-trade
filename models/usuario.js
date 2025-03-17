const { Schema }= require('mongoose');
const { cpf }= require('cpf-cnpj-validator');

const MoedasSchema = new Schema({
    quantidade: {
        type: Number,
        require: true,
    },
    codigo:{
        type: String,
        require: true,
        unique: true,
        sparse: true,
    }
});

const DepositoSchema = new Schema({
    valor: {
        type: Number,
        required: true,
        min: 100,
    },
    data:{
        type: Date,
        required: true,
    },
    cancelado: {
        type: Boolean,
        default: false,
    },
});

const SaqueSchema = new Schema({
    valor: {
        type: Number,
        required: true,
        min: 1,
    },
    data: {
        type: Date,
        required: true,
    },

});

const UsuarioSchema= new Schema({
    nome:
    {
        type: String, 
        required: true, 
        min: 4
    },
    cpf:
    {
        type: String, 
        required: true, 
        unique: true, 
        validate: 
        {
            validator: function(v) 
            {
             return cpf.isValid(v);
            }, 
            message: props=> `${props.value} não é um cpf válido`
        },
    },
    email:
    {
        type: String, 
        required: true, 
        min: 4, 
        unique: true, 
        validate:
        {
            validator : function(v) 
                {
                    return v.match('@');
                },
            message: props => `${props.value} não é um email válido`,
        },
    },  
    senha:
        {
            type: String, 
            required: true, 
            select: false,
        },

    confirmado:{
        type: Boolean,
        default: false,
    },
    tokenDeConfirmacao:{
        type: String,
        unique:true,
        sparse: true,
        select: false,
    },

    tokenDeRecuperacao:{
        type: String,
        unique:true,
        sparse: true,
        select: false,
    },
    
    depositos:[DepositoSchema],
    saques:[SaqueSchema],
    moedas:[MoedasSchema],

});

module.exports = UsuarioSchema;
