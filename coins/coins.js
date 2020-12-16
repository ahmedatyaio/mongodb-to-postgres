const fs = require('fs').promises;

const findMongoPro = async (id) => {
  const file = await fs.readFile('../pros/pros.json');
  const mongoPro = JSON.parse(file);
  const user = mongoPro.filter((c) => c._id.$oid === id)[0];

  return user;
};

const findPGPro = async (mongoPro) => {
  const file = await fs.readFile('../pros/pg-pros.json');
  const pgUsers = JSON.parse(file);

  //   const user = pgUsers.filter((c) => {
  //     if (mongoPro) {
  //       if (c.name === mongoPro.name && c.description === mongoPro.description) {
  //         return c;
  //       }
  //     }
  //     // if (mongoPro && c.name === mongoPro.name) {
  //     //   if (mongoPro.phone && c.overview_phone === mongoPro.overview.phone) {
  //     //     if (mongoPro && c.description === mongoPro.description) {
  //     //       return c;
  //     //     }
  //     //   }
  //     // }
  //   });

  const user = pgUsers.find((c) => {
    if (mongoPro) {
      if (c.name === mongoPro.name && c.description === mongoPro.description) {
        return c;
      }
    }
  });

  return user;
};

const handleFindingPro = (item, i) => {
  return new Promise(async (resolve, reject) => {
    const mongoUser = await findMongoPro(item.pro.$oid);
    const pro = await findPGPro(mongoUser);

    if (pro) {
      const coin = {
        id: i + 1,
        count: item.count,
        createdAt: '2020-12-11 01:23:53.941+02',
        updatedAt: '2020-12-11 01:23:53.941+02',
        proId: pro.id,
      };

      return coin;
    }
  });
};

const main = async () => {
  const file = await fs.readFile('./coins.json');
  const data = JSON.parse(file);

  console.log('BEFORE PROMISE ALL');

  const coins = await Promise.all(
    data.map(async (item, i) => {
      const mongoUser = await findMongoPro(item.pro.$oid);
      const pro = await findPGPro(mongoUser);

      if (pro) {
        const coin = {
          id: i + 1,
          count: item.count,
          createdAt: '2020-12-11 01:23:53.941+02',
          updatedAt: '2020-12-11 01:23:53.941+02',
          proId: pro.id,
        };

        return coin;
      }
    })
  );

  console.log(coins);
  await fs.writeFile('pg-coins.json', JSON.stringify(coins));
};

main().catch((err) => console.error(err));
