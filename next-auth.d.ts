import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // User ID
      username?: string; // Custom username
      role?: string; // Optional role
      address?: string;
      email: string; // Email (already included by default)
      image?: string; // Profile image (already included by default)
    };
  }

  interface User {
    id?: string; // Add ID to the User interface if needed
    username?: string; // Add username to the User interface
    role?: string; // Add role to the User interface
    address?: string;
  }
}
