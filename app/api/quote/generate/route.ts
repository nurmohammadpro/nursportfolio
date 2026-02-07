import { Resend } from "resend";
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvoiceTemplate } from "@/app/components/InvoiceTemplate";
import React from "react";
import dbConnect from "@/app/lib/dbConnect";
import Quote from "@/app/models/Quote";
import AgencyProject from "@/app/models/AgencyProject";
import Client from "@/app/models/Client";

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { projectId, quoteId } = await req.json();

    if (!projectId || !quoteId) {
      return NextResponse.json(
        { error: "Missing projectId or quoteId" },
        { status: 400 },
      );
    }

    await dbConnect();

    // 2. Fetch Data using Mongoose
    const quoteData = await Quote.findById(quoteId);
    const projectData = await AgencyProject.findById(projectId);

    if (!quoteData || !projectData) {
      return NextResponse.json(
        { error: "Project or Quote data not found" },
        { status: 404 },
      );
    }

    // 3. Fetch Client Email via the Client ID stored in the project
    const clientData = await Client.findById(projectData.clientId);

    const clientEmail = clientData?.email;

    if (!clientEmail) {
      return NextResponse.json(
        { error: "Client email not found" },
        { status: 400 },
      );
    }

    // 4. Render PDF to Buffer
    const pdfBuffer = await renderToBuffer(
      React.createElement(InvoiceTemplate, {
        quote: quoteData,
        project: projectData,
      }) as any,
    );

    // 5. Transmit via Resend with PDF attachment
    const { data, error } = await resend.emails.send({
      from: "Billing <billing@yourdomain.com>", // Replace with your verified Resend domain
      to: clientEmail,
      subject: `Invoice: ${quoteData.subject}`,
      attachments: [
        {
          filename: `Invoice_${quoteId}.pdf`,
          content: pdfBuffer,
        },
      ],
      html: `
        <div style="font-family: sans-serif; color: #111; max-width: 600px;">
          <p style="text-transform: uppercase; font-size: 10px; font-weight: bold; letter-spacing: 0.1em; color: #666;">Invoice Attached</p>
          <h2 style="font-weight: 300;">Milestone Reached: ${quoteData.subject}</h2>
          <p>The technical phase for <strong>${projectData?.title}</strong> has been completed.</p>
          <p>An invoice for <strong>$${quoteData.amount}</strong> is attached to this email for your records.</p>
          <br />
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/client/payments" 
             style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; font-size: 12px; font-weight: bold; border-radius: 4px; display: inline-block;">
             VIEW IN DASHBOARD
          </a>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 6. Update Quote status to 'sent' in Mongo
    await Quote.findByIdAndUpdate(quoteId, {
      status: "sent",
      sentAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Invoice sent successfully",
    });
  } catch (error: any) {
    console.error("PDF/Email Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
