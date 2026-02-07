import mongoose, { Schema, model, models } from "mongoose";

const SubscriptionSchema = new Schema(
  {
    endpoint: { type: String, required: true },
    expirationTime: { type: Number },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true },
    },
    // Adding an identifier if we want to target specific devices (like 'nur_mobile')
    deviceId: { type: String },
  },
  { timestamps: true }
);

const Subscription =
  models.Subscription || model("Subscription", SubscriptionSchema);
export default Subscription;
