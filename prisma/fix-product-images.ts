import "dotenv/config";
import { prisma } from "../lib/prisma";

const searchTerms: Record<string, string> = {
  "1": "scarf",
  "2": "coffee beans",
  "3": "ceramic mug",
  "4": "leather bag",
  "5": "woven basket",
  "6": "brass coffee pot",
  "7": "wool blanket",
  "8": "silver earrings",
};

async function searchPexels(query: string): Promise<string | null> {
  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
    { headers: { Authorization: process.env.PEXELS_API_KEY! } }
  );
  const data = await response.json();
  return data.photos?.[0]?.src?.large ?? null;
}

async function main() {
  for (const [productId, term] of Object.entries(searchTerms)) {
    const url = await searchPexels(term);
    if (!url) {
      console.log(`No result for "${term}" (product ${productId})`);
      continue;
    }
    await prisma.product.update({
      where: { id: productId },
      data: { imageUrl: url },
    });
    console.log(`Product ${productId} (${term}) -> updated`);
  }
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
