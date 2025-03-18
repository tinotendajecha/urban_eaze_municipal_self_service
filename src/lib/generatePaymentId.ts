import prisma from "@/utils/dbconfig";

export const generatePaymentId = async () =>{
  // Get the count of tickets
  const count = await prisma.payment.count();
  // Generate the ticket ID in the format TKT-001
  const ticketNumber = (count + 1).toString().padStart(3, "0");
  return `PYM-${ticketNumber}`;
}