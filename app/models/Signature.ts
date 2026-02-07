import mongoose, { Schema, model, models } from "mongoose";

const SignatureSchema = new Schema(
  {
    alias: { type: String },
    mailboxId: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Signature = models.Signature || model("Signature", SignatureSchema);
export default Signature;
