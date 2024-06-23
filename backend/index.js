import express from "express";
import cors from "cors";
import connectToDatabase from "./utils/db.js";

import { noteRouter } from "./controllers/notes.js";
import { userRouter } from "./controllers/users.js";

import { PORT } from "./utils/config.js";
const app = express();

app.use(cors());
app.use(express.json());

connectToDatabase();

app.use("/note", noteRouter);
app.use("/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
