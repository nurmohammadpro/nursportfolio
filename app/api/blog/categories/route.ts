import { NextResponse } from "next/server";
import { getAllCategories } from "@/app/lib/blog-types";
import dbConnect from "@/app/lib/dbConnect";
import Post from "@/app/models/Post";

export const dynamic = "force-dynamic";

// GET /api/blog/categories - Fetch all categories with post counts
export async function GET() {
  try {
    await dbConnect();

    // Get all categories with their post counts
    const categoriesWithCounts = await Post.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Merge with predefined categories
    const categories = getAllCategories().map((cat) => {
      const countData = categoriesWithCounts.find((c: any) => c._id === cat.slug);
      return {
        ...cat,
        postCount: countData?.count || 0,
      };
    });

    // Filter to only show categories with posts or predefined ones
    const activeCategories = categories.filter((cat) => cat.postCount > 0 || getAllCategories().some((c) => c.slug === cat.slug));

    return NextResponse.json({ data: activeCategories }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json(
      { error: "Internal Server Error: Could not fetch categories." },
      { status: 500 }
    );
  }
}
