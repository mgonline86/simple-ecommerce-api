import bcryptjs from 'bcryptjs';
import { randBetweenDate, randNumber, randProduct, randUser } from "@ngneat/falso";
import { faker } from "@faker-js/faker";
import { db } from '../config/db';

const main = async () => {
    try {
        const fakeUsers = randUser({ length: 5 })
        await db.product.deleteMany(); //delete existing products
        for (let u = 0; u < fakeUsers.length; u++) {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const email = faker.internet.email({ firstName, lastName, provider: 'kortobaa.dev' });
            const hashedPassword = await bcryptjs.hash(firstName.toLowerCase() + lastName.toUpperCase(), 10);
            const uCreatedAt = randBetweenDate({
                from: new Date("10/07/2022"),
                to: new Date(),
            });
            const uUpdatedAt = randBetweenDate({
                from: uCreatedAt,
                to: new Date(),
            });
            const fakeProducts = randProduct({
                length: 20,
            });

            // cleanup the existing database
            await db.user.delete({ where: { email } }).catch(() => {
                // delete existing user found with same email
            });

            const user = await db.user.create({
                data: {
                    firstName,
                    lastName,
                    email: email,
                    password: hashedPassword,
                    createdAt: uCreatedAt,
                    updatedAt: uUpdatedAt,
                },
            });

            for (let index = 0; index < fakeProducts.length; index++) {
                const product = fakeProducts[index];
                const title = faker.commerce.productName();
                const image = index % 5 === 0 ? null : faker.image.url();
                const pCreatedAt = randBetweenDate({
                    from: uCreatedAt,
                    to: new Date(),
                });
                const pUpdatedAt = randBetweenDate({
                    from: pCreatedAt,
                    to: new Date(),
                });
                await db.product.create({
                    data: {
                        createdAt: pCreatedAt,
                        updatedAt: pUpdatedAt,
                        title,
                        description: index % 6 === 0 ? null : faker.commerce.productDescription() || product?.description,
                        price: faker.commerce.price({ min: 1, max: 1000, dec: 2 }),
                        quantity: randNumber({ min: 10, max: 100 }),
                        image,
                        userId: user.id,
                    }
                });
            }
        }
        console.log(`Database has been seeded. 🌱`);
    }
    catch (error) {
        throw error;
    }
}

main().catch((err) => {
    console.warn("Error While generating Seed: \n", err);
});