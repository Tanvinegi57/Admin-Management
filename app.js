require("dotenv").config();
const express = require("express");
var cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDocs = require("./swagger.json");
app.use("/swagger-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));
app.use("/Images", express.static("Images"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
require("./config/connectionDB").connect();
require("./config/connectionDB").syn();
const router = require("./routes/AdminRoutes");
const userRoutes = require("./routes/userRoutes");
const department = require("./routes/DepartmentRoute");
const education = require("./routes/EducationRoute");
const salary = require("./routes/salaryRoutes");
//Due to this table is create at database but not use it not table create
require("./model/index.js");
app.get("/", (req, res) => {
  res.send("<h1>Home page</h1>");
});
app.use("/admin", router);
app.use("/user", userRoutes);
app.use("/department", department);
app.use("/education", education);
app.use("/salary", salary);
app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
});
