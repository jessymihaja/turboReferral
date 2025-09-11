
const mongoose = require("mongoose");

const promReferralSchema = new mongoose.Schema({
  referral: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Referral",
    required: true,
  },
  dateDebut: {
    type: Date,
    required: true,
  },
  dateFin: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("PromReferral", promReferralSchema);
