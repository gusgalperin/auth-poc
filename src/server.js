import express from 'express'
import {router as eventsRouter } from './ruteo/eventsRouter.js'

class Server {

    constructor(puerto){

        this.puerto = puerto

        const app = express()

        app.use(express.json())
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).send('Something broke!');
        })
        app.use('/api/events', eventsRouter)

        this.app = app;
    }

    conectar(){
        return new Promise((resolve, reject) => {
            this.server = this.app.listen(this.puerto)
            this.server.on('listening', () => { resolve(this.server.address().port) })
            this.server.on('error', (error) => { reject(error) })
        })
    }

    desconectar() {
        return new Promise((resolve, reject) => {
            this.server.close(error => {
                if (error) {
                    reject()
                } else {
                    resolve()
                }
            })
        })
    }

}

export default Server