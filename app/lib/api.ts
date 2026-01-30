export const sendInquiry = async (formData: any, serviceType: string) => {
  try {
    const response = await fetch("/api/inquiry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        serviceType,
        timestamp: new Date().toISOString(), // Vital for real-time sorting
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Transmission failed");
    }

    return await response.json();
  } catch (error) {
    console.error("API Utility Error:", error);
    throw error;
  }
};
