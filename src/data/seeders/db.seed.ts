import bcrypt from 'bcrypt';
import prisma from "@/utils/dbconfig";

async function main() {
  const adminEmail = 'admin@urbanease.com';
  const adminPassword = 'password123'; 

  // Hash the password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Upsert the admin user to ensure idempotency
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword, 
      role: 'ADMIN',
      phone: '0774567890'
    },
  });

  console.log('Admin account seeded successfully.');
}

main()
  .catch((e) => {
    console.error('Error seeding admin account:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
