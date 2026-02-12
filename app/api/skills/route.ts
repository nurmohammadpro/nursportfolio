import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Skill from "@/app/models/Skill";

// GET /api/skills - Public endpoint to fetch all active skills
export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const level = searchParams.get("level");

    // Build query
    const query: any = { isActive: true };
    if (category) query.category = category;
    if (level) query.level = level;

    const skills = await Skill.find(query).sort({ order: 1, name: 1 }).lean();

    return NextResponse.json(skills, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch skills:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}
