const Plan = require("../models/Plan");

// Get all pricing plans
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Plan by ID
exports.getPlanById = async (req, res) => {
  try {
    const planId = req.params.id;

    // Fetch the plan by ID
    const plan = await Plan.findById(planId);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Return the plan details
    return res.status(200).json(plan);
  } catch (error) {
    console.error("Error fetching plan by ID:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Create a new pricing plan
exports.createPlan = async (req, res) => {
  const { plan, name, price, features, popular, durationInDays } = req.body;
  const newPlan = new Plan({
    plan,
    name,
    price,
    features,
    popular,
    durationInDays,
  });

  try {
    const savedPlan = await newPlan.save();
    res.status(201).json(savedPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing pricing plan
exports.updatePlan = async (req, res) => {
  try {
    const updatedPlan = await Plan.findOneAndUpdate(
      { plan: req.params.plan },
      req.body,
      { new: true }
    );
    if (!updatedPlan)
      return res.status(404).json({ message: "Plan not found" });
    res.json(updatedPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a pricing plan
exports.deletePlan = async (req, res) => {
  try {
    const deletedPlan = await Plan.findOneAndDelete({ plan: req.params.plan });
    if (!deletedPlan)
      return res.status(404).json({ message: "Plan not found" });
    res.json({ message: "Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
