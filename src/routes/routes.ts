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
    
    private actualizaObra = async (req: Request, res: Response) => {
        const { alias } = req.params
        const { nombre, localidad, presupuesto } = req.body
        await db.conectarBD()
        await Obras.findOneAndUpdate(
                { _alias: alias }, 
                {
                    _nombre: nombre,
                    _localidad: localidad,
                    _presupuesto: presupuesto,

                },
                {
                    new: true,
                    runValidators: true
                }  
            )
            .then( (doc) => {
                    if (doc==null){
                        console.log('La localidad que desea modificar no existe')
                        res.json({"Error":"No existe: "+alias})
                    } else {
                        console.log('Modificada Correctamente: '+ doc) 
                        res.json(doc)
                    }
                    
                }
            )
            .catch( (err) => {
                console.log('Error: '+err)
                res.json({error: 'Error: '+err })
            }
            )
        db.desconectarBD()
    }

    private deleteObra = async (req: Request, res: Response) => {
        const { alias } = req.params
        console.log(alias)
        await db.conectarBD()
        await Obras.findOneAndDelete( { _alias:alias } )
        .then(
            (doc: any) => {
                console.log(doc)
                res.json(doc)
            }) 
        db.desconectarBD()
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
    
    private actualizaPilote = async (req: Request, res: Response) => {
        const { identif } = req.params
        const { diametro, profundidad, precioH, precioHorm } = req.body
        await db.conectarBD()
        await Pilotes.findOneAndUpdate(
                { _identif: identif }, 
                {
                    _diametro: diametro,
                    _profundidad: profundidad,
                    _precioH: precioH,
                    _precioHorm: precioHorm,

                },
                {
                    new: true,
                    runValidators: true
                }  
            )
            .then( (doc) => {
                    if (doc==null){
                        console.log('Ese pilote no existe')
                        res.json({"Error":"No existe: "+identif})
                    } else {
                        console.log('Modificación realizada correctamente: '+ doc) 
                        res.json(doc)
                    }
                    
                }
            )
            .catch( (err) => {
                console.log('Error: '+err)
                res.json({error: 'Error: '+err })
            }
            )
        db.desconectarBD()
    }


private deletePilote = async (req: Request, res: Response) => {
    const { identif } = req.params
    console.log(identif)
    await db.conectarBD()
    await Pilotes.findOneAndDelete( { _identif: identif } )
    .then(
        (doc: any) => {
            console.log(doc)
            res.json(doc)
        }) 
    db.desconectarBD()
}


    misRutas(){
        this._router.get('/obras', this.getObras),
        this._router.get('/obra/:alias', this.getObra),
        this._router.post('/', this.postObra),
        this._router.delete('/borra/:alias', this.deleteObra),
        this._router.post('/actualiza/:alias', this.actualizaObra)
        this._router.get('/plts', this.getPilotes),
        this._router.get('/plt/:identif', this.getPilote),
        this._router.post('/pilotes', this.postPilote)
        this._router.post('/actualizaP/:identif', this.actualizaPilote),
        this._router.delete('/borraP/:identif', this.deletePilote)
    }
}

const obj = new Routes()
obj.misRutas()
export const routes = obj.router



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