const User = require("../models/user");
const bcrypt = require("bcryptjs");

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const userSignUp = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPass = await bcrypt.hash(password, 12);
  const createdUser = new User({
    name,
    email,
    password: hashedPass,
  });

  try {
    await createdUser.save();
  } catch (err) {
    return res.status(404).json({ message: "Something went wrong..." });
  }
  return res.status(201).json({ msg: "User Created" });
};
const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  let user;
  let passIsValid = false;
  if (!validateEmail(email)) {
    return res.status(404).json({ message: "Invalid Email" });
  }
  try {
    user = await User.findOne({ email: email });
    if (!user) {
      throw new Error();
    }
  } catch (err) {
    return res.status(404).json({ message: "Invalid Credentials" });
  }

  passIsValid = await bcrypt.compare(password, user.password);
  if (user && email === user.email && passIsValid) {
    user.password = "Keep Guessing";
    res.json({
      userEmail: user.email,
      userId: user.id,
      message: "Logged In",
      isloggedIn: true,
    });
  } else {
    res.status(404).json({ message: "Invalid Credentials" });
  }
};

exports.userSignUp = userSignUp;
exports.userLogin = userLogin;
