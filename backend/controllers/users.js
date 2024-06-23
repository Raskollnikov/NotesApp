import express from "express";
import Note from "../models/Note.js";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const userRouter = express.Router();

userRouter.post("/", async (req, res) => {
  const { userName, name, password } = req.body;

  if (!userName || !name) {
    res.send("username and name are required");
  }
  try {
    const existingUser = await User.findOne({ userName });

    if (existingUser) {
      return res.status(400).send("userName should be unique");
    }
    const saltRaunds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRaunds);
    const user = new User({
      userName,
      name,
      password: hashedPassword,
      notes: [],
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
});

userRouter.post("/:id/notes", async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const note = new Note({
      title,
      user: user._id,
    });

    const savedNote = await note.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();

    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({ error: "Failed to add note to user" });
  }
});

// Retrieve a user with populated notes
userRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate("notes", { title: 1 });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the user" });
  }
});

// login

userRouter.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  try {
    // Find user by userName and check password
    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords (this depends on your password hashing and comparison method)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Optionally, generate a token or session for authentication

    // Send back user data or token to the client
    res.json({ user });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ error: "Failed to log in" });
  }
});

export { userRouter };
