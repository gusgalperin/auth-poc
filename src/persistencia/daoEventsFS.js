import fs from 'fs'

class DaoEventsFs {
    constructor (ruta){
        this.ruta = ruta;
    }

    async getAll(){
        const txt = await fs.promises.readFile(this.ruta, 'utf-8')
        const events = JSON.parse(txt)
        return events
    }

    async save(event) {
        const events = await this.getAll()
        events.push(event)
        const txt = JSON.stringify(events, null, 2)
        await fs.promises.writeFile(this.ruta, txt)
    }

    async getByApiKey(apikey){
        const events = await this.getAll()
        return events.find(x => x.apiKey == apikey);
    }
}

export default DaoEventsFs