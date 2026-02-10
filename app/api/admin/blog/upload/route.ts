import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthenticatedContext } from "@/app/lib/auth-middleware";
import { uploadToCloudinary } from "@/app/lib/cloudinary";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

// POST /api/admin/blog/upload - Upload blog image to Cloudinary
export const POST = withAuth(
  async (req: NextRequest, context: AuthenticatedContext) => {
    console.log(`Authenticated user: ${context.user.email} is uploading a blog image.`);

    try {
      const formData = await req.formData();
      const file = formData.get("file") as File;

      if (!file) {
        return NextResponse.json(
          { error: "No file provided" },
          { status: 400 }
        );
      }

      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file type. Please upload JPEG, PNG, WebP, or GIF images." },
          { status: 400 }
        );
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "File size exceeds 5MB limit" },
          { status: 400 }
        );
      }

      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Cloudinary
      const result = await uploadToCloudinary(buffer, file.name, "blog");

      // Return optimized URL and metadata
      return NextResponse.json({
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        // Include optimized URLs for different sizes
        thumbnail: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/c_thumb,w_300,h_300,g_face/${result.public_id}`,
        medium: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/c_limit,w_800/${result.public_id}`,
        large: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/c_limit,w_1200/${result.public_id}`,
      }, { status: 200 });
    } catch (error) {
      console.error("Failed to upload image:", error);
      return NextResponse.json(
        { error: "Internal Server Error: Failed to upload image." },
        { status: 500 }
      );
    }
  }
);
