const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = await User.exists({ email: email.toLowerCase() });

    if (user) {
      return res.json({
        msg: 'this email is already in use. please try a different one.',
        status: 409,
      });
    } else {
      const encryptedPassword = await bcrypt.hash(password, 10);
      const savedUser = await User.create({
        email: email.toLowerCase(),
        username,
        password: encryptedPassword,
      });

      return res.json({
        userDetails: {
          email: savedUser.email,
          username: savedUser.username,
          id: savedUser._id,
        },
        status: 200,
      });
    }
  } catch (err) {
    return res.status(500).send('something went wrong. please try again.');
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.json({
        msg: 'invalid credentials. please try again.',
        status: 409,
      });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      return res.json({
        userDetails: {
          email: user.email,
          username: user.username,
          id: user._id,
        },
        status: 200,
      });
    }
    return res.json({
      msg: 'invalid credentials. please try again.',
      status: 400,
    });
  } catch (err) {
    return res.status(500).send('something went wrong. please try again.');
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      'email',
      'username',
      '_id',
    ]);
    return res.json(users);
  } catch (err) {
    return res.status(500).send('something went wrong. please try again.');
  }
};

module.exports.deleteUsers = async (req, res) => {
  try {
    const users = await User.deleteMany({});
    return res.json(users);
  } catch (err) {
    return res.status(500).send('something went wrong. please try again.');
  }
};
