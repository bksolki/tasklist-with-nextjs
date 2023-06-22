import axios from "axios";

export default async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({
      error: "METHOD_NOT_ALLOWED",
      message: `${req.method} is not allowed, please use the POST http method.`,
    });
    return;
  }
  console.log("reqg", req.query);

  const { page = 0, limit = 10, isAsc = true, sortBy = "createdAt", status } = req.query;

  const { data } = await axios.get("https://todo-list-api-mfchjooefq-as.a.run.app/todo-list", {
    params: {
      offset: page,
      limit,
      isAsc,
      sortBy,
      status,
    },
  });

  res.status(200).json(data);
};
