const fs = require('fs').promises;

const findMongoPro = async (id) => {
  const file = await fs.readFile('../pros/pros.json');
  const mongoPro = JSON.parse(file);
  const user = mongoPro.filter((c) => c._id.$oid === id)[0];

  return user;
};

const findMongoUser = async (id) => {
  const file = await fs.readFile('../users/users.json');
  const mongoUser = JSON.parse(file);
  const user = mongoUser.filter((c) => c._id.$oid === id)[0];

  return user;
};

const findPGPro = async (mongoPro) => {
  const file = await fs.readFile('../pros/pg-pros.json');
  const pgUsers = JSON.parse(file);

  const user = pgUsers.find((c) => {
    if (mongoPro) {
      if (c.name === mongoPro.name && c.description === mongoPro.description) {
        return c;
      }
    }
  });

  return user;
};

const findPGUser = async (mongoUser) => {
  const file = await fs.readFile('../users/pg-users.json');
  const pgUsers = JSON.parse(file);

  const user = pgUsers.find((c) => {
    if (mongoUser) {
      if (c.email === mongoUser.email) {
        return c;
      }
    }
  });

  return user;
};

const main = async () => {
  const file = await fs.readFile('./reviews.json');
  const data = JSON.parse(file);

  const reviews = await Promise.all(
    data.map(async (item, i) => {
      const mongoPro = await findMongoPro(item.pro.$oid);
      const pgPro = await findPGPro(mongoPro);
      const mongoUser = await findMongoUser(item.user.$oid);
      const user = await findPGUser(mongoUser);

      const review = {
        id: i + 1,
        rate: item.rate.toFixed(1),
        comment: item.comment,
        createdAt: '2020-12-11 01:23:53.941+02',
        updatedAt: '2020-12-11 01:23:53.941+02',
        proId: pgPro.id,
      };

      console.log(review);

      return review;
    })
  );

  fs.writeFile('pg-reviews.json', JSON.stringify(reviews));
};

main().catch((err) => console.error(err));
