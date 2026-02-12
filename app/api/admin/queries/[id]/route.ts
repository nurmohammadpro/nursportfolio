import { NextResponse, NextRequest } from "next/server";
import { withAuth } from "@/app/lib/auth-middleware";
import dbConnect from "@/app/lib/dbConnect";
import ContactQuery from "@/app/models/ContactQuery";
import mongoose from "mongoose";

// GET /api/admin/queries/[id] - Admin fetch single query
export const GET = withAuth(async (req: NextRequest, { user, params }) => {
  console.log(`Authenticated user: ${user.email} is fetching query details.`);
  try {
    const { id } = params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return NextResponse.json(
        { error: "Invalid query ID" },
        { status: 400 }
      );
    }

    await dbConnect();

    const query = await ContactQuery.findById(id).lean();

    if (!query) {
      return NextResponse.json({ error: "Query not found" }, { status: 404 });
    }

    return NextResponse.json(query, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch query:", error);
    return NextResponse.json(
      { error: "Failed to fetch query" },
      { status: 500 }
    );
  }
});

// PUT /api/admin/queries/[id] - Admin update query status/notes
export const PUT = withAuth(async (req: NextRequest, { user, params }) => {
  console.log(`Authenticated user: ${user.email} is updating query.`);
  try {
    const { id } = params;
    const body = await req.json();
    const { status, notes, adminEmail } = body;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return NextResponse.json(
        { error: "Invalid query ID" },
        { status: 400 }
      );
    }

    await dbConnect();

    const query = await ContactQuery.findById(id);
    if (!query) {
      return NextResponse.json({ error: "Query not found" }, { status: 404 });
    }

    // Update fields
    const updates: any = {};
    if (status) {
      updates.status = status;

      // Set timestamps based on status
      if (status === "in_progress" && !query.respondedAt) {
        updates.respondedAt = new Date();
      }
      if (status === "resolved" && !query.resolvedAt) {
        updates.resolvedAt = new Date();
      }
    }
    if (notes !== undefined) updates.notes = notes;
    if (adminEmail) updates.adminEmail = adminEmail;

    await ContactQuery.findByIdAndUpdate(id, { $set: updates });

    // Fetch updated document
    const updatedQuery = await ContactQuery.findById(id).lean();

    return NextResponse.json(updatedQuery, { status: 200 });
  } catch (error) {
    console.error("Failed to update query:", error);
    return NextResponse.json(
      { error: "Failed to update query" },
      { status: 500 }
    );
  }
});

// DELETE /api/admin/queries/[id] - Admin delete query
export const DELETE = withAuth(async (req: NextRequest, { user, params }) => {
  console.log(`Authenticated user: ${user.email} is deleting query.`);
  try {
    const { id } = params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return NextResponse.json(
        { error: "Invalid query ID" },
        { status: 400 }
      );
    }

    await dbConnect();

    const query = await ContactQuery.findByIdAndDelete(id);
    if (!query) {
      return NextResponse.json({ error: "Query not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Query deleted successfully", id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete query:", error);
    return NextResponse.json(
      { error: "Failed to delete query" },
      { status: 500 }
    );
  }
});
