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
    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists()) return;
    const projectData = projectSnap.data();

    // 1. Update the technical status in the project document
    const updatedMilestones = [...projectData.milestones];
    updatedMilestones[milestoneIndex].completed = true;
    updatedMilestones[milestoneIndex].completedAt = new Date().toISOString();

    await updateDoc(projectRef, {
      milestones: updatedMilestones,
      updatedAt: new Date().toISOString(),
    });

    // 2. Automate the Quote Generation for this Milestone
    const quoteAmount = projectData.totalPrice / projectData.milestones.length;

    await addDoc(collection(db, "quotes"), {
      projectId: projectId,
      clientId: projectData.clientId,
      amount: quoteAmount.toFixed(2),
      subject: `Payment for Milestone: ${milestoneLabel}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    console.log(`Milestone ${milestoneLabel} locked. Payment requested.`);
  } catch (error) {
    console.error("Milestone-Payment Linkage Failure:", error);
  }
};
