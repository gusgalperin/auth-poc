import { Router } from 'express'
import { verifyToken } from '../middleware/authJwt.js'
import EventsApi from '../negocio/eventsApi.js'

const router = Router();
const api = new EventsApi();

router.get('/', [verifyToken], async (req, res) => {
    res.send('secured content')
})

router.post('/', async  (req, res) => {
    console.log(req.body)
    const result = await api.crearEvento(req.body)
    res.status(401);
    res.send(result);
})

export { router }