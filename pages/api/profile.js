import { findUser, verifyToken } from "../../lib/users";

export default (req, res) => {
  if (req.method !== "GET") {
    res.status(403).json({
      error: "METHOD_NOT_ALLOWED",
      message: `${req.method} is not allowed, please use the GET http method.`,
    });
    return;
  }
  const authorizationToken = req.headers.authorization;
  if (authorizationToken) {
    try {
      const verifiedUser = verifyToken(authorizationToken);

      if (verifiedUser) {
        const user = findUser(verifiedUser.username);
        res.status(200).json({
          payload: {
            username: user.username,
            email: user.email,
            id: user.id,
          },
        });
        return;
      }
    } catch (error) {
      console.log("error", error);

      res.status(401).json({
        error: "Unauthorized",
        message: "Not allowed.",
      });
      return;
    }
  }

  res.status(401).json({
    error: "Unauthorized",
    message: "Not allowed.",
  });
};
