import "dotenv/config";
import { prisma } from "../lib/prisma";

const products = [
  {
    id: "1",
    name: "Handwoven Cotton Scarf",
    description: "Hand-loomed cotton scarf finished with a traditional tibeb border.",
    price: 24.99,
    imageUrl: "https://picsum.photos/seed/abdimarket-1/600/600",
    category: "Accessories",
    stock: 18,
  },
  {
    id: "2",
    name: "Single-Origin Coffee Beans, 250g",
    description: "Freshly roasted arabica beans, sourced direct from small highland farms.",
    price: 14.5,
    imageUrl: "https://picsum.photos/seed/abdimarket-2/600/600",
    category: "Coffee",
    stock: 42,
  },
  {
    id: "3",
    name: "Hand-Thrown Ceramic Mug",
    description: "A wheel-thrown stoneware mug, glazed in a warm matte finish.",
    price: 18.0,
    imageUrl: "https://picsum.photos/seed/abdimarket-3/600/600",
    category: "Home",
    stock: 30,
  },
  {
    id: "4",
    name: "Leather Crossbody Bag",
    description: "Full-grain leather bag with a brass clasp and adjustable strap.",
    price: 64.0,
    imageUrl: "https://picsum.photos/seed/abdimarket-4/600/600",
    category: "Accessories",
    stock: 12,
  },
  {
    id: "5",
    name: "Woven Storage Basket",
    description: "Durable hand-woven basket, perfect for plants or everyday storage.",
    price: 29.0,
    imageUrl: "https://picsum.photos/seed/abdimarket-5/600/600",
    category: "Home",
    stock: 20,
  },
  {
    id: "6",
    name: "Brass Coffee Ceremony Set",
    description: "A traditional jebena pot and cups, hand-cast in brass.",
    price: 89.0,
    imageUrl: "https://picsum.photos/seed/abdimarket-6/600/600",
    category: "Home",
    stock: 8,
  },
  {
    id: "7",
    name: "Handloomed Wool Blanket",
    description: "Soft wool throw, woven in a classic striped pattern.",
    price: 54.0,
    imageUrl: "https://picsum.photos/seed/abdimarket-7/600/600",
    category: "Home",
    stock: 15,
  },
  {
    id: "8",
    name: "Silver Filigree Earrings",
    description: "Delicate drop earrings, hand-crafted with traditional filigree work.",
    price: 38.0,
    imageUrl: "https://picsum.photos/seed/abdimarket-8/600/600",
    category: "Accessories",
    stock: 24,
  },
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: product,
    });
  }
  console.log(`Seeded ${products.length} products.`);
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
