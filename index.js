
const express = require('express')
const bodyParser = require('body-parser')
const urlEncodedParser = bodyParser.urlencoded({ extended: false })
const jwt = require('jsonwebtoken')
const passport = require('passport')
var cors = require('cors')
let JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
let secret = "867488746874e6f8e784z69897gez68g7ze46g87z4ed6v8z6rdg6v74zvr6r8/hg7"
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret;
const app = express()
app.use(cors());

const articleRepository = require('./articleRepository.js')
const accountRepository = require('./accountRepository.js')

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    if(users.find((user) => user.email === jwt_payload.user)){
        return done(null, jwt_payload.user);
    }
    else{
        return done(null,false)
    }
}));

app.post('/login', urlEncodedParser, async function (req, res) {

    const email = req.body.email
    const password = req.body.password

    if (!email || !password) {
        res.status(401).json({ error: 'Email or password was not provided' })
        return
    }

    let users = await accountRepository.findAll()
    console.log(users);
    const user = users.data.find(
        (user) => user.email === email && user.password === password
    )

    if (!user) {
        res.status(401).json({ error: 'Email and password do not match' })
        return
    }

    const userJwt = jwt.sign({ user: user.email }, secret)

    res.json({ jwt: userJwt })
})

app.route('/article')
    .get( async function(req, res){
        const response = await articleRepository.findAll();
        res.json(response.data)
    })
    .post( urlEncodedParser, passport.authenticate('jwt' , {session : false}) ,async function(req, res){
        const data = {
            title : req.body.title,
            content : req.body.content,
            user : req.user
        }
        if(!data.title || !data.content){
            res.json({error : "Article must have title and content fields"})
        }
        else{
            const response = await articleRepository.create(data)
            res.json(response.data)
        }
    })
    .delete(urlEncodedParser, passport.authenticate('jwt' , {session : false}),async function(req, res){
        const id = req.body.id
        let valid = true;
        if(!id){
            res.json({error : "Delete must have an id field"})
            valid = false;
        }
        if(!await articleRepository.isCreator(id, req.user)){
            res.json({error : "You must be the content creator to do this"})
            valid = false;
        }
        if(valid){
            let response = await articleRepository.removeById(id)
            res.json(response.data)
        }
    })
    .put(urlEncodedParser , passport.authenticate('jwt' , {session : false}), async function(req, res){
        const id = req.body.id
        let valid = true;
        const data = {
            title : req.body.title,
            content : req.body.content,
            user : req.user
        }
        if(!id){
            res.json({error : "Update must have an id field"})
            valid = false;
        }
        if(!data.title && !data.content){
            res.json({error : "Update must have at least title or content modification"})
            valid = false;
        }
        if(!await articleRepository.isCreator(id, req.user)){
            res.json({error : "You must be the content creator to do this"})
            valid = false;
        }
        if(valid){
            let response = await articleRepository.updateById(id,data)
            res.json(response.data)
        }
    })

app.route('/account')
    .post( urlEncodedParser,async function(req, res){
        const data = {
            email : req.body.email,
            password : req.body.password,
        }
        if(!data.email || !data.password){
            res.json({error : "You must provide both email and password"})
        }
        else{
            const response = await accountRepository.create(data)
            res.json(response.data)
        }
    })


app.get('/article/:articleId', async function(req, res) {
   const articleId = req.params.articleId;
   const response = await articleRepository.findById(articleId);
   res.json(response.data)
})


app.listen(3000, () => {
    console.log('running')
})
