const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const flash = require('express-flash');
const session = require('express-session');
const controller = require('./controller/userController')
const userMiddleware = require('./middleware/userMiddleware');
const passport = require('passport');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(flash());
app.use(session({
     secret: 'keyboard cat',
     resave: false,
     saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', userMiddleware.checkAuthenticated, controller.Blogpage);
app.post('/post', userMiddleware.checkAuthenticated, controller.blogPost)
app.get('/blogpost', userMiddleware.checkAuthenticated, controller.blogPostGet)
app.get('/user', userMiddleware.checkAuthenticated, controller.UserPage);
app.post('/user', userMiddleware.checkAuthenticated, controller.updateDetail);
app.post('/:id', controller.deletePost);


app.post('/logout', function (req, res, next) {
     req.logout(function (err) {
          if (err) { return next(err); }
          res.redirect('/');
     });
});
app.post('/login', userMiddleware.checkNotAuthenticated, controller.Homepost, passport.authenticate('local', {
     successRedirect: '/',
     failureRedirect: '/login',
     failureFlash: true
}));
app.get('/login', userMiddleware.checkNotAuthenticated, controller.Homeget);
app.get('/registration', userMiddleware.checkNotAuthenticated, controller.registrget);
app.post('/registration', userMiddleware.checkNotAuthenticated, userMiddleware.checkpassword, controller.registrpost);



module.exports = app;