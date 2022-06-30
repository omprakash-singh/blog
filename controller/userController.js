const userModel = require('../model/userModel');
const bcrypt = require('bcrypt');
const passport = require('passport');
const BlogPostModel = require('../model/blogModel');
const LocalStrategy = require('passport-local').Strategy;

async function authenticateUser(email, password, done) {
     const user = await userModel.findOne({ email: email });
     if (user === null) {
          return done(null, false, { message: "No user with that email!" });
     }
     try {
          if (await bcrypt.compare(password, user.password)) {
               return done(null, user);

          } else {
               return done(null, false, { message: 'password incorrect!' });
          }
     } catch (e) {
          return done(e);
     }
}

passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
passport.serializeUser((user, done) => {
     done(null, user.id);
})
passport.deserializeUser((id, done) => {
     return done(null, userModel.findById(id));
})

exports.Homeget = (req, res) => {
     res.render('login');
}


let UserNamedata;

exports.Homepost = async (req, res, next) => {

     try {
          UserNamedata = await userModel.findOne({ email: req.body.email });
          next();
     } catch (error) {
          console.log(error);
     }
}
exports.updateDetail = async (req, res) => {
     try {
          const hashpossword = await bcrypt.hash(req.body.password, 10);
          const confirmPassword = await bcrypt.hash(req.body.confirmPassword, 10);
          const result = await userModel.updateMany(
               { email: UserNamedata.email },
               {
                    $set: {
                         name: UserNamedata.name,
                         email: req.body.email,
                         password: hashpossword,
                         confirmPassword: confirmPassword
                    }
               }
          )
          req.logout(function (err) {
               if (err) { return next(err); }
               res.redirect('/');
          });
          console.log(result);

     } catch (error) {
          console.log(error);
     }

}

exports.registrget = (req, res) => {
     res.render('registration')
}
exports.registrpost = async (req, res) => {
     try {
          const hashpossword = await bcrypt.hash(req.body.password, 10);
          const confirmPassword = await bcrypt.hash(req.body.confirmPassword, 10);
          const userDataPut = new userModel({
               name: req.body.name,
               email: req.body.email,
               password: hashpossword,
               confirmPassword: confirmPassword
          })
          userDataPut.save().then((doc) => {
               console.log(doc);
          }).catch((err) => {
               console.log(err);
          });
          res.redirect('/login')
     } catch (error) {

     }
}
exports.UserPage = async (req, res) => {
     const email = UserNamedata.email;
     const data = await BlogPostModel.find({ email: email }).sort({ date: -1 });
     res.render('user', {
          data,
          username: UserNamedata.name,
          useremail: UserNamedata.email
     });
}
exports.Blogpage = async (req, res) => {

     const data = await BlogPostModel.find().sort({ date: -1 });
     console.log(data);
     res.render('blog', {
          data
     });
}

exports.blogPostGet = (req, res) => {
     res.render('post', {
          UserNamedata
     });
}

exports.blogPost = async (req, res) => {
     try {
          const BlogPostDataPut = new BlogPostModel({
               name: UserNamedata.name,
               email: UserNamedata.email,
               post: req.body.post,
               date: new Date().toLocaleString()
          });
          BlogPostDataPut.save().then((doc) => {
               console.log(doc);
          }).catch((err) => {
               console.log(err);
          })
          res.redirect('/');
     } catch (error) {
          console.log(error)
     }

}

exports.deletePost = async (req, res, next) => {
     try {
          const _id = req.params.id;
          await BlogPostModel.deleteOne({ _id });
          res.redirect('/user');
     } catch (error) {

     }
     next();
}

