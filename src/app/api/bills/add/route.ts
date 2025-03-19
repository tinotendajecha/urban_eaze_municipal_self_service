import prisma from "@/utils/dbconfig";
import { generatePaymentId } from "@/lib/generatePaymentId";

export async function POST(req: Request) {
  try {
    const {
      userId,
      amountPaid,
      paymentMethod,
      transactionCode,
      description,
      payment_for,
    } = await req.json();

    const transactionId = await generatePaymentId();

    const first_leg = {
      reference: `${userId}_${payment_for}_${amountPaid}`,
      transactionCode: transactionCode == 1 ? 1 : -1,
      status: transactionCode == 1 ? "PAID" : "DEBITED",
      paymentMethod: paymentMethod,
      amountPaid: amountPaid,
      payment_for: payment_for,
      account: userId,
      description: description,
      transactionId,
    };

    const find_admin = await prisma.user.findUnique({
      where: {
        email: "admin@urbanease.com",
      },
    });

    if (!find_admin) {
      return new Response(JSON.stringify({ error: "Account is required" }), {
        status: 400,
      });
    }

    const second_leg = {
      reference: `${userId}_${payment_for}_${amountPaid}`,
      transactionCode: transactionCode == 1 ? -1 : 1,
      status: transactionCode == -1 ? "DEBITED" : "CREDITED",
      paymentMethod: paymentMethod,
      amountPaid: amountPaid,
      payment_for: payment_for,
      account: find_admin?.id,
      description: description,
      transactionId,
    };

    const first_leg_payment = await prisma.payment.create({ data: first_leg });
    const second_leg_payment = await prisma.payment.create({
      data: second_leg,
    });

    if (first_leg_payment && second_leg_payment) {
      return new Response(JSON.stringify({ message: "Transaction success" }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ message: "Transaction failed" }), {
        status: 404,
      });
    }
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
