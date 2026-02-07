import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/app/lib/dbConnect";
import Project from "@/app/models/Project";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req:NextRequest, {params}: {params: {id: string}}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const {index} = await req.json()
        const projectId = params.id;

        await dbConnect()

        const updatedProjcet = await Project.findByIdAndUpdate(
            projectId,
            {$set: {
                [`milestones.${index}.completed`]: true,
                [`milestones.${index}.completedAt`]: new Date(),
                status: "in_progress",
                updatedAt: new Date()
            }},
            {new: true}
        )

        if (!updatedProjcet) {
            return NextResponse.json({error: "Project not found"}, {status: 404})
        })

        return NextResponse.json({message: "Project updated successfully", project: updatedProjcet})
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}