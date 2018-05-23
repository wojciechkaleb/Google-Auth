var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('./config');
var googleProfile = {};
var app = express();
//Setting Passport
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    done(null, user);
});
passport.use(new GoogleStrategy(
    {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.CALLBACK_URL
    },
    function (accessToken, refreshToken, profile, cb) {
        googleProfile = {
            id: profile.id,
            displayName: profile.displayName
        };
        cb(null,profile);
    }
));
app.use(passport.initialize());
app.use(passport.session());
//Setting pug
app.set('view engine', 'pug');
app.set('views', './views');

//Setting bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.render('start');
});
app.get('/logged', function (req, res) {
    res.render('logged', { user: googleProfile });
})
app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    }));
app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/logged',
        failureRedirect: '/'
    }));
app.listen(3000, function () {
    console.log('Listening on http://localhost:3000');
});