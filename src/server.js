import express from 'express'
import {router as eventsRouter } from './ruteo/eventsRouter.js'
import {router as authRouter } from './ruteo/authRouter.js'

class Server {

    constructor(puerto){

        this.puerto = puerto

        const app = express()

        app.use(express.json())
        app.use('/api/events', eventsRouter)
        app.use('/api/auth', authRouter)

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