"use strict";

let mongoose = require("mongoose");

let Schema   = mongoose.Schema
,   ObjectId = Schema.Types.ObjectId;

let OrderSchema = new Schema({
  
  user: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  
  address: {
    name: String,
    phone: String,
    email: String,
    street: String,
    city: String,
    state: String,
    zip: String
  },
  
  charge: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: "usd"
    },
    source: String
  },
  
  items: [{
    type: ObjectId,
    ref: "Item"
  }],
  
  stripe: {
    type: Object,
    required: true
  },
  
  sent: {
    type: Boolean,
    default: false
  },
  
  created: {
    type: Date,
    default: Date.now()
  }
  
});


mongoose.model("Order", OrderSchema);