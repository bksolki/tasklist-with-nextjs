import axios from "axios";

export default async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({
      error: "METHOD_NOT_ALLOWED",
      message: `${req.method} is not allowed, please use the POST http method.`,
    });
    return;
  }

  //   const { taskType } = JSON.parse(req.body);

  const { data } = await axios.get("https://todo-list-api-mfchjooefq-as.a.run.app/todo-list");
  //   const task = await data.json();
  //   console.log("___________data", task);
  // return data;

  res.status(200).json(data);
};
