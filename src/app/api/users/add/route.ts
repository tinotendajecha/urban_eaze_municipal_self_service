import prisma from "@/utils/dbconfig";

export async function POST(req: Request) {
    try {
      const { name, email, phone, password, role } = await req.json();
  
      if (!name || !email || !phone || !password || !role) {
        return new Response(
          JSON.stringify({ message: "All fields are required!" }),
          { status: 400 }
        );
      }
  
      const newUser = await prisma.user.create({
        data: { name, email, phone, password, role },
      });
  
      return new Response(
        JSON.stringify({ message: "User created successfully!", user: newUser }),
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating user:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error when creating user!" }),
        { status: 500 }
      );
    }
  }