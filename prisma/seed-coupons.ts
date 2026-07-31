import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      active: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "SAVE5" },
    update: {},
    create: {
      code: "SAVE5",
      discountType: "FIXED",
      discountValue: 5,
      active: true,
    },
  });

  console.log("Seeded 2 coupons.");
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
