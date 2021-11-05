import axios from 'axios'

class ClienteHTTP {

    constructor(serverUrl) {
        this.serverUrl = serverUrl
    }

    async get(query, headers) {
        let url = this.serverUrl
        if (query) {
            url += '?' + query
        }

        let options = [];

        if(headers)
            options.headers = headers;

        try {
            const { data } = await axios.get(url, options)
            return data
        } catch (error) {
            const miError = new Error()
            miError.status = error.response.status
            miError.data = error.response.data
            throw miError
        }
    }

    async post(objeto) {
        try {
            const { data } = await axios.post(this.serverUrl, objeto)

            return data
        } catch (error) {
            const miError = new Error()
            miError.status = error.response.status
            miError.data = error.response.data
            throw miError
        }
    }
}

export default ClienteHTTP