import { NextResponse, NextRequest } from "next/server";
import { withAuth } from "@/app/lib/auth-middleware";
import dbConnect from "@/app/lib/dbConnect";
import Skill from "@/app/models/Skill";
import mongoose from "mongoose";

// PUT /api/admin/skills/[id] - Admin update skill
export const PUT = withAuth(async (req: NextRequest, { user, params }) => {
  console.log(`Authenticated user: ${user.email} is updating skill.`);
  try {
    const { id } = params;
    const body = await req.json();
    const { name, category, level, icon, description, technologies, order, isActive } = body;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return NextResponse.json(
        { error: "Invalid skill ID" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if skill exists
    const skill = await Skill.findById(id);
    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    // Update fields
    if (name) skill.name = name;
    if (category) skill.category = category;
    if (level) skill.level = level;
    if (icon) skill.icon = icon;
    if (description !== undefined) skill.description = description;
    if (technologies) skill.technologies = technologies;
    if (order !== undefined) skill.order = order;
    if (isActive !== undefined) skill.isActive = isActive;

    await skill.save();

    return NextResponse.json(skill, { status: 200 });
  } catch (error) {
    console.error("Failed to update skill:", error);
    return NextResponse.json(
      { error: "Failed to update skill" },
      { status: 500 }
    );
  }
});

// DELETE /api/admin/skills/[id] - Admin delete skill
export const DELETE = withAuth(async (req: NextRequest, { user, params }) => {
  console.log(`Authenticated user: ${user.email} is deleting skill.`);
  try {
    const { id } = params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return NextResponse.json(
        { error: "Invalid skill ID" },
        { status: 400 }
      );
    }

    await dbConnect();

    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Skill deleted successfully", id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete skill:", error);
    return NextResponse.json(
      { error: "Failed to delete skill" },
      { status: 500 }
    );
  }
});
