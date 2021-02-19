"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pilotes = exports.Obras = void 0;
const mongoose_1 = require("mongoose");
const ObraSchema = new mongoose_1.Schema({
    _nombre: String,
    _alias: String,
    _localidad: String,
    _presupuesto: Number,
    _precioH: Number,
    _precioHorm: Number,
}, {
    collection: 'obras'
});
const PiloteSchema = new mongoose_1.Schema({
    _identif: String,
    _nombreObra: String,
    _diametro: Number,
    _profundidad: Number,
}, {
    collection: 'pilotes'
});
exports.Obras = mongoose_1.model('obras', ObraSchema);
exports.Pilotes = mongoose_1.model('pilotes', PiloteSchema);
