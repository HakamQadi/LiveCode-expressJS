const express = require('express')
const fs = require("fs");
const app = express()
// app.use(cors())
app.use(express.json());

const users = JSON.parse(fs.readFileSync('./data.json'));

// get all users
app.get('/', (req, res) => {
    res.status(200).json(users)
})

// get user
app.get('/:id', (req, res) => {
    try {
        const id = req.params.id * 1
        const userWithId = users.find(el => el.id === id)
        res.status(200).json(userWithId)
    } catch (error) {
        res.status(404).send('User Not Found');
    }
})

// create user
app.post('/create', (req, res) => {
    try {
        const newUserData = req.body; // Received data
        let newId = users[users.length - 1].id + 1
        const newUser = Object.assign({ id: newId }, newUserData)  // combine two objects together

        // console.log(newUser)

        users.push(newUser)

        fs.writeFile('./data.json', JSON.stringify(users), (err) => {
            res.status(201).json(users);     //201 	Created
        })
    } catch (error) {
        res.status(400).send('Invalid JSON data'); //400 Bad Request
    }
})

// edit user
app.patch("/edit/:id", (req, res) => {
    try {
        const id = req.params.id * 1
        const newEdit = req.body
        const editUser = users.find(el => el.id === id)
        const index = users.indexOf(editUser)
        Object.assign(editUser, newEdit)
        users[index] = editUser


        fs.writeFile('./data.json', JSON.stringify(users), (err) => {
            if (err) {
                res.status(500).json({
                    error: 'Server Error'
                });
            }
            else {
                res.status(200).json(editUser);
            }
        })
    } catch (error) {
        res.status(404).json({
            error: 'User Not Found'
        });
    }
})

// delete user
app.delete('/delete/:id', (req, res) => {
    try {
        const id = req.params.id * 1
        const userDelete = users.find(el => el.id === id)
        if (!userDelete) {
            res.status(404).json({
                error: 'User Not Found'
            });
        }
        else {
            const index = users.indexOf(userDelete)
            users.splice(index, 1)

            fs.writeFile('./data.json', JSON.stringify(users), (err) => {
                if (err) {
                    res.status(500).json({
                        error: 'Server Error'
                    });
                }
                else {
                    res.status(200).json({
                        message: 'User Deleted Successfully'
                    });
                }
            })
        }
    } catch (error) {
        res.status(400).json({
            error: 'Something error'
        });
    }
})




// listen to the server
app.listen(8080, () => {
    console.log('http://localhost:8080')
})
