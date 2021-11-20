import axios from 'axios'

const api = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? '/api' : process.env.APP_URL!
})

export { api }