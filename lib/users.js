import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const jwtSecretKey = process.env.JWT_SECRET_KEY;
const jwtExpire = Number(process.env.JWT_EXPIRE_SEC) || 3000; // 50min

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

// Just make data: Users list like DB
let users = [
  {
    username: "test",
    password: "$2b$10$9z6V7Pr1l4MAdkvCXyfx1ex7WjZlMEn/HQVZdGYoPc3wvBYYGQJvC", // pwd: test
    email: "test@test.co",
    id: 1
  }
];
// ----------------------------------------------------*
export function findUser(username) {
  return users.find((user) => user.username === username);
}

export function isUserExists(username) {
  return findUser(username) || false;
}
// ----------------------------------------------------*
export function login(username, password) {
  if (!username || !password) {
    return {
      error: "WRONG_CREDENTIAL",
      message: `Both Username and Password are required.`
    };
  }

  if (!isUserExists(username)) {
    return {
      error: "USER_NOT_FOUND",
      message: `${username} is not defined, make sure the user is registered before.`
    };
  }

  const user = findUser(username);
  const hashedPassword = hashPassword(password);
  // console.log(hashedPassword);

  if (!checkPassword(hashedPassword, user.password)) {
    return {
      error: "WRONG_CREDENTIAL",
      message: "Your Password is wrong. Shame on you!(^_^)"
    };
  }

  const token = jwt.sign({ username: user.username, email: user.email, id: user.id }, jwtSecretKey, {
    expiresIn: jwtExpire
  });

  return {
    payload: {
      token,
      username: user.username
    }
  };
}

export function whoAmI(username) {
  if (!username || !isUserExists(username)) {
    return {
      error: "USER_NOT_FOUND",
      message: `${username} is not defined, make sure the user is registered before.`
    };
  }

  const user = findUser(username);
  return {
    isSuccessful: true,
    payload: {
      username: user.username,
      id: user.id,
      email: user.email
    }
  };
}

function hashPassword(password) {
  return bcrypt.hashSync(password, salt);
}

function checkPassword(currentHashedPassword, hashedPassword) {
  return bcrypt.compare(currentHashedPassword, hashedPassword);
}

export function verifyToken(token) {
  return jwt.verify(token, jwtSecretKey);
}

function errorMessage(error, message) {
  return {
    isSuccessful: false,
    error,
    message
  };
}
