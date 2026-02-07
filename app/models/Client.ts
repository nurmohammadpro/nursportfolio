import mongoose, { Schema, model, models } from "mongoose";

const ClientSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    company: { type: String },
    source: {
      type: String,
      enum: ["contact-form", "referral", "manual-entry", "portfolio_inquiry"],
      default: "contact-form",
    },
  },
  { timestamps: true }
);

const Client = models.Client || model("Client", ClientSchema);
export default Client;
