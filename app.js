const express = require("express");
const { sequelize } = require('./models');

const app = express();
const bodyParser = require('body-parser');
const port = 3000;


sequelize
  .sync()
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

const usersRouter = require("./routes/users")
const bannersRouter = require("./routes/banners")

const requestMiddleware = (req, res, next) =>{
    console.log("Request URL:", req.originalUrl, " - ", new Date());
    next();
}

app.use(express.static("static"));
app.use(express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}))
app.use(requestMiddleware);

app.use("/users", [usersRouter]);
app.use("/banners", [bannersRouter]);


app.listen(port, () => {
    console.log(port, "포트가 서버가 켜졌어요!");
});