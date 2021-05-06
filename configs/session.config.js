const session = require('express-session');

module.exports = app => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        secure: true,
        path: '/',
        httpOnly: true,
        hostOnly: true,
        sameSite: false,
        domain: 'domain.com',
      },
    }),
  );
};
