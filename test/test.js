import ClienteHTTP from './clienteHTTP.js'
import Server from '../src/server.js'
import { PORT } from '../src/config.js'
import { getDaoEvents } from '../src/persistencia/daoFactory.js'

const server = new Server(PORT)
const URL = `http://localhost:${PORT}/api`

const dao = getDaoEvents();

await server.conectar()

await casoFeliz()

await borrarTodo()

await casoSinApiKeyAlPedirToken()

await borrarTodo()

await casoApiKeyErroreaAlPedirToken()

await borrarTodo()

await casoSinTokenAlPedirRecursoSeguro()

await borrarTodo()

await casoTokenInvalidoAlPedirRecursoSeguro()

await borrarTodo()

await server.desconectar()

async function casoFeliz(){
    console.log('probando caso feliz')
    console.log('creando evento')
    let eventoCreado = await crearEvento();
    console.log(`evento creado: ${eventoCreado.id}`)

    console.log('obteniendo access token')
    let token = await obtenerAccessToken(eventoCreado.apiKey)
    console.log(`access token: ${token.access_token}`)

    console.log('obteniendo recurso seguro')
    let evento = await obtenerRecursoSeguro(eventoCreado.id, token.access_token)
    console.log('recurso seguro obtenido')
    console.log(evento)
}

async function casoSinApiKeyAlPedirToken(){
    console.log('probando caso: sin apikey al pedir token')
    console.log('creando evento')
    let eventoCreado = await crearEvento();
    console.log(`evento creado: ${eventoCreado.id}`)

    try {
        console.log('obteniendo access token sin apikey')
        let token = await obtenerAccessToken('')
    } catch (error) {
        console.log(JSON.stringify(error))
    }
}

async function casoApiKeyErroreaAlPedirToken(){
    console.log('probando caso: apikey invalida al pedir token')
    console.log('creando evento')
    let eventoCreado = await crearEvento();
    console.log(`evento creado: ${eventoCreado.id}`)

    try {
        console.log('obteniendo access token con apikey invalida')
        let token = await obtenerAccessToken(eventoCreado.apiKey.slice(0, -1))
    } catch (error) {
        console.log(JSON.stringify(error))
    }
}

async function casoSinTokenAlPedirRecursoSeguro() {
    console.log('probando caso: sin token al pedir recurso seguro')
    console.log('creando evento')
    let eventoCreado = await crearEvento();
    console.log(`evento creado: ${eventoCreado.id}`)

    console.log('obteniendo access token')
    let token = await obtenerAccessToken(eventoCreado.apiKey)
    console.log(`access token: ${token.access_token}`)

    try {
        console.log('obteniendo recurso seguro sin token')
        let evento = await obtenerRecursoSeguro(eventoCreado.id, '')
    } catch (error) {
        console.log(JSON.stringify(error))
    }
}

async function casoTokenInvalidoAlPedirRecursoSeguro() {
    console.log('probando caso: token invalido al pedir recurso seguro')
    console.log('creando evento')
    let eventoCreado = await crearEvento();
    console.log(`evento creado: ${eventoCreado.id}`)

    console.log('obteniendo access token')
    let token = await obtenerAccessToken(eventoCreado.apiKey)
    console.log(`access token: ${token.access_token}`)

    try {
        console.log('obteniendo recurso seguro con token invalido')
        let evento = await obtenerRecursoSeguro(eventoCreado.id, token.access_token.slice(0, -1))
    } catch (error) {
        console.log(JSON.stringify(error))
    }
}

async function crearEvento(){
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

    return apikeyId;
}

async function obtenerAccessToken(apikey){
    const cliente = new ClienteHTTP(`${URL}/auth/access-token`)

    let token = await cliente.post({apikey: apikey});

    return token;
}

async function obtenerRecursoSeguro(id, token){
    const cliente = new ClienteHTTP(`${URL}/events/${id}`)

    let evento = await cliente.get(null, {'x-access-token': token});

    return evento;
}

async function borrarTodo(){
    await dao.deleteAll()
}