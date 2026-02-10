import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

// Helper function to upload buffer to Cloudinary
export async function uploadToCloudinary(
  buffer: Buffer,
  filename: string,
  folder: string = "attachments",
): Promise<any> {
  // Check if Cloudinary is configured
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary environment variables are not configured");
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto",
          folder: folder,
          public_id: `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.]/g, "_")}`,
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("Cloudinary upload successful:", result?.public_id);
            resolve(result);
          }
        },
      )
      .end(buffer);
  });
}

// Function to upload from URL (for webhook use)
export async function uploadUrlToCloudinary(
  url: string,
  filename: string,
  folder: string = "attachments",
): Promise<any> {
  try {
    const response = await fetch(url);
    const buffer = Buffer.from(await response.arrayBuffer());
    return uploadToCloudinary(buffer, filename, folder);
  } catch (error) {
    console.error("Error uploading URL to Cloudinary:", error);
    throw error;
  }
}
