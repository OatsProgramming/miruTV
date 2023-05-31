import { PrismaClient } from "@prisma/client";

// The reason for assigning the PrismaClient instance to a global variable is 
// to ensure that only one instance of the PrismaClient is created during the lifetime of the application
const prismadb = global.prismadb || new PrismaClient()

if (process.env.NODE_ENV === 'production') global.prismadb = prismadb

export default prismadb