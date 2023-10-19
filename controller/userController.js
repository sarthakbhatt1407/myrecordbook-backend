const user = require("../models/user");
const User = require("../models/user");

const userSignUp = async (req, res) => {
  const { name, email, password } = req.body;
  const createdUser = new User({
    name,
    email,
    password: password,
  });

  await createdUser.save();
  return res.status(201).json({ msg: "User Created" });
};

exports.userSignUp = userSignUp;
