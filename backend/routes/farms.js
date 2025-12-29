const express = require("express");
const Farm = require("../models/Farm");
const auth = require("../middleware/authMiddleware");
const Activity = require("../models/Activity");


const router = express.Router();

/* GET farm count (MUST BE ABOVE "/:id" ROUTES) */
router.get("/count", auth, async (req, res) => {
  try {
    const count = await Farm.countDocuments({ owner: req.user.id });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/* GET farms */
router.get("/", auth, async (req, res) => {
  const farms = await Farm.find({ owner: req.user.id });
  res.json(farms);
});

/* CREATE farm */
router.post("/", auth, async (req, res) => {
  const farm = await Farm.create({
    ...req.body,
    owner: req.user.id,
  });
  res.status(201).json(farm);
});

const { Parser } = require("json2csv");

// EXPORT FARMS CSV
router.get("/export/csv", auth, async (req, res) => {
  try {
    const farms = await Farm.find({ owner: req.user.id }).lean();

    const fields = ["name", "crop", "soil", "area"];
    const parser = new Parser({ fields });
    const csv = parser.parse(farms);

    res.header("Content-Type", "text/csv");
    res.attachment("farms.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ msg: "CSV export failed" });
  }
});


/* DELETE farm */
router.delete("/:id", auth, async (req, res) => {
  try {
    const farm = await Farm.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!farm) {
      return res.status(404).json({ msg: "Farm not found" });
    }

    // 🔥 CASCADE DELETE ACTIVITIES
    await Activity.deleteMany({ farm: req.params.id });

    res.json({ msg: "Farm and related activities deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});



module.exports = router;
