import mongoose, { Schema, model, models } from "mongoose";

const MilestoneSchema = new Schema({
  label: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const ServiceRequestSchema = new Schema(
  {
    clientId: { type: String, required: true },
    clientEmail: { type: String, required: true },
    serviceName: { type: String, required: true },
    packageType: {
      type: String,
      enum: ["basic", "standard", "premium"],
      required: true,
    },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending_payment", "in_progress", "completed", "cancelled"],
      default: "pending_payment",
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    milestones: [MilestoneSchema],
  },
  { timestamps: true }
);

const ServiceRequest =
  models.ServiceRequest || model("ServiceRequest", ServiceRequestSchema);
export default ServiceRequest;
