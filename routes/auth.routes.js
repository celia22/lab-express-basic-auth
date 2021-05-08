const { Router } = require('express');

const router = new Router();

const bcryptjs = require('bcryptjs');

const saltRounds = 10;

const checkIfUserIsLoggedIn = require('../middleware/login');

const User = require('../models/User');

// GET //

router.get('/signup', (req, res) => res.render('auth/signup'));

router.get('/login', (req, res) => res.render('auth/login'));

router.get('/userProfile', (req, res) => {
  console.log('user', req.session.currentUser);
  res.render('users/user-profile', { user: req.session.currentUser });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy(error => {
    if (error) {
      return next(error);
    }
    return res.redirect('/login');
  });
});

router.get('/main', checkIfUserIsLoggedIn, (req, res) => {
  res.render('users/main');
});

router.get('/private', checkIfUserIsLoggedIn, (req, res) => {
  res.render('users/private');
});

// POST //

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

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
      res.redirect('/login');
    })
    .catch(error => next(error));
});

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
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'Username is not registered. Try with other username.' });
        return;
      }
      if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect('/userProfile');
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

module.exports = router;

// User.findOne({ username })
// .then(user => {
//   if (!user) {
//     return res.render('auth/login', { errorMessage: 'Username is not registered. Try with other username.' });
//   }
//   const { _id, username: userN, passwordHash } = user;
//   if (bcryptjs.compareSync(password, passwordHash)) {
//     req.session.currentUser = {
//       _id,
//       username: userN,
//     };
//     return res.redirect('/userProfile');
//   }
//   return res.render('auth/login', { errorMessage: 'Incorrect password.' });
// })
// .catch(error => next(error));
// });