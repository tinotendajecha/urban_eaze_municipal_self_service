import prisma from "@/utils/dbconfig";

export async function POST(req: Request) {
    try {
      const { userId, permitType, description, location, submissionDate, status } = await req.json();
  
      if (!userId || !permitType || !description || !location || !submissionDate) {
        return new Response(
          JSON.stringify({ message: "All fields are required!" }),
          { status: 400 }
        );
      }
  
      const newPermit = await prisma.permits.create({
        data: { userId, permitType, description, location, submissionDate: new Date(submissionDate), status },
      });
  
      return new Response(
        JSON.stringify({ message: "Permit created successfully!", permit: newPermit }),
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating permit:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error when creating permit!" }),
        { status: 500 }
      );
    }
  }