import prisma from "@/utils/dbconfig";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    // Ensure req.json() is only called once
    const data = await req.json();

    console.log("Received Data:", data);

    if (!data) {
      return new Response(
        JSON.stringify({ message: "Request body is empty or invalid!" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { name, email, phone, password, role, standType, address } = data;

    // Validate required fields
    if (!name || !email || !phone || !password || !role) {
      return new Response(
        JSON.stringify({ message: "All fields are required!" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hash the password before storing it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // // Store user in the database
    const newUser = await prisma.user.create({
      data: {
        name, email, phone, password: hashedPassword, role, standType, address
      }
    });

    return new Response(
      JSON.stringify({ message: "User created successfully!" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating user:", error);

    return new Response(
      JSON.stringify({ message: "Internal server error when creating user!" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
