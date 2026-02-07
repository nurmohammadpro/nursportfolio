import mongoose, { Schema, model, models } from "mongoose";

const EmailTemplateSchema = new Schema(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
  },
  { timestamps: true }
);

const EmailTemplate =
  models.EmailTemplate || model("EmailTemplate", EmailTemplateSchema);
export default EmailTemplate;
