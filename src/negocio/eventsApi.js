import { getDaoEvents } from '../persistencia/daoFactory.js'
import {v4 as uuidv4} from 'uuid'

const dao = getDaoEvents();

class EventsApi{
    constructor() {}

    async crearEvento(event){
        event.id = uuidv4();
        await dao.save(event);
        return {id: event.id};
    }
}

export default EventsApi