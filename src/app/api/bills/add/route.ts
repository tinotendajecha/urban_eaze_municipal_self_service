import prisma from "@/utils/dbconfig";

export async function POST(req: Request) {
    try {
      const { userId, billType, amount, dueDate, status } = await req.json();
  
      if (!userId || !billType || !amount || !dueDate) {
        return new Response(
          JSON.stringify({ message: "All fields are required!" }),
          { status: 400 }
        );
      }
  
      const newBill = await prisma.bill.create({
        data: { userId, billType, amount, dueDate, status },
      });
  
      return new Response(
        JSON.stringify({ message: "Bill created successfully!", bill: newBill }),
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating bill:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error when creating bill!" }),
        { status: 500 }
      );
    }
  }