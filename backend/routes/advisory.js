const express = require("express");
const Advisory = require("../models/Advisory");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// ADMIN: GET ALL ADVISORIES
router.get("/all", auth, admin, async (req, res) => {
  const advisories = await Advisory.find({
    createdBy: req.user.id,
  }).sort({ createdAt: -1 });

  res.json(advisories);
});


/* FARMER: VIEW ADVISORY */
router.get("/", auth, async (req, res) => {
  const { crop, soil } = req.query;

  const data = await Advisory.find({
    crop: { $regex: new RegExp(`^${crop}$`, "i") },
    soil: { $regex: new RegExp(`^${soil}$`, "i") },
  });

  res.json(data);
});

/* ADMIN: ADD ADVISORY */
router.post("/", auth, admin, async (req, res) => {
  const advisory = await Advisory.create({
    crop: req.body.crop.trim(),
    soil: req.body.soil.trim(),
    title: req.body.title.trim(),
    content: req.body.content.trim(),
    createdBy: req.user.id, // 🔒 ownership
  });

  res.status(201).json(advisory);
});


/* ADMIN: UPDATE ADVISORY */
router.put("/:id", auth, admin, async (req, res) => {
  const advisory = await Advisory.findOne({
    _id: req.params.id,
    createdBy: req.user.id,
  });

  if (!advisory)
    return res.status(403).json({ msg: "Unauthorized" });

  Object.assign(advisory, req.body);
  await advisory.save();

  res.json(advisory);
});


/* ADMIN: DELETE ADVISORY */
router.delete("/:id", auth, admin, async (req, res) => {
  const advisory = await Advisory.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user.id,
  });

  if (!advisory)
    return res.status(403).json({ msg: "Unauthorized" });

  res.json({ msg: "Advisory deleted" });
});

module.exports = router;
