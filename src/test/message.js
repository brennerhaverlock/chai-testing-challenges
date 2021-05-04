require('dotenv').config()
const app = require('../server.js')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert

const User = require('../models/user.js')
const Message = require('../models/message.js')

chai.config.includeStack = true

const expect = chai.expect
const should = chai.should()
chai.use(chaiHttp)

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})


describe('Message API endpoints', () => {
    beforeEach((done) => {
        // TODO: add any beforeEach code here
        const sampleUser = new User({
            username: "username",
            password: "password",
        })
        sampleUser.save()
        const sampleMessage = new Message({
            title: "Test Title",
            body: "Test Body",
            author: sampleUser._id
        })
        sampleMessage.save()
        .then(() => {
            done()
        })
    })

    afterEach((done) => {
        // TODO: add any afterEach code here
        User.deleteMany({ username: ['myuser'] })
        Message.deleteMany({ title: ['Test Title', 'Test Title2', 'Updated Test Title'] })
        .then(() => {
            done()
        })  
    })

    it('should load all messages', (done) => {
        // TODO: Complete this
        chai.request(app)
        .get('/')
        .end((err, res) => {
            if(err) { done(err) }
            expect(res).to.have.status(200)
            expect(res.body.messages).to.be.an("array")
            done()
        })
    })

    it('should get one specific message', (done) => {
        // TODO: Complete this
        Message.findOne({title: 'testTitle'})
        .then(message => {
            chai.request(app)
            .get(`/messages/${message._id}`)
            .end( (err, res) => {
                if (err) {
                    done(err)
                } 
                else {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body.title).to.be.deep.equal('Test Title')
                    expect(res.body.body).to.be.deep.equal('Test Body')
                    done()
                }
            })
        })
    })

    it('should post a new message', (done) => {
        // TODO: Complete this
        User.findOne({username: 'myuser'})
        .then( user => {
            chai.request(app)
            .post(`/messages`)
            .send({title: 'Test Title2', body: 'Test Body2', author: user})
            .end( (err, res) => {
                if (err) {
                    done(err)
                } 
                else {
                    expect(res.body.title).to.be.deep.equal('Test Title2')
                    expect(res.body.body).to.be.deep.equal('Test Body2')
                    expect(res.body.author).to.be.equal(`${user._id}`)

                    Message.findOne({title: 'Test Title2'})
                    .then( (message) => {
                        expect(message).to.be.an('object')
                        done()
                    })
                }
            })
        })
    })

    it('should update a message', (done) => {
        // TODO: Complete this
        Message.findOne({title: 'Test Title'})
        .then( message => {
            chai.request(app)
            .put(`/messages/${message._id}`)
            .send({title: 'Updated Test Title'})
            .end( (err, res) => {
                if (err) { 
                    done(err) 
                }
                expect(res.body.message.title).to.be.deep.equal('Updated Test Title')
                expect(res.body.message).to.have.property('title', 'Updated Test Title')

                Message.findOne({title: 'Updated Test Title'})
                .then( (message) => {
                    expect(message.title).to.be.deep.equal('Updated Test Title')
                    done()
                })
            })
        })
    })

    it('should delete a message', (done) => {
        // TODO: Complete this
        Message.findOne({title: 'Test Title'})
        .then(message => {
            chai.request(app)
            .delete(`/messages/${message._id}`)
            .end( (err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body.message).to.be.deep.equal('Message was deleted.')
                done()
            })
        })
    })
    })
