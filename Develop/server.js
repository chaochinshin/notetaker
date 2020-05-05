var fs = require('fs')
const express = require('express')
const app = express()
const port = 3000

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

//The root argument specifies the root directory from which to serve static assets. For more information on the options argument, see express.static.
//For example, use the following code to serve images, CSS files, and JavaScript files in a directory named public:
app.use(express.static('public'))

app.get('/notes', (req, res) => res.sendFile(__dirname + "/public/notes.html"))
app.get('/api/notes', (req, res) => {
    let db = fs.readFileSync("db/db.json")
    let jsonparse = JSON.parse(db)
    res.json(jsonparse)
})
app.get('*', (req, res) => res.sendFile(__dirname + "/public/index.html"))
app.use(express.json())
app.post('/api/notes', (req, res) => {
    let db = fs.readFileSync("db/db.json")
    let jsonparse = JSON.parse(db)
    var biggestID = jsonparse.map(note => note.id).reduce((accumulator,current) => {
        if(accumulator > current)   {
            return accumulator}
            else return current
},0)
    
    let newnote = {title: req.body.title, text: req.body.text, id: biggestID + 1,
    }
    jsonparse.push(newnote)
    fs.writeFile("db/db.json", JSON.stringify(jsonparse),(err) => {
        if(err) throw err
    })
    res.json(newnote)
})
app.delete('/api/notes/:id',(req, res) => {
    let db = fs.readFileSync("db/db.json")
    console.log(req.params.id)
    let jsonparse = JSON.parse(db)
    jsonparse = jsonparse.filter(note => {
        console.log(note.id !== req.params.id)
        return note.id !== parseInt(req.params.id)})
        console.log(jsonparse)
    fs.writeFile("db/db.json", JSON.stringify(jsonparse),(err) => {
        if(err) throw err
    })
    res.json(jsonparse)
})
