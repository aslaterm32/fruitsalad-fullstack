const fruitForm = document.querySelector('#inputSection form')
const fruitList = document.querySelector('#fruitSection ul')
const fruitNutrition = document.querySelector('#nutritionSection p')
const imageSection = document.querySelector('#imageSection')
const createForm = document.querySelector('#createForm')

let cal = 0
let fruitCal = {}
let fruitImage = {}

fruitForm.addEventListener('submit', extractFruit)
createForm.addEventListener('submit', createNewFruit)

function extractFruit(event) {
    event.preventDefault()
    if (event.target.fruitInput) {
        fetchFruitData(event.target.fruitInput.value)
        fetchFruitImage(event.target.fruitInput.value)
    } else {
        console.log('Introduce a fruit in the form')
    }
    event.target.fruitInput.value = ''
}

function fetchFruitData(fruit) {
    fetch(`https://fruityagain.onrender.com/fruits/${fruit}`)
        .then((resp) => resp.json())
        .then((data) => addFruit(data))
        .catch((e) => console.log(e))
}

function fetchFruitImage(fruit) {
    fetch(
        `https://pixabay.com/api/?key=38441097-fdf0f513a70c147f8e5c32c96&q=${fruit.toLowerCase()}`
    )
        .then((resp) => resp.json())
        .then((data) => {
            fruitImage[fruit.toLowerCase()] = data.hits[0]
            console.log(fruitImage)
        })
        .catch((e) => console.log(e))
}

function addFruit(fruit) {
    const li = document.createElement('li')
    const img = document.createElement('img')
    img.src = fruitImage[fruit.name.toLowerCase()].largeImageURL
    li.textContent = fruit.name
    fruitList.appendChild(li)
    li.appendChild(img)
    li.addEventListener('click', removeListItem, { once: true })

    fruitCal[fruit.name] = fruit.nutritions.calories

    cal += fruitCal[fruit.name]
    fruitNutrition.textContent = cal
}

function removeListItem(event) {
    const fruitName = event.target.textContent
    const li = event.target
    cal -= fruitCal[fruitName]
    fruitNutrition.textContent = cal
    li.remove()
}

async function createNewFruit(event) {
    event.preventDefault()

    const data = { name: event.target.fruitInput.value }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }

    const response = await fetch(
        `https://fruityagain.onrender.com/fruits/`,
        options
    )

    let messageStatus = document.querySelector('#message')

    if (response.status === 201) {
        event.target.fruitInput.value = ''
        messageStatus.textContent = 'Fruit successfully created'
        setTimeout(() => {
            messageStatus.textContent = ''
        }, 4000)
    } else {
        event.target.fruitInput.value = ''
        messageStatus.textContent = 'This fruit already exists'
        setTimeout(() => {
            messageStatus.textContent = ''
        }, 4000)
    }
}
