import mongoose from "mongoose";

// 1st step: You need to create a schema
// 2nd step: You would create a model based off of that schema

const noteSchema = new mongoose.Schema({
  title: String,
  encryptedContent: String,
  iv: String,
  authTag: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});


const Note = mongoose.model("Note", noteSchema);

export default Note;
