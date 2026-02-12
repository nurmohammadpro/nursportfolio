import mongoose, { Schema, model, models } from "mongoose";

const SkillSchema = new Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["development", "wordpress", "security", "automation", "other"],
    },
    level: {
      type: String,
      required: true,
      enum: ["beginner", "intermediate", "expert"],
    },
    icon: {
      type: String,
      enum: ["cpu", "shield", "layers", "terminal", "globe", "zap"],
      default: "cpu",
    },
    description: { type: String },
    technologies: [{ type: String }],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Skill = models.Skill || model("Skill", SkillSchema);
export default Skill;
