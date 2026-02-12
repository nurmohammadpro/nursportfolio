import mongoose, { Schema, model, models } from "mongoose";

const ContactQuerySchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    service: { type: String },
    subject: { type: String },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved", "closed"],
      default: "pending",
    },
    notes: { type: String, default: "" },
    adminEmail: { type: String }, // Email of admin handling the query
    respondedAt: { type: Date },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

const ContactQuery = models.ContactQuery || model("ContactQuery", ContactQuerySchema);
export default ContactQuery;
