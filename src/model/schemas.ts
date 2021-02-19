import { Schema, model } from 'mongoose'

const ObraSchema = new Schema({
    _nombre: String,
    _alias : String,
    _localidad: String,
    _presupuesto: Number,
    _precioH: Number,
    _precioHorm: Number,
},{
    collection:'obras'
})


const PiloteSchema = new Schema({
    _identif: String,
    _nombreObra: String,
    _diametro: Number,
    _profundidad: Number,
},{
    collection:'pilotes'
})

export const Obras = model('obras', ObraSchema  )
export const Pilotes = model('pilotes', PiloteSchema  )