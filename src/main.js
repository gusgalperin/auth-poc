import Server from './server.js'
import { PORT } from './config.js'

const server = new Server(PORT)

try {
    const puerto = await server.conectar()
    console.log(`conectado en el puerto ${puerto}`)
} catch (error) {
    console.log('ups, hubo un error...')
}
