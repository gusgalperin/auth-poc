import { Router } from 'express'
import { verifyToken } from '../middleware/authJwt.js'
import EventsApi from '../negocio/eventsApi.js'

const router = Router();
const api = new EventsApi();

router.get('/', [verifyToken], async (req, res) => {
    res.send(await api.buscarTodo())
})

router.post('/', async  (req, res) => {
    console.log(req.body)
    const result = await api.crearEvento(req.body)
    res.status(201);
    res.send(result);
})

export { router }