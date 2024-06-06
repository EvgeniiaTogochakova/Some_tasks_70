const express = require("express");
const uuid = require("uuid");
const fs = require("fs");
const path = require("path");
const app = express();

const { usersSchema } = require("./validation/schema");
const { checkBody } = require("./validation/validator");

const port = 3000;
const pathFile = path.join(__dirname, "users.json");

app.use(express.json());

app.get("/users", (req, res) => {
  const users = JSON.parse(fs.readFileSync(pathFile));
  res.send({ users });
});

app.get("/users/:id", (req, res) => {
  const users = JSON.parse(fs.readFileSync(pathFile));
  const user = users.find((item) => item.id === req.params.id);
  if (user) {
    res.send({ user });
  } else {
    res
      .status(404)
      .send({ user: null, error: "пользователь не найден", status: "error" });
  }
});

app.put("/users/:id", checkBody(usersSchema), (req, res) => {
  const users = JSON.parse(fs.readFileSync(pathFile));
  const user = users.find((item) => item.id === req.params.id);
  if (user) {
    user.name = req.body.name.replace(/[^a-zA-ZА-Яа-я- ]/g, "").trim();
    user.surname = req.body.surname.replace(/[^a-zA-ZА-Яа-я- ]/g, "").trim();
    user.age = req.body.age;
    if (req.body.city)
      user.city = req.body.city.replace(/[^a-zA-ZА-Яа-я0-9- ]/g, "").trim();
    fs.writeFileSync(pathFile, JSON.stringify(users, null, 2));
    res.send({ user });
  } else {
    res
      .status(404)
      .send({ user: null, error: "пользователь не найден", status: "error" });
  }
});

app.post("/users", checkBody(usersSchema), (req, res) => {
  const users = JSON.parse(fs.readFileSync(pathFile));
  const user = {
    id: uuid.v4(),
    name: req.body.name.replace(/[^a-zA-ZА-Яа-я- ]/g, "").trim(),
    surname: req.body.surname.replace(/[^a-zA-ZА-Яа-я- ]/g, "").trim(),
    age: req.body.age,
  };
  if (req.body.city)
    user.city = req.body.city.replace(/[^a-zA-ZА-Яа-я0-9- ]/g, "").trim();

  users.push(user);
  fs.writeFileSync(pathFile, JSON.stringify(users, null, 2));
  res.send({ user });
});

app.delete("/users/:id", (req, res) => {
  const users = JSON.parse(fs.readFileSync(pathFile));
  const userIndex = users.findIndex((item) => item.id === req.params.id);
  if (userIndex > -1) {
    users.splice(userIndex, 1);
    fs.writeFileSync(pathFile, JSON.stringify(users, null, 2));
    res.send({ status: "OK" });
  } else {
    res
      .status(404)
      .send({ user: null, error: "пользователь не найден", status: "error" });
  }
});

app.use((req, res) => {
  res.status(404).send({
    message: "Страница не существует. Проверьте корректность URL!",
  });
});

app.listen(port, () => console.log("Server is listening"));
