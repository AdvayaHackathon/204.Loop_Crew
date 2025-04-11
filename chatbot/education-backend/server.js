const express = require("express");
const cors = require("cors");
const classRoutes = require("./routes/classes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/classes", classRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
