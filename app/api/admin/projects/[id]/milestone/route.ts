import { withAuth, AuthenticatedContext } from "@/app/lib/auth-middleware";
import dbConnect from "@/app/lib/dbConnect";
import EmailThread from "@/app/models/EmailThread";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  id: string;
};

export const PATCH = withAuth<RouteParams>(
  async (req: NextRequest, context: AuthenticatedContext<RouteParams>) => {
    try {
      if ((context.user as any).role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { index } = await req.json();
      const projectId = context.params.id;

      await dbConnect();

      const updatedEmailThread = await EmailThread.findByIdAndUpdate(
        projectId,
        {
          $set: {
            [`milestones.${index}.completed`]: true,
            [`milestones.${index}.completedAt`]: new Date(),
            status: "in_progress",
            updatedAt: new Date(),
          },
        },
        { new: true }
      );

      if (!updatedEmailThread) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }

      return NextResponse.json({
        message: "Project updated successfully",
        project: updatedEmailThread,
      });
    } catch (error) {
      console.error("Error updating project:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }
);