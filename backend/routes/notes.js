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

//router 3 update notes 
router.put( "/updatenotes/:id", fetchuser, async (req, res) =>{

    const { title, description, tag } = req.body;
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};

    let note = await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("not found")};
    if(note.user.toString() !== req.user.id){return res.status(401).send("not allowed")}; 

note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});

res.json({note});
}


)





module.exports = router;
