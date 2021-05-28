"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const schemas_1 = require("../model/schemas");
const database_1 = require("../database/database");
class Routes {
    constructor() {
        this.getObr = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield schemas_1.Obras.find();
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getObras = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield schemas_1.Obras.aggregate([
                    {
                        $lookup: {
                            from: 'pilotes',
                            localField: 'nombre',
                            foreignField: 'nombreObra',
                            as: "_pilotes_obra"
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getObra = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { alias } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield schemas_1.Obras.aggregate([
                    {
                        $lookup: {
                            from: 'pilotes',
                            localField: 'nombre',
                            foreignField: 'nombreObra',
                            as: "_pilotes_obra"
                        }
                    }, {
                        $match: {
                            alias: alias
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.postObra = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombre, localidad, presupuesto, alias } = req.body;
            yield database_1.db.conectarBD();
            const dSchema = {
                nombre: nombre,
                localidad: localidad,
                presupuesto: presupuesto,
                alias: alias
            };
            const oSchema = new schemas_1.Obras(dSchema);
            yield oSchema.save()
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.actualizaObra = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { alias } = req.params;
            const { nombre, localidad, presupuesto } = req.body;
            yield database_1.db.conectarBD();
            yield schemas_1.Obras.findOneAndUpdate({ alias: alias }, {
                nombre: nombre,
                localidad: localidad,
                presupuesto: presupuesto,
            }, {
                new: true,
                runValidators: true
            })
                .then((doc) => {
                if (doc == null) {
                    console.log('La localidad que desea modificar no existe');
                    res.json({ "Error": "No existe: " + alias });
                }
                else {
                    console.log('Modificada Correctamente: ' + doc);
                    res.json(doc);
                }
            })
                .catch((err) => {
                console.log('Error: ' + err);
                res.json({ error: 'Error: ' + err });
            });
            database_1.db.desconectarBD();
        });
        this.deleteObra = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { alias } = req.params;
            console.log(alias);
            yield database_1.db.conectarBD();
            yield schemas_1.Obras.findOneAndDelete({ alias: alias })
                .then((doc) => {
                console.log(doc);
                res.json(doc);
            });
            database_1.db.desconectarBD();
        });
        this.getPilote = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { identif } = req.params;
            yield database_1.db.conectarBD();
            const x = yield schemas_1.Pilotes.findOne({ identif: identif });
            yield database_1.db.desconectarBD();
            res.json(x);
        });
        this.getPilotes = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
                console.log(mensaje);
                const query = yield schemas_1.Pilotes.find({});
                console.log(query);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
                console.log(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.postPilote = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { identif, nombreObra, diametro, profundidad, precioH, precioHorm } = req.body;
            yield database_1.db.conectarBD();
            const dSchema = {
                identif: identif,
                nombreObra: nombreObra,
                diametro: diametro,
                profundidad: profundidad,
                precioH: precioH,
                precioHorm: precioHorm
            };
            const oSchema = new schemas_1.Pilotes(dSchema);
            yield oSchema.save()
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.actualizaPilote = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { identif } = req.params;
            const { diametro, profundidad, precioH, precioHorm } = req.body;
            yield database_1.db.conectarBD();
            yield schemas_1.Pilotes.findOneAndUpdate({ identif: identif }, {
                diametro: diametro,
                profundidad: profundidad,
                precioH: precioH,
                precioHorm: precioHorm,
            }, {
                new: true,
                runValidators: true
            })
                .then((doc) => {
                if (doc == null) {
                    console.log('Ese pilote no existe');
                    res.json({ "Error": "No existe: " + identif });
                }
                else {
                    console.log('Modificación realizada correctamente: ' + doc);
                    res.json(doc);
                }
            })
                .catch((err) => {
                console.log('Error: ' + err);
                res.json({ error: 'Error: ' + err });
            });
            database_1.db.desconectarBD();
        });
        this.deletePilote = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { identif } = req.params;
            console.log(identif);
            yield database_1.db.conectarBD();
            yield schemas_1.Pilotes.findOneAndDelete({ _identif: identif })
                .then((doc) => {
                console.log(doc);
                res.json(doc);
            });
            database_1.db.desconectarBD();
        });
        this._router = express_1.Router();
    }
    get router() {
        return this._router;
    }
    misRutas() {
        this._router.get('/obr', this.getObr),
            this._router.get('/obras', this.getObras),
            this._router.get('/obra/:alias', this.getObra),
            this._router.post('/', this.postObra),
            this._router.delete('/borra/:alias', this.deleteObra),
            this._router.post('/actualiza/:alias', this.actualizaObra);
        this._router.get('/plts', this.getPilotes),
            this._router.get('/plt/:identif', this.getPilote),
            this._router.post('/pilotes', this.postPilote);
        this._router.post('/actualizaP/:identif', this.actualizaPilote),
            this._router.delete('/borraP/:identif', this.deletePilote);
    }
}
const obj = new Routes();
obj.misRutas();
exports.routes = obj.router;
/*,
    (err:any, doc) => {
            if(err) console.log(err)
            else{
                if (doc == null) {
                    console.log(`No encontrado`)
                    res.send(`No encontrado`)
                }else {
                    console.log('Borrado correcto: '+ doc)
                    res.send('Borrado correcto: '+ doc)
                }
            }
        }*/ 
