import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase
import { NextResponse } from "next/server";

export async function POST(request:Request) {
    try {
        const body = await request.json()
        const {name, email, phone, message} = body;

        // Save data to firerstore
        const docRef = await addDoc(collection(db, "messages"), {
            name, email, phone, message,
            createdAt: serverTimestamp();
        })

        return NextResponse.json({success: true, id: docRef.id}, {status: 200})
    } catch (error) {
        return NextResponse.json({success: false, error: "Failed to submit message"}, {status: 500})
    }
}