import { Router } from 'express'
import { verifyToken } from '../middleware/authJwt.js'
import EventsApi from '../negocio/eventsApi.js'

const router = Router();
const api = new EventsApi();

router.get('/', [verifyToken], async (req, res) => {
    res.send(await api.buscarTodo())
})

router.get('/:id', [verifyToken], async (req, res) => {
    const evento = await api.buscarPorId(req.params.id)
    if (evento) {
        res.send(evento)
    } else {
        res.status(404)
        res.send({ error: 'evento inexistente' })
    }
})

router.post('/', async  (req, res) => {
    console.log(req.body)
    const result = await api.crearEvento(req.body)
    res.status(201);
    res.send(result);
})

export { router }