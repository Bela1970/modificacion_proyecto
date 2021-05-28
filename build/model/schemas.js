"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pilotes = exports.Obras = void 0;
const mongoose_1 = require("mongoose");
const ObraSchema = new mongoose_1.Schema({
    nombre: String,
    alias: String,
    localidad: String,
    presupuesto: Number,
}, {
    collection: 'obras'
});
const PiloteSchema = new mongoose_1.Schema({
    identif: String,
    nombreObra: String,
    diametro: Number,
    profundidad: Number,
    precioH: Number,
    precioHorm: Number,
}, {
    collection: 'pilotes'
});
exports.Obras = mongoose_1.model('obras', ObraSchema);
exports.Pilotes = mongoose_1.model('pilotes', PiloteSchema);
