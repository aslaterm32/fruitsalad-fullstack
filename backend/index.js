// const http = require('http')
// const port = process.env.PORT

// const server = http.createServer((req, res) => {
//     res.setHeader('Content-Type', 'text/html')
//     res.end("<img src='https://pbs.twimg.com/media/Dj8XlmjV4AEzsvr.jpg'>")
// })

// server.listen(port, () => console.log(`App running on port: ${port}`))

// const express = require('express')
// const app = express()
// const port = process.env.PORT

// app.get('/', (req, res) => {
//     res.send('Hello world!')
// })

// app.get('/penguins', (req, res) => {
//     res.send('Here are the penguins')
// })

// app.get('/penguins/:name', (req, res) => {
//     res.send(req.query)
// })

// app.listen(port, () => console.log(`App running on port: ${port}`))
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fruits = require('./fruits')

const app = express()
const port = process.env.PORT

app.use(cors())
app.use('/fruits', express.json())

app.get('/', (req, res) => {
    res.send('Hello fruity!')
})

app.get('/fruits', (req, res) => {
    res.send(fruits)
})

app.post('/fruits', (req, res) => {
    const fruit = req.body

    // if no id is given, generate random unique id
    if (!fruit.id) {
        fruit.id = generateUniqueRandomID()
    }

    if (!fruit.name) {
        res.status(400).send('400 - No name given')
    } else if (!(Object.keys(fruit).toString() === ['name', 'id'].toString())) {
        console.log(Object.keys(fruit))
        res.status(400).send('400 - Invalid key type')
    } else if (checkName(fruit.name, fruits) || checkId(fruit.id, fruits)) {
        res.status(400).send('400 - Fruit already exists')
    } else {
        fruits.push(fruit)
        res.send('Added fruit sucessfully')
    }
})

// new route to delete fruit
app.delete('/fruits/:name', (req, res) => {
    const name = req.params.name.toLowerCase()
    const fruitIndex = fruits.findIndex(
        (fruit) => fruit.name.toLowerCase() === name
    )
    if (fruitIndex === -1) {
        res.status(404).send('404 - Fruit not found')
    } else {
        fruits.splice(fruitIndex, 1)
        res.status(204).send()
    }
})

// new route to update fruit

app.get('/fruits/:name', (req, res) => {
    // res.send(checkName(fruits, req.params.name))
    const name = req.params.name.toLowerCase()
    const fruit = fruits.find((fruit) => fruit.name.toLowerCase() === name)
    if (fruit === undefined) {
        res.status(404).send('404 - Fruit not found')
    } else {
        res.send(fruit)
    }
})

app.listen(port, () => console.log(`App running on port: ${port}`))

function checkName(name, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].name.toLowerCase() === name.toLowerCase()) {
            return true
        }
    }
    return false
}

function checkId(id, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
            return true
        }
    }
    return false
}

function generateUniqueRandomID() {
    let idNumber

    do {
        idNumber = Math.floor(Math.random() * 100)
    } while (checkId(idNumber, fruits))

    return idNumber
}

// function checkName(name, arr) {
//     for (let i = 0; i < arr.length; i++) {
//         if (arr[i].name.toLowerCase() === name.toLowerCase()) {
//             return fruits[i]
//         }
//     }
//     return '404 - Fruit not found'
// }
