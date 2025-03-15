import prisma from "@/utils/dbconfig";

export async function POST(req: Request) {
    try {
      const { userId, category, description, status, assignedTo } = await req.json();
  
      if (!userId || !category || !description) {
        return new Response(
          JSON.stringify({ message: "User ID, category, and description are required!" }),
          { status: 400 }
        );
      }
  
      const newRequest = await prisma.serviceRequest.create({
        data: { userId, category, description, status, assignedTo },
      });
  
      return new Response(
        JSON.stringify({ message: "Service request created successfully!", request: newRequest }),
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating service request:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error when creating service request!" }),
        { status: 500 }
      );
    }
  }
  