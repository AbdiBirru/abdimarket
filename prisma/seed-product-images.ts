import "dotenv/config";
import { prisma } from "../lib/prisma";

const extraImages: Record<string, string[]> = {
  "1": ["https://picsum.photos/seed/abdimarket-1b/600/600", "https://picsum.photos/seed/abdimarket-1c/600/600"],
  "2": ["https://picsum.photos/seed/abdimarket-2b/600/600", "https://picsum.photos/seed/abdimarket-2c/600/600"],
  "3": ["https://picsum.photos/seed/abdimarket-3b/600/600", "https://picsum.photos/seed/abdimarket-3c/600/600"],
  "4": ["https://picsum.photos/seed/abdimarket-4b/600/600", "https://picsum.photos/seed/abdimarket-4c/600/600"],
};

async function main() {
  for (const [productId, urls] of Object.entries(extraImages)) {
    await prisma.productImage.deleteMany({ where: { productId } });
    await prisma.productImage.createMany({
      data: urls.map((url, i) => ({ productId, url, position: i })),
    });
  }
  console.log("Seeded extra photos for 4 products.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
