const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/notes");
const { body, validationResult } = require("express-validator");

//fetch all this notes
router.get("/fecthnotes", fetchuser, async (req, res) => {
    try {
        const userNotes = await Notes.find({ user: req.user.id });
        res.json(userNotes);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("some Error has ocuured");
      }
});

//Add new notes using post
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "enter a valid description").isLength({ min: 3 }),
  ],
  async (req, res) => {
    try {
        const { title, description, tag } = req.body;
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const note = new Notes({
      title,
      description,
      tag,
      user: req.user.id,
    });
    const savedNote = await note.save();

    res.json(savedNote);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("some Error has ocuured");
      }
  }
);

module.exports = router;
