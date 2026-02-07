import dbConnect from "./dbConnect";
import AgencyProject from "../models/AgencyProject";
import Quote from "../models/Quote";

/**
 * PRODUCTION-GRADE MILESTONE LINKAGE
 * Automatically generates a quote when a technical phase is completed.
 */
export const completeMilestoneAndRequestPayment = async (
  projectId: string,
  milestoneIndex: number,
  milestoneLabel: string,
) => {
  try {
    await dbConnect();
    const project = await AgencyProject.findById(projectId);

    if (!project) return;

    // 1. Update the technical status in the project document
    project.milestones[milestoneIndex].completed = true;
    project.milestones[milestoneIndex].completedAt = new Date();
    project.status = "in_progress";
    project.updatedAt = new Date();

    await project.save();

    // 2. Automate the Quote Generation for this Milestone
    const quoteAmount = project.totalPrice / project.milestones.length;

    await Quote.create({
      projectId: projectId,
      clientId: project.clientId,
      amount: quoteAmount,
      subject: `Payment for Milestone: ${milestoneLabel}`,
      status: "pending",
    });

    console.log(`Milestone ${milestoneLabel} locked. Payment requested.`);
  } catch (error) {
    console.error("Milestone-Payment Linkage Failure:", error);
  }
};
