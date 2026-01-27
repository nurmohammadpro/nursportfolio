import { adminAuth } from "@/app/lib/firebase-admin";
import { NextRequest } from "next/server";
import { DecodedIdToken } from "firebase-admin/auth";

export type AuthenticatedContext<T = {}> = {
  user: DecodedIdToken;
  params: T;
};

export function withAuth<T = {}>(
  handler: (
    req: NextRequest,
    context: AuthenticatedContext<T>,
  ) => Promise<Response>,
) {
  return async (req: NextRequest, context: { params: Promise<T> }) => {
    try {
      //Get the token from the Authorization header
      const authHeader = req.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response(
          JSON.stringify({
            error: "Unauthorized: Missing or malformed Authorization header.",
          }),
          { status: 401, headers: { "Content-Type": "application/json" } },
        );
      }

      const token = authHeader.split("Bearer ")[1];

      //Verify the token with Firebase Admin SDK
      const decodedToken = await adminAuth.verifyIdToken(token);

      //Resolve the params promise from Next.js
      const resolvedParams = await context.params;

      //Call the original handler with the user and resolved params
      return handler(req, { user: decodedToken, params: resolvedParams });
    } catch (error) {
      console.error("Authentication error:", error);
      if (
        error instanceof Error &&
        error.message.includes("id-token-expired")
      ) {
        return new Response(
          JSON.stringify({ error: "Unauthorized: Token has expired." }),
          { status: 401, headers: { "Content-Type": "application/json" } },
        );
      }

      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid token." }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }
  };
}
