/* AUTHOR: Kevin Rothenbühler-Alarcon */

const todoDao = require("../data/todoDao")
const Task = require("../model/task")
const Todo = require("../model/todo")

/**
 * Return the list of todos for a specific user
 * @param {Request} req 
 * @param {Response} res 
 */
exports.getTodoList = async function (req, res) {
    try {
        /** @type {number} */
        const userId = req.userId
        const todos = await todoDao.getTodosByUserId(userId)
        res.status(200).json({todos: todos})
    } catch (err) {
        console.log(err)
        return res.status(500).send("An error occured")
    }    
}

/**
 * Return the list of todos for a specific user
 * @param {Request} req 
 * @param {Response} res 
 */
exports.getTodo = async function (req, res) {
    try {
        /** @type {number} */
        const userId = req.userId
        const todoId = req.query.id
        if(!todoId) return res.status(400).send("Todo id must be defined")
        const todo = await todoDao.getTodoById(todoId, userId)
        res.status(200).json({todo: todo})
    } catch (err) {
        console.log(err)
        return res.status(500).send("An error occured")
    }
}

/**
 * Store a new Todo in the database
 * @param {Request} req 
 * @param {Response} res 
 */
exports.addTodo = async function(req, res) {
    try {
        /** @type {number} */
        const userId = req.userId
        const reqTodo = req.body.todo
        
        const todo = new Todo(null, reqTodo.title, new Date(reqTodo.createdAt), new Date(reqTodo.lastUpdatedAt), reqTodo.tasks.map(task => Task.fromJson(task)))
        const result = await todoDao.addTodo(todo, userId)
        if (!result) return res.status(400).send("Failed to insert the new todo")   
        res.status(200).send("New todo added")
    } catch (err) {
        console.log(err)
        return res.status(500).send("An error occured")
    }    
}

/**
 * Update an existing Todo
 * @param {Request} req 
 * @param {Response} res 
 */
exports.updateTodo = async function (req, res){
    try {
        const reqTodo = req.body.todo    
        const todo = Todo.fromJson(reqTodo)    
        const result = await todoDao.updateTodo(todo)
        if(!result) return res.status(400).send("Update failed")
        res.status(200).send("Todo updated")
    } catch (err) {
        console.log(err)
        return res.status(500).send("An error occured")
    }
}

/**
 * Delete an existing Todo
 * @param {Request} req 
 * @param {Response} res 
 */
exports.deleteTodo = async function(req, res) {
    try {
        const userId = req.userId
        const todoId = req.query.id
        if(!todoId) return res.status(400).send("Todo id must be defined")
        const result = await todoDao.deleteTodo(todoId, userId)
        if(!result) return res.status(400).send("No todo with this id to delete for the connected user")
        res.status(200).send("Todo deleted")
    } catch (err) {
        console.log(err)
        return res.status(500).send("An error occured")
    }
}