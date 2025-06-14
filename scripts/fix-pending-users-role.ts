import prisma from "@/lib/prisma";

async function fixPendingUsers() {
  try {
    const result = await prisma.users.updateMany({
      where: { role: "pending" },
      data: { role: "confirmed" },
    });
    console.log("Updated " + result.count + " users from 'pending' to 'confirmed'");
  } catch (error) {
    console.error("Error updating pending users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixPendingUsers();
