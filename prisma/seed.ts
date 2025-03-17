import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@ac.com';
  const adminPassword = 'password123'; // Change this to a strong password

  // Hash the password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Upsert the admin user to ensure idempotency
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {}, // If the user already exists, no changes will be made
    create: {
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword, // Store the hashed password
      role: 'ADMIN', // Adjust the role or fields as needed
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
