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
let userList: User[] = [
  {
    username: "test",
    password: "$2b$10$9z6V7Pr1l4MAdkvCXyfx1ex7WjZlMEn/HQVZdGYoPc3wvBYYGQJvC", // pwd: test
    email: "test@test.co",
    id: 1
  },
  {
    username: "testuser2",
    password: "$2b$10$ZPFfyJhcrm4/VCxgakx5wuIXJm1DPMweMDBM4TKs1p7p93lE4gDBG", // pwd: testuser2
    email: "testuser2@test.co.scb",
    id: 2
  },
  {
    username: "testuser3",
    password: "$2b$10$PfS6eDYny5o7T76ldd4T5e2pgetK3g.bwx5jqOnNCBFmlmnecZjSi", // pwd: testuser3
    email: "testuser3@test.co.scb",
    id: 3
  }
];
// ----------------------------------------------------*
export const findUser = (username: string) => {
  return userList.find((user) => user.username === username);
};

export const isUserExists = (username: string) => {
  return !!findUser(username);
};
// ----------------------------------------------------*
export const login = async (username: string, password: string) => {
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
  const comparePassword = await checkPassword(password, user.password);

  if (!comparePassword) {
    return {
      error: "WRONG_CREDENTIAL",
      message: "Your username or password is wrong."
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
};

export const whoAmI = (username: string) => {
  if (!username || !isUserExists(username)) {
    return {
      error: "WRONG_CREDENTIAL",
      message: "Your username or password is wrong."
    };
    // is for logger
    // {
    //  error: "USER_NOT_FOUND",
    //  message: `${username} is not defined, make sure the user is registered before.`
    //};
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
};

const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, salt);
};

const checkPassword = (currentHashedPassword: string, hashedPassword: string): boolean => {
  return bcrypt.compare(currentHashedPassword, hashedPassword);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, jwtSecretKey);
};
