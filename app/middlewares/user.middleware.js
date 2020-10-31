const {
  RegexValidation,
  RegexPattern,
} = require("regexpattern-collection").default;
const User = require("../models/user.model");

const validateRegister = async (req, res, next) => {
  let isValid = true;
  let data = [];
  if (!RegexValidation.hasMatch(req.body.email, RegexPattern.email)) {
    isValid = false;
    data.push({ email: "Email tidak valid" });
  }
  if (!RegexValidation.hasMatch(req.body.username, RegexPattern.userName)) {
    isValid = false;
    data.push({ username: "Usermame tidak valid" });
  }
  if (
    !RegexValidation.hasMatch(req.body.password, RegexPattern.passwordModerate)
  ) {
    isValid = false;
    data.push({
      password:
        "Minimal menggunakan 1 huruf kecil, 1 huruf besar, 1 angkan, dan minimal 8 karakter",
    });
  }
  if (req.body.fullname == undefined || req.body.fullname.length == 0) {
    isValid = false;
    data.push({ fullname: "Fullname tidak boleh kosong" });
  }
  if (!isValid) {
    return res.status(400).send({
      status: false,
      message: "Invalid Request",
      data: data,
    });
  } else {
    try {
      const username = await User.findOne({ username: req.body.username });
      const email = await User.findOne({ email: req.body.email });
      if (username || email) {
        return res.status(400).send({
          status: false,
          message: "Duplicate field",
          data: {
            username: username ? "Username sudah ada" : undefined,
            email: email ? "Email sudah ada" : undefined,
          },
        });
      } else {
        next();
      }
    } catch (err) {
      return res.status(500).send({
        status: false,
        message: "Server error",
        data: err.stack,
      });
    }
  }
};

const validateLogin = (req, res, next) => {
  let isValid = true;
  let data = [];

  if (!RegexValidation.hasMatch(req.body.username, RegexPattern.userName)) {
    isValid = false;
    data.push({ username: "Username tidak valid" });
  }
  if (
    !RegexValidation.hasMatch(req.body.password, RegexPattern.passwordModerate)
  ) {
    isValid = false;
    data.push({
      password:
        "Minimal menggunakan 1 huruf kecil, 1 huruf besar, 1 angkan, dan minimal 8 karakter",
    });
  }

  if (!isValid) {
    return res.status(400).send({
      status: false,
      message: "Invalid request",
      data: data,
    });
  } else {
    next();
  }
};

module.exports = { validateRegister, validateLogin };
