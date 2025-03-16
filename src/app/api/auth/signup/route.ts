import prisma from "@/utils/dbconfig";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    console.log("data: ", data);
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = {
      username: data.username,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    };

    const find_user = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (find_user) {
      return new Response(JSON.stringify({ message: "User Account exists!" }), {
        status: 400,
      });
    }

    const new_user = await prisma.user.create({
      data: user,
    });

    // Return the processed data
    return new Response(
      JSON.stringify({ message: "Account created successfully" }),
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
