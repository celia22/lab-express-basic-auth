
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
  console.log('SESSION =====> ', req.session);
  const { username, password } = req.body;

  if (username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, username and password to login.',
    });
    return;
  }

  User.findOne({ username })
    .then(validUser => {
      if (!validUser) {
        res.render('auth/login', { errorMessage: 'Username is not registered. Try with other username.' });
      } else if (bcryptjs.compareSync(password, validUser.passwordHash)) {
        req.session.currentUser = validUser;
        res.redirect('/userProfile');
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

router.get('/userProfile', (req, res) => {
  res.render('users/user-profile', { userInSession: req.session.currentUser });
  console.log(currentUser);
});

module.exports = router;
