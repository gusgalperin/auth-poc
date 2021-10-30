import { Router } from 'express'
import EventsApi from '../negocio/eventsApi.js'
import { createJwt } from '../security/jwt.js'

const router = Router();
const api = new EventsApi();

router.post('/access-token', async  (req, res) => {
    const apikey = req.body.apikey;

    if(!apikey){
        res.status(403);
        res.send('missing required apiKey')
        return;
    }

    const event = await api.buscarPorApiKey(apikey);

    if(!event){
        res.status(403);
        res.send('invalid apikey');
        return;
    }

    const token = createJwt({id:event.id, apiKey:apikey})

    res.status(200);
    res.send({access_token: token});
})

export { router }