const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clean existing data (optional, but good for idempotent seeding)
  await prisma.user.deleteMany({});
  await prisma.size.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.productModel.deleteMany({});
  await prisma.request3D.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.content.deleteMany({});
  await prisma.contentType.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.addressType.deleteMany({});

  // 2. Seed Admin User
  const saltRounds = 10;
  const adminPasswordHash = await bcrypt.hash('admin123', saltRounds);
  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@kakuta.com',
      password: adminPasswordHash,
      role: 'ADMIN',
    },
  });
  console.log(`Created user: ${adminUser.username}`);

  // 3. Seed Address Types and Addresses
  const officeType = await prisma.addressType.create({ data: { name: 'US Office' } });
  const headOfficeType = await prisma.addressType.create({ data: { name: 'Japan Head Office' } });

  const usAddress = await prisma.address.create({
    data: {
      addressTypeId: officeType.id,
      address: 'All American Bushing, 123 Industrial Way, Valencia, CA, USA',
      phone1: '661-295-2929',
      phone2: '661-295-2930',
      email: 'sales@allamericanbushing.com',
    },
  });
  console.log(`Created address: ${usAddress.address}`);

  // 4. Seed Content Types and Contents (Hero, About)
  const heroType = await prisma.contentType.create({ data: { name: 'hero' } });
  const aboutType = await prisma.contentType.create({ data: { name: 'about' } });

  await prisma.content.create({
    data: {
      contentTypeId: heroType.id,
      language: 'en',
      title: 'Discover Kakuta Toggle Clamps',
      detail: 'Originated in Japan, Kakuta has been providing top-quality toggle clamps for the automobile, aerospace, and manufacturing industries for over 65 years.',
      isPublished: true,
    },
  });

  await prisma.content.create({
    data: {
      contentTypeId: aboutType.id,
      language: 'en',
      title: 'About Kakuta',
      detail: 'Originated in Japan, Kakuta was established in 1959 to serve the leading Japanese automobile manufacturing industry. Kakuta toggle clamps have been widely recognized among Japanese automobile assembly plants including Toyota, Nissan, Honda, and Mitsubishi.',
      isPublished: true,
    },
  });
  console.log('Created Hero & About contents.');

  // 5. Seed Categories
  const cat1 = await prisma.category.create({ data: { name: 'Vertical Handle Clamps' } });
  const cat2 = await prisma.category.create({ data: { name: 'Horizontal Handle Clamps' } });
  const cat3 = await prisma.category.create({ data: { name: 'Push/Pull Clamps' } });
  const cat4 = await prisma.category.create({ data: { name: 'Latch Clamps' } });
  console.log('Created Categories.');

  // 6. Seed Products with Sizes and Mock Images
  const prod1 = await prisma.product.create({
    data: {
      name: 'Vertical Clamp KC-101-A',
      details: 'Vertical handle toggle clamp with solid bar and flanged base.',
      description: 'Widely used in welding, jigging, and repair work. Provides high holding capacity with minimum space requirements.',
      categoryId: cat1.id,
      sizes: {
        create: [
          {
            holdingCapacityMetric: '50 kg',
            weightMetric: '120 g',
            handleMovesMetric: '60°',
            barMovesMetric: '100°',
            drawingMovementMetric: '-',
            holdingCapacityInch: '110 lbs',
            weightInch: '0.26 lbs',
            handleMovesInch: '60°',
            barMovesInch: '100°',
            drawingMovementInch: '-',
          },
        ],
      },
      images: {
        create: [
          { imageUrl: '/uploads/mock_clamp_vertical.jpg' },
        ],
      },
    },
  });

  const prod2 = await prisma.product.create({
    data: {
      name: 'Horizontal Clamp KC-201-B',
      details: 'Horizontal handle toggle clamp with open bar and straight base.',
      description: 'Perfect low height design clamp. The handle and clamp bar move in the same direction for space saving operation.',
      categoryId: cat2.id,
      sizes: {
        create: [
          {
            holdingCapacityMetric: '90 kg',
            weightMetric: '145 g',
            handleMovesMetric: '75°',
            barMovesMetric: '90°',
            drawingMovementMetric: '-',
            holdingCapacityInch: '200 lbs',
            weightInch: '0.32 lbs',
            handleMovesInch: '75°',
            barMovesInch: '90°',
            drawingMovementInch: '-',
          },
        ],
      },
      images: {
        create: [
          { imageUrl: '/uploads/mock_clamp_horizontal.jpg' },
        ],
      },
    },
  });

  const prod3 = await prisma.product.create({
    data: {
      name: 'Push/Pull Clamp KC-301-FM',
      details: 'Plunger stroke toggle clamp with heavy duty steel.',
      description: 'Locks in either push or pull position. Ideal for testing fixtures, assembly jigs, or tensioning applications.',
      categoryId: cat3.id,
      sizes: {
        create: [
          {
            holdingCapacityMetric: '150 kg',
            weightMetric: '335 g',
            handleMovesMetric: '180°',
            barMovesMetric: '32 mm',
            drawingMovementMetric: '32 mm',
            holdingCapacityInch: '330 lbs',
            weightInch: '0.74 lbs',
            handleMovesInch: '180°',
            barMovesInch: '1.25 in',
            drawingMovementInch: '1.25 in',
          },
        ],
      },
      images: {
        create: [
          { imageUrl: '/uploads/mock_clamp_pushpull.jpg' },
        ],
      },
    },
  });

  console.log(`Created products: ${prod1.name}, ${prod2.name}, ${prod3.name}`);
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
