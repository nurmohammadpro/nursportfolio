import mongoose, { Schema, model, models } from "mongoose";

const MilestoneSchema = new Schema({
  label: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  price: { type: Number },
});

const AgencyProjectSchema = new Schema(
  {
    clientId: { type: String, required: true },
    serviceType: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    totalPrice: { type: Number },
    paymentModel: {
      type: String,
      enum: ["milestone", "advance"],
      default: "milestone",
    },
    advancePercentage: { type: Number },
    status: {
      type: String,
      enum: [
        "new_inquiry",
        "contacted",
        "proposal_sent",
        "deposit_paid",
        "in_progress",
        "in_review",
        "completed",
        "on_hold",
        "cancelled",
      ],
      default: "new_inquiry",
    },
    progress: { type: Number, default: 0 },
    milestones: [MilestoneSchema],
    notes: { type: String },
    deadline: { type: Date },
  },
  { timestamps: true }
);

const AgencyProject =
  models.AgencyProject || model("AgencyProject", AgencyProjectSchema);
export default AgencyProject;
