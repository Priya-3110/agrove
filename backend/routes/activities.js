const express = require("express");
const Activity = require("../models/Activity");
const Farm = require("../models/Farm");
const auth = require("../middleware/authMiddleware");
const { Parser } = require("json2csv");

const router = express.Router();

/* ================= HELPER ================= */
const getOwnedFarm = async (farmId, userId) => {
  return await Farm.findOne({ _id: farmId, owner: userId });
};

/* ================= CSV EXPORT ================= */

// EXPORT ACTIVITIES CSV (only own farm)
router.get("/export/csv/:farmId", auth, async (req, res) => {
  try {
    const farm = await getOwnedFarm(req.params.farmId, req.user.id);
    if (!farm) return res.status(403).json({ msg: "Unauthorized" });

    const activities = await Activity.find({ farm: farm._id }).lean();

    const parser = new Parser({ fields: ["type", "date", "notes"] });
    const csv = parser.parse(activities);

    res.header("Content-Type", "text/csv");
    res.attachment("activities.csv");
    res.send(csv);
  } catch {
    res.status(500).json({ msg: "CSV export failed" });
  }
});

/* ================= ANALYTICS ================= */

// TOTAL activity count (only user's farms)
router.get("/count/all", auth, async (req, res) => {
  try {
    const farms = await Farm.find({ owner: req.user.id }).select("_id");
    const farmIds = farms.map((f) => f._id);

    const count = await Activity.countDocuments({
      farm: { $in: farmIds },
    });

    res.json({ count });
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
});

// ACTIVITY TYPE STATS (only user's data)
router.get("/stats/types", auth, async (req, res) => {
  const farms = await Farm.find({ owner: req.user.id }).select("_id");
  const farmIds = farms.map((f) => f._id);

  const stats = await Activity.aggregate([
    { $match: { farm: { $in: farmIds } } },
    { $group: { _id: "$type", count: { $sum: 1 } } },
  ]);

  res.json(stats);
});

// RECENT ACTIVITIES (only user's data)
router.get("/recent", auth, async (req, res) => {
  const farms = await Farm.find({ owner: req.user.id }).select("_id");
  const farmIds = farms.map((f) => f._id);

  const recent = await Activity.find({
    farm: { $in: farmIds },
  })
    .sort({ date: -1 })
    .limit(5);

  res.json(recent);
});

// ACTIVITY COUNT PER FARM (only own farm)
router.get("/count/:farmId", auth, async (req, res) => {
  const farm = await getOwnedFarm(req.params.farmId, req.user.id);
  if (!farm) return res.status(403).json({ msg: "Unauthorized" });

  const count = await Activity.countDocuments({ farm: farm._id });
  res.json({ count });
});

/* ================= CRUD ================= */

// GET activities (only own farm)
router.get("/:farmId", auth, async (req, res) => {
  const farm = await getOwnedFarm(req.params.farmId, req.user.id);
  if (!farm) return res.status(403).json({ msg: "Unauthorized" });

  const activities = await Activity.find({ farm: farm._id });
  res.json(activities);
});

// CREATE activity (only own farm)
router.post("/:farmId", auth, async (req, res) => {
  const farm = await getOwnedFarm(req.params.farmId, req.user.id);
  if (!farm) return res.status(403).json({ msg: "Unauthorized" });

  const activity = await Activity.create({
    farm: farm._id,
    ...req.body,
  });

  res.status(201).json(activity);
});

// UPDATE activity (only own)
router.put("/:id", auth, async (req, res) => {
  const activity = await Activity.findById(req.params.id).populate("farm");

  if (!activity || activity.farm.owner.toString() !== req.user.id) {
    return res.status(403).json({ msg: "Unauthorized" });
  }

  Object.assign(activity, req.body);
  await activity.save();

  res.json(activity);
});

// DELETE activity (only own)
router.delete("/:id", auth, async (req, res) => {
  const activity = await Activity.findById(req.params.id).populate("farm");

  if (!activity || activity.farm.owner.toString() !== req.user.id) {
    return res.status(403).json({ msg: "Unauthorized" });
  }

  await activity.deleteOne();
  res.json({ msg: "Activity deleted" });
});

module.exports = router;
