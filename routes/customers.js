const mongoose = require("mongoose");
const { Customer, validate } = require("../models/customer");
const express = require("express");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const customers = await Customer.find({ addedBy: req.user._id }).sort("name");
  res.send(customers);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  console.log("got req to save customer, req body is", req.body);
  console.log("error is ", error);
  if (error) return res.status(400).send(error.details[0].message);
  let customer = new Customer({
    name: req.body.name,
    contact: req.body.contact,
    gender: req.body.gender,
    addedBy: req.user._id,
  });
  customer = await customer.save();

  res.send(customer);
});

router.delete("/:id", auth, validateObjectId, async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
});

module.exports = router;
