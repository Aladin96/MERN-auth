require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");


app.use(cors());
app.use(express.json());

// Connect to DATABASE 

connectDB();

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/posts", require("./routes/post"))

const port = process.env.PORT || 4000;
const server = app.listen(port, () => console.log(`Listning at port: ${port}`));


process.on("unhandledRejection", (err, promise)=>{
  console.log(`logged Error: ${err}`);
  server.close(() => process.exit(1));
})