import { Client } from 'faunadb'

//Não pode-se usar essas SDK (do stripe também), para realizar consultas pelo lado do client por conta da secret_key 

const faunaClient = new Client({
    secret: process.env.FAUNADB_KEY,
    keepAlive: false,
    domain: 'db.us.fauna.com'
})

export { faunaClient }