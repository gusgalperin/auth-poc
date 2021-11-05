import { getDaoEvents } from '../persistencia/daoFactory.js'
import { v4 as uuidv4 } from 'uuid'
import { generateApiKey } from '../security/apiKeyGenerator.js'

const dao = getDaoEvents();

class EventsApi{
    constructor() {}

    async crearEvento(event){
        event.id = uuidv4();
        event.apiKey = generateApiKey(`${event.id}|${event.codigo}`)
        await dao.save(event);
        return {id: event.id, apiKey: event.apiKey};
    }

    async buscarPorId(id){
        let evento = await dao.getById(id);
        delete evento.apiKey
        return evento
    }

    async buscarPorApiKey(apikey){
        return await dao.getByApiKey(apikey);
    }

    async buscarTodo(){
        return await dao.getAll();
    }
}

export default EventsApi