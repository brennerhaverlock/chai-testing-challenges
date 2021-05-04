const express = require('express')
const router = express.Router();

const User = require('../models/user')
const Message = require('../models/message')

/** Route to get all messages. */
router.get('/', (req, res) => {
    // TODO: Get all Message objects using `.find()`
    message.find().then((messages) => {

    // TODO: Return the Message objects as a JSON list
        return res.send(`All Messages route`)
        })
        .catch((err) => {
            throw err.message
            })
})

/** Route to get one message by id. */
router.get('/:messageId', (req, res) => {
    // TODO: Get the Message object with id matching `req.params.id`
    // using `findOne`
    message = Message.findOne(req.params.id)
    // TODO: Return the matching Message object as JSON
    return message.json()
})

/** Route to add a new message. */
router.post('/', (req, res) => {
    let message = new Message(req.body)
    message.save()
    .then(message => {
        return User.findById(message.author)
    })
    .then(user => {
        // console.log(user)
        user.messages.unshift(message)
        return user.save()
    })
    .then(() => {
        return res.send(message)
    }).catch(err => {
        throw err.message
    })
})

/** Route to update an existing message. */
router.put('/:messageId', (req, res) => {
    // TODO: Update the matching message using `findByIdAndUpdate`
    message = Message.findByIdAndUpdate(req.params.id)
    // TODO: Return the updated Message object as JSON
    return message.json()
})

/** Route to delete a message. */
router.delete('/:messageId', (req, res) => {
    // TODO: Delete the specified Message using `findByIdAndDelete`. Make sure
    // to also delete the message from the User object's `messages` array
    message = Message.findByIdAndDelete(req.params.id)
    u = req.user
    for(let m = 0; m<len(u.messages); m++){
        if(u.messages[m]==message){
            u.message.splice(m, 1)
        }
    }
    // TODO: Return a JSON object indicating that the Message has been deleted
    return message.json()
})

module.exports = router