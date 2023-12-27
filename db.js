const mongoose = require('mongoose');

const connect =
  (
  (URI) => {
    mongoose
      .connect(URI)
      .then(() => {
        console.log('DB connection success');
      })
      .catch((err) => {
        console.log('Database connection failed');
        console.log(err);
      });
  });

module.exports = connect;
