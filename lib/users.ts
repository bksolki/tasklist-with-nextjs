import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";

const jwtSecretKey: Secret | undefined = process.env.JWT_SECRET_KEY;
const jwtExpire: number = Number(process.env.JWT_EXPIRE_SEC) || 3000; // 50min

const saltRounds: number = 10;
const salt: string = bcrypt.genSaltSync(saltRounds);

interface User {
  username: string;
  password: string;
  email: string;
  id: number;
}

// Just make data: Users list like DB
let users: User[] = [
  {
    username: "test",
    password: "$2b$10$9z6V7Pr1l4MAdkvCXyfx1ex7WjZlMEn/HQVZdGYoPc3wvBYYGQJvC", // pwd: test
    email: "test@test.co",
    id: 1
  }
];
// ----------------------------------------------------*
export function findUser(username: string) {
  return users.find((user) => user.username === username);
}

export function isUserExists(username: string): boolean {
  return !!findUser(username);
}
// ----------------------------------------------------*
export function login(username: string, password: string) {
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

export function whoAmI(username: string) {
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

function hashPassword(password: string) {
  return bcrypt.hashSync(password, salt);
}

function checkPassword(currentHashedPassword: string, hashedPassword: string): boolean {
  return bcrypt.compare(currentHashedPassword, hashedPassword);
}

export function verifyToken(token: string) {
  return jwt.verify(token, jwtSecretKey);
}

function errorMessage(error: string, message: string) {
  return {
    isSuccessful: false,
    error,
    message
  };
}
