import Note from "../models/Note.js";
import { signData, verifySignature } from "../utils/signatureUtils.js";
import { deriveKey, encrypt, decrypt } from "../utils/cryptoUtils.js";

/**
 * GET ALL NOTES (Decrypt before sending)
 */
export async function getAllNotes(req, res) {
  try {
    const notes = await Note.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    console.log("KEY INPUT:", {
      passwordHash: req.user.passwordHash,
      userId: req.user.id,
    });

    const key = deriveKey(req.user.passwordHash, req.user.id);

    const decryptedNotes = notes.map((note) => ({
      _id: note._id,
      title: note.title,
      content: decrypt(
        note.encryptedContent,
        key,
        note.iv,
        note.authTag
      ),
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    }));

    res.status(200).json(decryptedNotes);
  } catch (error) {
    console.error("Error in getAllNotes controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * GET NOTE BY ID (Decrypt)
 */
export async function getNoteById(req, res) {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    // 🔑 Step 1: derive key
    const key = deriveKey(req.user.passwordHash, req.user.id);

    // 🔓 Step 2: decrypt content
    const decryptedContent = decrypt(
      note.encryptedContent,
      key,
      note.iv,
      note.authTag
    );

    // ✍️ Step 3: verify digital signature
    const isValid = verifySignature(decryptedContent, note.signature);
    if (!isValid) {
      return res.status(400).json({ message: "Note integrity compromised" });
    }

    // ✅ Step 4: send response
    res.status(200).json({
      _id: note._id,
      title: note.title,
      content: decryptedContent,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    });
  } catch (error) {
    console.error("Error in getNoteById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


/**
 * CREATE NOTE (Encrypt before saving)
 */
export async function createNote(req, res) {
  try {
    const { title, content } = req.body;

    const key = deriveKey(req.user.passwordHash, req.user.id);
    const { encryptedData, iv, authTag } = encrypt(content, key);
    const signature = signData(content);
    const note = new Note({
      title,
      encryptedContent : encryptedData,
      iv,
      authTag,
      signature,
      user: req.user.id,
    });
    const savedNote = await note.save();

    res.status(201).json({
      _id: savedNote._id,
      title: savedNote.title,
      content, // return plaintext only to owner
      createdAt: savedNote.createdAt,
      updatedAt: savedNote.updatedAt,
    });
  } catch (error) {
    console.error("Error in createNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * UPDATE NOTE (Re-encrypt)
 */
export async function updateNote(req, res) {
  try {
    const { title, content } = req.body;

    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    const key = deriveKey(req.user.passwordHash, req.user.id);
    const { encryptedData, iv, authTag } = encrypt(content, key);

    // 🔐 RE-SIGN updated content
    const signature = signData(content);

    note.title = title;
    note.encryptedContent = encryptedData;
    note.iv = iv;
    note.authTag = authTag;
    note.signature = signature;

    const updatedNote = await note.save();

    res.status(200).json({
      _id: updatedNote._id,
      title: updatedNote.title,
      content,
      createdAt: updatedNote.createdAt,
      updatedAt: updatedNote.updatedAt,
    });
  } catch (error) {
    console.error("Error in updateNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * DELETE NOTE (Authorization enforced)
 */
export async function deleteNote(req, res) {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    res.status(200).json({ message: "Note deleted successfully!" });
  } catch (error) {
    console.error("Error in deleteNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
