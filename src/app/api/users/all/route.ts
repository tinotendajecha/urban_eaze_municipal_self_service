import prisma from "@/utils/dbconfig";


export async function GET() {
    try {
      // Fetch all users
      const users = await prisma.user.findMany();
  
      return new Response(
        JSON.stringify({ message: "Success fetching all users!", users }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching users:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error when fetching users!" }),
        { status: 500 }
      );
    }
  }