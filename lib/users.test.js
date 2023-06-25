import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUser, isUserExists, login, whoAmI, verifyToken } from "./users";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("User Authentication", () => {
  const mockUserList = [
    {
      username: "test",
      password: "$2b$10$9z6V7Pr1l4MAdkvCXyfx1ex7WjZlMEn/HQVZdGYoPc3wvBYYGQJvC", // pwd: test
      email: "test@test.co",
      id: 1
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findUser", () => {
    it("should find a user by username", () => {
      const username = "test";
      const user = findUser(username);
      expect(user).toEqual(mockUserList[0]);
    });
  });

  describe("isUserExists", () => {
    it("should return true if a user exists", () => {
      const username = "test";
      const exists = isUserExists(username);
      expect(exists).toBe(true);
    });

    it("should return false if a user does not exist", () => {
      const username = "nonexistent";
      const exists = isUserExists(username);
      expect(exists).toBe(false);
    });
  });

  describe("login", () => {
    const mockToken = "mockToken";

    it("should return an error if username or password is missing", async () => {
      const result = await login("", "password");
      expect(result).toEqual({
        error: "WRONG_CREDENTIAL",
        message: "Both Username and Password are required."
      });
    });

    it("should return an error if user does not exist", async () => {
      const result = await login("nonexistent", "password");
      expect(result).toEqual({
        error: "USER_NOT_FOUND",
        message: "nonexistent is not defined, make sure the user is registered before."
      });
    });

    it("should return an error if the password is incorrect", async () => {
      const mockedCheckPassword = bcrypt.compare;
      mockedCheckPassword.mockReturnValue(false);

      const result = await login("test", "wrongpassword");
      expect(result).toEqual({
        error: "WRONG_CREDENTIAL",
        message: "Your username or password is wrong."
      });
    });

    it("should generate a token and return it on successful login", async () => {
      const mockedCheckPassword = bcrypt.compare;
      mockedCheckPassword.mockReturnValue(true);

      const mockedSign = jwt.sign;
      mockedSign.mockReturnValue(mockToken);

      const result = await login("test", "testpassword");
      expect(result).toEqual({
        payload: {
          token: mockToken,
          username: "test"
        }
      });
    });
  });

  describe("whoAmI", () => {
    it("should return an error if the user does not exist", () => {
      const result = whoAmI("nonexistent");
      expect(result).toEqual({
        error: "WRONG_CREDENTIAL",
        message: "Your username or password is wrong."
      });
    });

    it("should return user information if the user exists", () => {
      const result = whoAmI("test");
      expect(result).toEqual({
        isSuccessful: true,
        payload: {
          username: "test",
          id: 1,
          email: "test@test.co"
        }
      });
    });
  });

  describe("verifyToken", () => {
    const mockToken = "mockToken";
    const verifyMock = jwt.verify;

    it("should verify and return the decoded token", () => {
      const mockDecodedToken = { username: "test", id: 1, email: "test@test.co" };
      verifyMock.mockReturnValue(mockDecodedToken);

      const decodedToken = verifyToken(mockToken);
      expect(decodedToken).toEqual(mockDecodedToken);
    });
  });
});
