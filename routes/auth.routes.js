
const { Router } = require('express');

const router = new Router();

const bcryptjs = require('bcryptjs');

const saltRounds = 10;

const User = require('../models/User.model');

// SIGNUP //

router.get('/signup', (req, res) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  const hashedPassword = bcryptjs.hashSync(password);
  
  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        passwordHash: hashedPassword,
      });
    })
    .then(user => {
      console.log('Newly created user is: ', user);
      res.redirect('/userProfile');
    })
    .catch(error => next(error));
});

// LOGIN //

router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.',
    });
    return;
  }

  User.findOne({ email })
    .then(validUser => {
      if (!validUser) {
        res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
      } else if (bcryptjs.compareSync(password, validUser.passwordHash)) {
        res.render('users/user-profile', { validUser });
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

// router.get('/userProfile', (req, res) => {
//   res.render('users/user-profile', { userInSession: req.session.currentUser });
//   console.log(currentUser);
// });


module.exports = router;
