import Aircraft from "../models/airCraft.model.js";

// Add new aircraft
export const addAircraft = async (req, res) => {
  try {
    // Debug: log incoming data
    // console.log("req.body:", req.body);
    // console.log("req.file:", req.file);

    // Defensive: handle empty strings and undefined
    const {
      registration,
      model,
      type,
      crewCapacity,
      passengerCapacity,
      base,
      status
    } = req.body;

    if (
      !registration?.trim() ||
      !model?.trim() ||
      !type?.trim() ||
      crewCapacity === undefined ||
      passengerCapacity === undefined ||
      !base?.trim() ||
      !status?.trim()
    ) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Parse numbers safely
    const crewCap = Number(crewCapacity);
    const paxCap = Number(passengerCapacity);

    if (!crewCapacity || !passengerCapacity || isNaN(crewCap) || isNaN(paxCap)) {
      return res.status(400).json({ success: false, message: "Capacity fields must be numbers" });
    }

    // If operatorId is available from auth, use it, else allow null for testing
    const operatorId = req.user?.id || null;

    // Handle file (optional)
    let dgcaCertificate = null;
    if (req.file) {
      dgcaCertificate = {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        buffer: req.file.buffer,
        size: req.file.size
      };
      // Save to DB or disk/cloud as needed
    }

    const aircraft = new Aircraft({
      registration,
      model,
      type,
      crewCapacity: crewCap,
      passengerCapacity: paxCap,
      base,
      status,
      operatorId,
      // dgcaCertificate,
    });

    await aircraft.save();
    res.status(201).json({ success: true, aircraft });
  } catch (error) {
    console.error("Aircraft add error:", error); // Log error for debugging
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all aircrafts for operator or all if not authenticated
export const getAircrafts = async (req, res) => {
  try {
    let filter = {};
    if (req.user?.id) filter.operatorId = req.user.id;
    const aircrafts = await Aircraft.find(filter);
    res.json({ success: true, aircrafts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update aircraft
export const updateAircraft = async (req, res) => {
  try {
    const aircraft = await Aircraft.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, aircraft });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete aircraft
export const deleteAircraft = async (req, res) => {
  try {
    await Aircraft.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Aircraft deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
