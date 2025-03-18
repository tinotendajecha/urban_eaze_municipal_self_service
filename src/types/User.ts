
export type User = {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: "USER" | "ADMIN"; // Adjust if more roles exist
  };