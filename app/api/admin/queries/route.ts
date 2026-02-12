import { NextResponse, NextRequest } from "next/server";
import { withAuth } from "@/app/lib/auth-middleware";
import dbConnect from "@/app/lib/dbConnect";
import ContactQuery from "@/app/models/ContactQuery";

// GET /api/admin/queries - Admin fetch all queries
export const GET = withAuth(async (req: NextRequest, { user }) => {
  console.log(`Authenticated user: ${user.email} is fetching all queries.`);
  try {
    await dbConnect();

    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status"); // pending, in_progress, resolved, closed
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build query
    const query: any = {};
    if (status) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [queries, total] = await Promise.all([
      ContactQuery.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ContactQuery.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: queries,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Failed to fetch admin queries:", error);
    return NextResponse.json(
      { error: "Failed to fetch queries" },
      { status: 500 }
    );
  }
});
