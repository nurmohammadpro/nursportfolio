import { NextResponse, NextRequest } from "next/server";
import { withAuth } from "@/app/lib/auth-middleware";
import dbConnect from "@/app/lib/dbConnect";
import Skill from "@/app/models/Skill";

// GET /api/admin/skills - Admin fetch all skills (including inactive)
export const GET = withAuth(async (req: NextRequest, { user }) => {
  console.log(`Authenticated user: ${user.email} is fetching all skills.`);
  try {
    await dbConnect();

    const { searchParams } = req.nextUrl;
    const category = searchParams.get("category");
    const level = searchParams.get("level");
    const isActive = searchParams.get("isActive");

    // Build query
    const query: any = {};
    if (category) query.category = category;
    if (level) query.level = level;
    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const skills = await Skill.find(query).sort({ order: 1, name: 1 }).lean();

    return NextResponse.json(skills, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch admin skills:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
});

// POST /api/admin/skills - Admin create new skill
export const POST = withAuth(async (req: NextRequest, { user }) => {
  console.log(`Authenticated user: ${user.email} is creating a new skill.`);
  try {
    const body = await req.json();
    const { name, category, level, icon, description, technologies, order } = body;

    // Validation
    if (!name || !category || !level) {
      return NextResponse.json(
        { error: "Missing required fields: name, category, and level are required." },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if skill with same name exists
    const existingSkill = await Skill.findOne({ name });
    if (existingSkill) {
      return NextResponse.json(
        { error: "A skill with this name already exists." },
        { status: 409 }
      );
    }

    const newSkill = await Skill.create({
      name,
      category,
      level,
      icon: icon || "cpu",
      description,
      technologies: technologies || [],
      order: order || 0,
      isActive: true,
    });

    return NextResponse.json(newSkill, { status: 201 });
  } catch (error) {
    console.error("Failed to create skill:", error);
    return NextResponse.json(
      { error: "Failed to create skill" },
      { status: 500 }
    );
  }
});
