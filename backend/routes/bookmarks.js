const express = require("express");
const Bookmark = require("../models/Bookmark");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search, sort } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }
    let sortOption = { createdAt: -1 };
    if (sort === "title") sortOption = { title: 1 };
    if (sort === "category") sortOption = { category: 1 };

    const bookmarks = await Bookmark.find(query).sort(sortOption);
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    if (!bookmark)
      return res.status(404).json({ message: "Bookmark not found" });
    res.json(bookmark);
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newBookmark = new Bookmark(req.body);
    await newBookmark.save();
    res.status(201).json(newBookmark);
  } catch (err) {
    res.status(400).json({ message: "Error creating bookmark" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Bookmark.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Bookmark not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Error updating bookmark" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Bookmark.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Bookmark not found" });
    res.json({ message: "Bookmark deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting bookmark" });
  }
});

module.exports = router;
