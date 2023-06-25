import loginApi from "./login";
import { login } from "../../lib/users";

jest.mock("../../lib/users", () => ({
  login: jest.fn()
}));

describe("Login API handler", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      method: "POST",
      body: JSON.stringify({ username: "testuser", password: "testpassword" })
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test("returns 200 status code with login result when using POST method", () => {
    login.mockReturnValue({ success: true });

    loginApi(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  test("returns 405 status code with error message when using non-POST method", () => {
    req.method = "GET";

    loginApi(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({
      error: "METHOD_NOT_ALLOWED",
      message: "GET is not allowed, please use the POST http method."
    });
  });
});
