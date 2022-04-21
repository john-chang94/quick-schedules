require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const expressValidator = require("express-validator");

app.use(expressValidator());
app.use(cors());
app.use(express.json());

app.use("/api", require("./routes/roleRoutes"));
app.use("/api", require("./routes/authRoutes"));
app.use("/api", require("./routes/userRoutes"));
app.use("/api", require("./routes/presetRoutes"));
app.use("/api", require("./routes/shiftRoutes"));
app.use("/api", require("./routes/requestRoutes"));
app.use("/api", require("./routes/storeRoutes"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
  console.log(__dirname + "client")
}

const PORT = process.env.PORT || 80;
if (process.env.NODE_ENV === "development") {
  app.listen(PORT, process.env.IP, () =>
    console.log(`Server is running on port: 80`)
  );
} else {
  app.listen(PORT, () =>
    console.log(`Server is running on port: ${PORT}`)
  );
}
