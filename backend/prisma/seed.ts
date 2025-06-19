import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed UserRoles
  /*const userRoles = [
    { name: "RETAILER" },
    { name: "CORPORATE" },
    { name: "SELLER" },
  ];

  for (const role of userRoles) {
    await prisma.userRole.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  // Seed ImageTypes
  const imageTypes = [
    { name: "FRONT" },
    { name: "BACK" },
    { name: "LEFT" },
    { name: "RIGHT" },
    { name: "TOP" },
    { name: "BOTTOM" },
    { name: "DETAIL" },
    { name: "OTHER" },
  ];

  for (const type of imageTypes) {
    await prisma.imageType.upsert({
      where: { name: type.name },
      update: {},
      create: type,
    });
  }*/

    const product_types = [
      { name: "SHIRT" },
      { name: "SHERWANI" },
      { name: "BLAZERS" }
    ];
  
    for (const role of product_types) {
      await prisma.productType.upsert({
        where: { name: role.name },
        update: {},
        create: role,
      });
    }
  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
