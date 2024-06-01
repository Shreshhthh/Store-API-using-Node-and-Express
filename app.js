require('dotenv').config()
const express = require('express')
const app = express()
const errorHandler = require('./middleware/error-handler')
const notFound = require('./middleware/not-found')
const connectDB = require('./db/connect')
const products = require('./routes/products')
require('express-async-errors')

//middlewares
app.use(express.json())

//routes
app.get('/', (req, res) => {
    res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>');
});

app.use('/api/v1/products', products)

//products routes
app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 5000
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port,
            console.log(`Server running and up on port ${port}...`)
        )
    } catch (error) {
        console.log(error)
    }
}
start()