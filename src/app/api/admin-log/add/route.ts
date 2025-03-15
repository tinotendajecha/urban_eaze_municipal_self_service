import prisma from "@/utils/dbconfig";

export async function POST(req: Request) {
    try {
      const { adminId, action } = await req.json();
  
      if (!adminId || !action) {
        return new Response(
          JSON.stringify({ message: "Admin ID and action are required!" }),
          { status: 400 }
        );
      }
  
      const newAdminLog = await prisma.adminLog.create({
        data: { adminId, action },
      });
  
      return new Response(
        JSON.stringify({ message: "Admin log created successfully!", adminLog: newAdminLog }),
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating admin log:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error when creating admin log!" }),
        { status: 500 }
      );
    }
  }