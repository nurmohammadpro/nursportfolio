import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type AuthenticatedContext<T = Record<string, never>> = {
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
  };
  params: T;
};

export function withAuth<T = Record<string, unknown>>(
  handler: (
    req: NextRequest,
    context: AuthenticatedContext<T>,
  ) => Promise<Response>,
) {
  return async (req: NextRequest, context: { params: Promise<T> }) => {
    try {
      const session = await getServerSession(authOptions);

      if (!session || !session.user) {
        return new Response(
          JSON.stringify({
            error: "Unauthorized: No session found.",
          }),
          { status: 401, headers: { "Content-Type": "application/json" } },
        );
      }

      //Resolve the params promise from Next.js
      const resolvedParams = await context.params;

      //Call the original handler with the user and resolved params
      return handler(req, { 
        user: session.user as any, 
        params: resolvedParams 
      });
    } catch (error) {
      console.error("Authentication error:", error);
      return new Response(
        JSON.stringify({ error: "Internal Server Error during authentication." }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  };
}
