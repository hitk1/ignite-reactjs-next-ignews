import axios from 'axios'

const api = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? '/api' : 'https://ignews-dt3o9newn-hitk1.vercel.app/api'
})

export { api }