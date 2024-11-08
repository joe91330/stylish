const express = require("express");
const cors = require('cors');
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const productRoutes = require("./routes/productRoutes");
const apiRouter = require("./api");

const app = express();
const port = 3000;

require("dotenv").config();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to your API!");
});

app.use("/api/1.0/products", productRoutes);
app.use("/api/1.0", apiRouter);

app.use(express.static(__dirname));

app.listen(port, () => {
  console.log("Server is running on port 3000");
});


