import {Request, Response, Router } from 'express'
import { Obras, Pilotes } from '../model/schemas'
import { db } from '../database/database'

class Routes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    private getObras = async (req:Request, res: Response) => {
        await db.conectarBD()
        .then( async ()=> {
            const query = await Obras.aggregate([
                {
                    $lookup: {
                        from: 'pilotes',
                        localField: '_nombre',
                        foreignField: '_nombreObra',
                        as: "_pilotes_obra"
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getObra = async (req:Request, res: Response) => {
       const { alias } = req.params
        await db.conectarBD()
        .then( async ()=> {
            const query = await Obras.aggregate([
                {
                    $lookup: {
                        from: 'pilotes',
                        localField: '_nombre',
                        foreignField: '_nombreObra',
                        as: "_pilotes_obra"
                    }
                },{
                    $match: {
                        _alias:alias
                    }
                }
            ])
           res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private postObra = async (req: Request, res: Response) => {
        const { nombre, localidad, presupuesto , alias } = req.body
        await db.conectarBD()
        const dSchema={
            _nombre : nombre,
            _localidad : localidad,
            _presupuesto : presupuesto,
            _alias : alias
        }
        const oSchema = new Obras(dSchema)
        await oSchema.save()
            .then( (doc) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }

    private getPilote = async (req: Request, res: Response) => {
        const { identif } = req.params
        await db.conectarBD()
        const x = await Pilotes.find(
                { _identif: identif }
            )
        await db.desconectarBD()
        res.json(x)
    }

    private getPilotes = async (req: Request, res: Response) => {
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query:any  = await Pilotes.find({})
            console.log(query)
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
            console.log(mensaje)
        })

        await db.desconectarBD()
    }

    private postPilote = async (req: Request, res: Response) => {
        const { identif, nombreObra, diametro , profundidad, precioH, precioHorm } = req.body
        await db.conectarBD()
        const dSchema={
            _identif : identif,
            _nombreObra : nombreObra,
            _diametro : diametro,
            _profundidad : profundidad,
            _precioH : precioH,
            _precioHorm : precioHorm
        }
        const oSchema = new Pilotes(dSchema)
        await oSchema.save()
            .then( (doc) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }
    
     
    misRutas(){
        this._router.get('/obras', this.getObras),
        this._router.get('/obra/:alias', this.getObra),
        this._router.post('/', this.postObra),
        this._router.get('/plts', this.getPilotes),
        this._router.get('/plt/:identif', this.getPilote),
        this._router.post('/pilotes', this.postPilote)
      
        
    }
}

const obj = new Routes()
obj.misRutas()
export const routes = obj.router