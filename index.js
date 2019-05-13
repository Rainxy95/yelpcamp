const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const Passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/userAuthen',{ useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    name: String,
    password: String
});

const user = mongoose.model('user', userSchema)

// user.create([
//     {name: 'user1', password: '123456'},
//     {name: 'user2', password: '654321'}
// ])
app.use(bodyParser.urlencoded({extended:true}));
app.use(session(
    {
        secret:'123456rain654321',
        resave: true,
        saveUninitialized: true
    }));
app.use(Passport.initialize());
app.use(Passport.session());

app.set('views','./views')
app.set('view engine','ejs');
app.route('/login')
.get((req,res) => res.render('login'))
.post(Passport.authenticate('local',{failureRedirect: '/login',successRedirect: '/loginOk'}))
app.get('/',(req,res) => {
    res.render('homePage');
})
app.get('/loginOk',(req,res) => {
    res.send("You Pass!!! Congrate!")
})

Passport.use(new localStrategy((username, password, done) => {
    user.findOne({name: username}).exec((err, userRecord) => {
        if (userRecord && userRecord.password == password) {
            return done(null, userRecord);
        } else {
            return done(null, false);
        };
    })
}))

Passport.serializeUser((user, done) => {
    done(null, user.name);
})

Passport.deserializeUser((username, done) => {
    user.findOne({name: username}).exec((err, userRecord) => {
        if (userRecord) {
            return done(null, userRecord);
        } else {
            return done(null, false);
        }
    })
})

app.listen(3000, process.env.IP, () => {
    console.log('The YelpCamp Server Has Started!');
})