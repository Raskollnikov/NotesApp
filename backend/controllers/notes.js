import express from "express";
import Note from "../models/Note.js";
import User from "../models/User.js";

const noteRouter = express.Router();

noteRouter.get("/", async (req, res) => {
  try {
    const notes = await Note.find({}).populate("user", {
      userName: 1,
      name: 1,
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

noteRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const singleNote = await Note.findById(id).populate("user", {
      userName: 1,
      name: 1,
    });
    if (singleNote) {
      res.json(singleNote);
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the note" });
  }
});

noteRouter.post("/", async (req, res) => {
  const { title, userId } = req.body;

  if (!title || !userId) {
    return res.status(400).json({ error: "Title and userId are required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const note = new Note({
      title,
      user: userId,
    });

    const savedNote = await note.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();

    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({ error: "Failed to create note" });
  }
});

noteRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, user: userId },
      { new: true, runValidators: true }
    );

    if (updatedNote) {
      res.json(updatedNote);
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update the note" });
  }
});

noteRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNote = await Note.findByIdAndDelete(id);

    if (deletedNote) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the note" });
  }
});

export { noteRouter };
