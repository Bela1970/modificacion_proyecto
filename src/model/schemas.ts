import { Schema, model } from 'mongoose'

const ObraSchema = new Schema({
    nombre: String,
    alias : String,
    localidad: String,
    presupuesto: Number,
    
},{
    collection:'obras'
})


const PiloteSchema = new Schema({
    identif: String,
    nombreObra: String,
    diametro: Number,
    profundidad: Number,
    precioH: Number,
    precioHorm: Number,
},{
    collection:'pilotes'
})

export const Obras = model('obras', ObraSchema  )
export const Pilotes = model('pilotes', PiloteSchema  )