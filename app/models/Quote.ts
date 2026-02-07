import mongoose, { Schema, model, models } from "mongoose";

const QuoteSchema = new Schema(
  {
    subject: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "sent", "paid"],
      default: "pending",
    },
    projectId: { type: String, required: true },
    clientId: { type: String, required: true },
    sentAt: { type: Date },
  },
  { timestamps: true }
);

const Quote = models.Quote || model("Quote", QuoteSchema);
export default Quote;
