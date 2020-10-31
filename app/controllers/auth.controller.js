const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const email = require("../helpers/email.helper");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { body } = req;
    const passwordHashed = bcrypt.hashSync(body.password, 10);
    const user = new User({
      fullname: body.fullname,
      email: body.email,
      password: passwordHashed,
      username: body.username,
      isVerified: false,
      profilePicture: "ini foto profile",
    });
    const savedUser = await user.save();
    email.send(savedUser);

    return res.send({ status: true, message: "Register Success" });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Server error", data: err.stack });
  }
};

const verify = async (req, res) => {
  try {
    const id = req.params.id;
    const dataUpdate = { isVerified: true };
    const user = await User.findById(id);
    if (user) {
      await User.findByIdAndUpdate(id, dataUpdate);
      return res.send("<h2>Email berhasil diverifikasi</h2>");
    } else {
      return res.send("<h2>User tidak ditemukan</h2>");
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: "server error",
      data: err.stack,
    });
  }
};

const login = async (req, res) => {
  try {
    const { body } = req;
    const user = await User.findOne({
      username: body.username,
    });
    if (user) {
      if (!user.isVerified) {
        return res.status(400).send({
          status: false,
          message: "Email belum diverifikasi",
        });
      }
      if (bcrypt.compareSync(body.password, user.password)) {
        const accesToken = jwt.sign({ username: user.username }, "wakwaw123", {
          expiresIn: "30d",
        });
        return res.send({
          status: true,
          message: "Login success",
          data: {
            token: accesToken,
            type: "Bearer",
          },
        });
      } else {
        return res
          .status(400)
          .send({ status: false, message: "Password salah" });
      }
    }
    return res.send(req.body);
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: "Server error",
      data: err.stack,
    });
  }
};

const me = async (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const user = jwt.verify(token, "wakwaw123");
    if (user) {
      const dataUser = await User.findOne({ username: user.username });
      return res.send({
        status: true,
        message: "Get user detail",
        data: {
          fullname: dataUser.fullname,
          email: dataUser.email,
          profilePicture: dataUser.profilePicture,
        },
      });
    } else {
      return res.status(400).send({
        status: false,
        message: "Invalid token or, expired",
      });
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: "Server error",
      data: err.stack,
    });
  }
};

module.exports = { register, verify, login, me };
