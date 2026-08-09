import "dotenv/config";
import { prisma } from "../lib/prisma";

const searchTerms: Record<string, string> = {
  "1": "scarf",
  "2": "coffee beans",
  "3": "ceramic mug",
  "4": "leather bag",
};

async function searchPexels(query: string, perPage: number): Promise<string[]> {
  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}`,
    { headers: { Authorization: process.env.PEXELS_API_KEY! } }
  );
  const data = await response.json();
  return (data.photos ?? []).map((p: { src: { large: string } }) => p.src.large);
}

async function main() {
  for (const [productId, term] of Object.entries(searchTerms)) {
    const urls = await searchPexels(term, 3);
    // urls[0] is already saved as the cover photo from last time — use the
    // next two results as the gallery extras, so they're related but not identical
    const extras = urls.slice(1, 3);

    await prisma.productImage.deleteMany({ where: { productId } });
    await prisma.productImage.createMany({
      data: extras.map((url, i) => ({ productId, url, position: i })),
    });

    console.log(`Product ${productId} (${term}): ${extras.length} gallery photos updated`);
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
