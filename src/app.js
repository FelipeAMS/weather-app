const express = require('express')
const app = express()

const path = require('path')
const publicPath = path.join(__dirname, '../public')

const mainRoutes = require('./routes/mainRoutes')
const apiRoutes = require('./routes/apiRoutes')

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`)
})

app.use(express.static(publicPath))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use('/api', apiRoutes)
app.use('/', mainRoutes)





