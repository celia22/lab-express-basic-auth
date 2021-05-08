// const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);
// const mongoose = require('mongoose');

// module.exports = app => {
//   app.use(
//     session({
//       store: MongoStore.create({
//         mongoUrl: "localhost:27017/express-basic-auth",
//         ttl: 24 * 60 * 60,
//       }),
//       secret: 'testing', //process.env.SESS_SECRET,
//       resave: true,
//       saveUninitialized: false,
//       cookie: {
//         sameSite: 'none',
//         httpOnly: true,
//         maxAge: 60000,
//       },
//     }),
//   );
// };
