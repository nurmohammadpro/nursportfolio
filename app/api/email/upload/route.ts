import { AwsClient } from "aws4fetch";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const r2 = new AwsClient({
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    service: "s3",
    region: "auto",
  });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const fileName = `${Date.now()}-${file.name}`;

    // Construct the S3 API URL for your APAC bucket
    const url = `${process.env.R2_ENDPOINT}/nurs-portfolio-assets/${fileName}`;

    // Sign and send the request using standard fetch
    const response = await r2.fetch(url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });

    if (!response.ok) throw new Error("R2 Upload Failed");

    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${fileName}`;

    return NextResponse.json({ url: publicUrl, name: file.name });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
