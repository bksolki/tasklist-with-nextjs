import profile from "./profile";
import { findUser, verifyToken } from "../../lib/users";

jest.mock("../../lib/users", () => ({
  findUser: jest.fn(),
  verifyToken: jest.fn()
}));

describe("User Info API profile", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      method: "GET",
      headers: {
        authorization: "Bearer token123"
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("returns 200 status code with user info when using GET method and valid authorization token", () => {
    const user = {
      username: "testuser",
      email: "testuser@example.com",
      id: "123456789"
    };

    verifyToken.mockReturnValue({ username: "testuser" });
    findUser.mockReturnValue(user);

    profile(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      payload: {
        username: user.username,
        email: user.email,
        id: user.id
      }
    });
  });

  test("returns 401 status code when using GET method and invalid authorization token", () => {
    verifyToken.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    profile(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Unauthorized",
      message: "Not allowed."
    });
  });

  test("returns 401 status code when using GET method without authorization token", () => {
    req.headers.authorization = undefined;

    profile(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Unauthorized",
      message: "Not allowed."
    });
  });

  test("returns 403 status code when using a non-GET method", () => {
    req.method = "POST";

    profile(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "METHOD_NOT_ALLOWED",
      message: `${req.method} is not allowed, please use the GET http method.`
    });
  });
});
