import Policymodel from "../models/policy.model.js";

export const createOrUpdatePolicy = async (req, res) => {
    try {
    const operatorId = req.operator._id;
    const { service, cancellationPolicy, weatherPolicy } = req.body;
    
    // Upsert: if policy exists (same operator + service), update it
    const policy = await Policymodel.findOneAndUpdate(
      { operator: operatorId, service: service || null },
      { cancellationPolicy, weatherPolicy },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    
    res.status(200).json(policy);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export async function getAllPolicies (req, res) {
    try {
        const operatorId = req.operator._id;
        const policies = await Policymodel.find({ operator: operatorId })
            .populate("Service", "name"); // optional: show service name
        res.json(policies);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
}

// in this code if service is empty, send global data.
export const getPolicy = async (req, res) => {
  try {
    const operatorId = req.operator._id;
    const service = req.query.service || null;

    let policy = null;

    if (service && service !== "") {
      // Try to find service-specific policy
      policy = await Policymodel.findOne({
        operator: operatorId,
        service: service,
      });
    }

    // If not found, or if service=null was requested → fallback to global
    if (!policy) {
      policy = await Policymodel.findOne({
        operator: operatorId,
        service: null,
      });
    }

    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }

    res.json(policy);
  } catch (err) {
    console.error("Error fetching policy:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const deletePolicy = async (req, res) => {
  try {
    const operatorId = req.operator._id;
    const { serviceId } = req.params;

    const deleted = await Policymodel.findOneAndDelete({
      operator: operatorId,
      service: serviceId === "global" ? null : serviceId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Policy not found" });
    }

    res.json({ message: "Policy deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};