import FaqModel from "../models/faq.model.js";

// Create or update FAQ for a service (or global)
export const createOrUpdateFaq = async (req, res) => {
  try {
    const operatorId = req.operator._id;
    const { service, faqs } = req.body;

    // Upsert: if FAQ exists (same operator + service), update it
    const faqDoc = await FaqModel.findOneAndUpdate(
      { operator: operatorId, service: service || null },
      { faqs },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(faqDoc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all FAQs for the operator (all services)
export const getAllFaqs = async (req, res) => {
  try {
    const operatorId = req.operator._id;
    const faqs = await FaqModel.find({ operator: operatorId });
    res.json(faqs);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get FAQ for a specific service (or global fallback)
export const getFaq = async (req, res) => {
  try {
    const operatorId = req.operator._id;
    const service = req.query.service || null;

    let faqDoc = null;

    if (service && service !== "") {
      // Try to find service-specific FAQ
      faqDoc = await FaqModel.findOne({
        operator: operatorId,
        service: service,
      });
    }

    // If not found, or if service=null was requested → fallback to global
    if (!faqDoc) {
      faqDoc = await FaqModel.findOne({
        operator: operatorId,
        service: null,
      });
    }

    if (!faqDoc) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.json(faqDoc);
  } catch (err) {
    console.error("Error fetching FAQ:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete FAQ for a specific service (or global)
export const deleteFaq = async (req, res) => {
  try {
    const operatorId = req.operator._id;
    const { serviceId } = req.params;

    const deleted = await FaqModel.findOneAndDelete({
      operator: operatorId,
      service: serviceId === "global" ? null : serviceId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.json({ message: "FAQ deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
