import DaoEventsFs from "./daoEventsFS.js";
import { DB_PATH } from '../config.js'

const ruta =  `${DB_PATH}/db.json`

let daoEvents = new DaoEventsFs(ruta);

function getDaoEvents() {
    return daoEvents
}

export { getDaoEvents }
