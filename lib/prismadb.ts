import { PrismaClient } from "@prisma/client";

// Make sure only one instance exists throughout sesh
let prismadb: PrismaClient;

if (!global.prismadb) {
  global.prismadb = new PrismaClient({
    log: ["info"],
  });
}
prismadb = global.prismadb;

export default prismadb;