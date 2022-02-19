const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/users')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    username: 'Mike',
    email: 'mike@example.com',
    password: '56what!!',
    tokens: [{
        token: jwt.sign({_id:userOneId}, process.env.JWT_SECRET)
    }]
}

beforeEach( async ()=>{
   await User.deleteMany()
   await new User(userOne).save()
})

test('Should signup a new user', async () => {
   const response = await request(app)
   .post('/users')
   .send({
        username: "Andrew",
        email: "andrew@example.com",
        password: "MyPass777!"
    }).expect(201)

    //Assert that the database was change correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            username: "Andrew",
            email: 'andrew@example.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('MyPass777!')
})

test('Should login existing user', async () => {
    const response = await request(app)
    .post('/users/login')
    .send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    expect(user.tokens[1].token).toBe(response.body.token)
})

test('Pass key different of email and password', async () => {
    await request(app)
    .post('/users/login')
    .send({
        anything: 12
    }).expect(400)
})

test('Send off the request with bad credentials', async () => {
    await request(app)
    .post('/users/login')
    .send({
        email: 'teste@hotmail.com',
        password: 'teste'
    }).expect(404)
})

test('Should get profile for user', async ()=>{
    await request(app)
        .get('/users')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async ()=>{
    await request(app)
        .get('/users')
        .send()
        .expect(401)
})

test('Should delete account user', async()=>{
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization','Bearer ' + userOne.tokens[0].token)
        .expect(200)

    const user = await User.findById(response.body._id)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async ()=>[
    await request(app)
        .delete('/users/me')
        .expect(401)
])

test('Send image avatar for the user', ()=>{
    request(app)
    .post('/users/me/avatar')
    .set('Authorization','Bearer ' + userOne.tokens[0].token)
    .attach('avatar','./fixtures/profile-pic.jpg')
    .expect(200)
})