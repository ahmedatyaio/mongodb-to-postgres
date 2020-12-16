const fs = require('fs').promises;

const findMongoPro = async (id) => {
  const file = await fs.readFile('../pros/pros.json');
  const mongoPro = JSON.parse(file);
  const user = mongoPro.filter((c) => c._id.$oid === id)[0];

  return user;
};

const findPGPro = async (mongoPro) => {
  try {
    const file = await fs.readFile('../pros/pg-pros.json');
    const pgUsers = JSON.parse(file);

    const user = pgUsers.find((c) => {
      if (mongoPro) {
        if (
          c.name === mongoPro.name &&
          c.description === mongoPro.description
        ) {
          return c;
        }
      }
    });

    return user;
  } catch (error) {
    console.error(error);
  }
};

const getMongoService = async (id) => {
  try {
    const file = await fs.readFile('../services/services.json');
    const mongoServices = JSON.parse(file);

    const service = mongoServices.filter((c) => c._id.$oid === id)[0];

    return service;
  } catch (error) {
    console.error(error);
  }
};

const getPGService = async (service) => {
  const file = await fs.readFile('../services/pg-services.json');
  const pgServices = JSON.parse(file);

  const user = pgServices.find((c) => {
    if (service) {
      if (c.titleUZ === service.title.uz && c.imageUrl === service.imageUrl) {
        return c;
      }
    }
  });

  return user;
};

let id = 1;

const main = async () => {
  const file = await fs.readFile('./proservices.json');
  const data = JSON.parse(file);

  const pros = [];

  Promise.all(
    data.map(async (item, i) => {
      const user = await findPGPro(item);
      const servicesIds = await Promise.all(
        item.services.map(async (service) => {
          const mongoService = await getMongoService(service.$oid);
          const pgService = await getPGService(mongoService);

          if (pgService) {
            return pgService.id;
          }
        })
      );

      if (servicesIds) {
        await Promise.all(
          servicesIds.map(async (serviceId) => {
            const pro = {
              id,
              createdAt: '2020-12-10 23:23:53.941+00',
              updatedAt: '2020-12-10 23:23:53.941+00',
              proId: user.id,
              serviceId,
            };

            pros.push(pro);
            id++;
          })
        );
      }
    })
  ).then(() => {
    fs.writeFile('pg-proservices.json', JSON.stringify(pros));
  });
};

main().catch((err) => console.error(err));
