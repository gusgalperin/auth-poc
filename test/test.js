import ClienteHTTP from './clienteHTTP.js'
import Server from '../src/server.js'
import { PORT } from '../src/config.js'
import { getDaoEvents } from '../src/persistencia/daoFactory.js'

const server = new Server(PORT)
const URL = `http://localhost:${PORT}/api`

const dao = getDaoEvents();

let tests = [
    casoFeliz,
    casoSinApiKeyAlPedirToken,
    casoApiKeyErroreaAlPedirToken,
    casoSinTokenAlPedirRecursoSeguro,
    casoTokenInvalidoAlPedirRecursoSeguro
]

await run(tests)

async function run(){
    await server.conectar()
    
    for (const test of tests) {
        await test()
        await borrarTodo()

        console.log('-------------------------------------------')
    }
    
    await server.desconectar()
}

async function casoFeliz(){
    console.log('probando caso feliz')

    let eventoCreado = await crearEvento();

    let token = await obtenerAccessToken(eventoCreado.apiKey)

    let evento = await obtenerRecursoSeguro(eventoCreado.id, token.access_token)
}

async function casoSinApiKeyAlPedirToken(){
    console.log('probando caso: sin apikey al pedir token')

    let eventoCreado = await crearEvento();

    try {
        let token = await obtenerAccessToken('')
    } catch (error) {
        console.log(JSON.stringify(error))
    }
}

async function casoApiKeyErroreaAlPedirToken(){
    console.log('probando caso: apikey invalida al pedir token')

    let eventoCreado = await crearEvento();

    try {
        let token = await obtenerAccessToken(eventoCreado.apiKey.slice(0, -1))
    } catch (error) {
        console.log(JSON.stringify(error))
    }
}

async function casoSinTokenAlPedirRecursoSeguro() {
    console.log('probando caso: sin token al pedir recurso seguro')

    let eventoCreado = await crearEvento();

    let token = await obtenerAccessToken(eventoCreado.apiKey)

    try {
        let evento = await obtenerRecursoSeguro(eventoCreado.id, '')
    } catch (error) {
        console.log(JSON.stringify(error))
    }
}

async function casoTokenInvalidoAlPedirRecursoSeguro() {
    console.log('probando caso: token invalido al pedir recurso seguro')

    let eventoCreado = await crearEvento();

    let token = await obtenerAccessToken(eventoCreado.apiKey)

    try {
        let evento = await obtenerRecursoSeguro(eventoCreado.id, token.access_token.slice(0, -1))
    } catch (error) {
        console.log(JSON.stringify(error))
    }
}

async function crearEvento(){
    console.log('creando evento')

    const evento = {
        "codigo": "ARG_CHILE_09-2021",
        "descripcion": "Venta de entradas para el partido de Argentina vs Chile por la fecha 24 de las eliminatorias para la copa del mundo Qatar 2022",
        "fechaHoraInicioEvento": "2021-10-29 00:00:00",
        "fechaHoraFinEvento": "2021-10-29 06:00:00",
        "fechaHoraInicioEncolado": "2021-10-28 22:00:00",
        "tiempoEstimadoAtencionPorUsuarioEnMinutos": 5,
        "usuariosRecurrentes": 1
    }

    const cliente = new ClienteHTTP(`${URL}/events`)

    let apikeyId = await cliente.post(evento);

    console.log(`evento creado: ${apikeyId.id}`)

    return apikeyId;
}

async function obtenerAccessToken(apikey){
    console.log(`obteniendo access token - apikey: ${apikey}`)

    const cliente = new ClienteHTTP(`${URL}/auth/access-token`)

    let token = await cliente.post({apikey: apikey});
    
    console.log(`access token: ${token.access_token}`)

    return token;
}

async function obtenerRecursoSeguro(id, token){
    console.log(`obteniendo recurso seguro - id: ${id} token: ${token}`)
    const cliente = new ClienteHTTP(`${URL}/events/${id}`)

    let evento = await cliente.get(null, {'x-access-token': token});

    console.log('recurso seguro obtenido')
    console.log(evento.id)

    return evento;
}

async function borrarTodo(){
    await dao.deleteAll()
}