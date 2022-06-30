exports.checkpassword = (req, res, next) => {
     if (req.body.password === req.body.confirmPassword) {
          next();
     } else {
          res.json({
               class: 'display',
               message: "confirm password Not match"
          })
     }
};

exports.checkAuthenticated = (req, res, next) => {
     if (req.isAuthenticated()) {
          return next();
     }
     res.redirect('/login');
}

exports.checkNotAuthenticated = (req, res, next) => {
     if (req.isAuthenticated()) {
          return res.redirect('/');
     }
     next();
}