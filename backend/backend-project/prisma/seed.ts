export const seedDatabase = async () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    try {
        // Clear existing data
        await prisma.modelName.deleteMany(); // Replace modelName with your actual model name

        // Seed new data
        await prisma.modelName.createMany({
            data: [
                {
                    // Add your seed data here
                    field1: 'value1',
                    field2: 'value2',
                },
                {
                    field1: 'value3',
                    field2: 'value4',
                },
            ],
        });

        console.log('Seeding completed successfully.');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await prisma.$disconnect();
    }
};

if (require.main === module) {
    seedDatabase();
}