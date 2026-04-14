const prisma = require("../../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config/jwt");

const register = async (email, password) => {
  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashed },
  });

  return user;
};

const login = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid Password");

  const token = jwt.sign(
    { userId: user.id },
    config.secret,
    { expiresIn: config.expiresIn }
  )

  return { token }
};

module.exports = {
    register, login
}