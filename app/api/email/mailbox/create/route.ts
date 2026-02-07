import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Mailbox from "@/app/models/Mailbox";
import Signature from "@/app/models/Signature";

export async function POST(req: Request) {
  try {
    const { alias, role } = await req.json();

    await dbConnect();

    // Format the email to be the official nurmohammad.pro alias
    const emailAddress = `${alias.toLowerCase().trim()}@nurmohammad.pro`;

    try {
      // 1. Pixel Perfect Check: Does this mailbox already exist?
      const existing = await Mailbox.findOne({ email: emailAddress });

      if (existing) {
        return NextResponse.json(
          { error: "This mailbox alias already exists." },
          { status: 400 },
        );
      }

      // 2. Provision the Mailbox
      const newMailbox = await Mailbox.create({
        email: emailAddress,
        role: role,
        active: true,
      });

      // 3. Provision the Default Signature
      // Linked via the new document ID for relational integrity
      await Signature.create({
        alias: emailAddress,
        mailboxId: newMailbox._id,
        content: `Best Regards,\nNur Mohammad\nWeb Application Developer | nurmohammad.pro`,
      });

      return NextResponse.json({
        success: true,
        email: emailAddress,
        id: newMailbox._id,
      });
    } catch (dbError: any) {
      console.error("MONGO_FAILURE:", dbError.message);
      return NextResponse.json(
        { error: `Infrastructure Error: ${dbError.message}` },
        { status: 500 },
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
