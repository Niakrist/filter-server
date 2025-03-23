import { PrismaClient } from "@prisma/client";
import { GAMES } from "./games.data";

const prisma = new PrismaClient()

async function main() {
    console.log("Starting data upload...");
    try {
        const result = await prisma.game.createMany({ data: GAMES });
        console.log(`Successfully added ${result.count} games to the database.`);
    } catch (error) {
        console.error("Error during data upload: ", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
        console.log('Disconnected from databaase');
    }
}
main();