const express = require("express")
const router = express.Router()
const { Todo } = require('../models/todo.model')
const jwt = require("jsonwebtoken")
const jwt_key = require("../config/token.config")
const { visitorDto } = require("../DTO/userDto")
const { response } = require("express")


// const user = {
//     name: 'Aya',
//     id: '123456789455'
// }
const TODOs = []

// get todos from DB
router.get('/', async (req, res) => {
    try {
        // verfiy user 
        const token = req.body.authorization.split(' ')[1]
        const user = jwt.verify(token, jwt_key)

        const TODOs = await Todo.find()

        res.json({
            TODOs
        })
    } catch (err) {
        res.status(401).json({
            message: "Not Allowed"
        })
    }

})

//////////*****************************///////////
// get todo by id
router.get('/:id', async (req, res) => {
    try {
        // verfiy user 
        const token = req.body.authorization.split(' ')[1]
        const user = jwt.verify(token, jwt_key)
        const { id } = req.params   //get id from request
        const todo = await Todo.findById(id)

        if (!todo) {
            return res.status(404).json({
                message: "TODO Not Found"
            })
        }

        if (todo.user.id != id) {
            res.status(403).json({
                todo : visitorDto(todo)
            })
        }

        res.json({
            todo
        })
    } catch (err) {
        res.status(401).json({
            message: "Not Allowed"
        })
    }

})

//////////*****************************///////////
// create todo 
router.post('/', async (req, res) => {
    try {
        // verfiy user 
        const token = req.body.authorization.split(' ')[1]
        const user = jwt.verify(token, jwt_key)

        const { title, isCompleted } = req.body // access req body 
        const todo = new Todo({              // create new todo          
            title,
            isCompleted,
            User: {
                id: user.id,
                name: user.name
            }
        })

        await todo.save()                  // save todo in my DB

        res.json({
            todo
        })
    } catch (err) {
        res.status(401).json({
            message: "Not Allowed"
        })
    }
})


//////////*****************************///////////
// update todo 
router.put('/:id', async (req, res) => {
    // verfiy user 
    const token = req.body.authorization.split(' ')[1]
    const user = jwt.verify(token, jwt_key)

    const { title, isCompleted } = req.body // access req body 

    const { id } = req.params    // get todo id 

    const todo = await Todo.findById(id)  // get todo by id 

    if (!todo) {
        return res.status(404).json({
            message: "TODO Not Found"
        })
    }

    if (todo.user.id != id) {
        return res.status(403).json({
            message: "You Not Allowed to update this todo"
        })
    }
    // update todo 
    const update = {}
    if (title) update.title = title
    if (isCompleted) update.isCompleted = isCompleted

    res.json({
        todo
    })
})

//////////*****************************///////////
// Delete todo 
router.delete('/:id', async (req, res) => {

    try {
        // verfiy user 
        const token = req.body.authorization.split(' ')[1]
        const user = jwt.verify(token, jwt_key)

        const id = req.params // get id from request 
        const todoIndex = await Todo.findIndex(id) //get index to check if todo found or not

        if (todo.user.id != id) {
            return res.status(403).json({
                message: "You Not Allowed to update this todo"
            })
        }

        if (todoIndex == -1) {
            res.status(404).json({
                message: "TODO Not Found"
            })
        }

        await Todo.findByIdAndDelete(id)   // delete todo with a given id 

        res.json({
            message: "todo removed successfully"
        })
    } catch (err) { 
        res.status(401).json({
            message:"Not Allowed"
        })
    }
})

module.exports = router;