import mongoose, { Schema, model, models } from "mongoose";

const MailboxSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    role: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Mailbox = models.Mailbox || model("Mailbox", MailboxSchema);
export default Mailbox;
