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

  const user = pgUsers.filter(
    (c) => {
        if(mongoPro.name && c.name === mongoPro.name) {
            if(mongoPro.overview.phone && c.overview_phone === mongoPro.overview.phone) {
                if(mongoPro.description && c.description === mongoPro.description) {
                    return 
                }
            }
        }
    }
      c.name === mongoPro.name &&
      c.overview_phone === mongoPro.overview.phone &&
      c.description === mongoPro.description
  );

  return user[0];
};

const main = async () => {
  const file = await fs.readFile('./coins.json');
  const data = JSON.parse(file);

  const coins = [];
  Promise.all(
    data.map(async (item, i) => {
      const mongoUser = await findMongoPro(item.pro.$oid);
      const pro = await findPGPro(mongoUser);

      const coin = {
        id: i + 1,
        count: item.count,
        createdAt: '2020-12-11 01:23:53.941+02',
        updatedAt: '2020-12-11 01:23:53.941+02',
        proId: pro.id,
      };

      coins.push(coin);
    })
  ).then(await fs.writeFile('pg-coins.json', JSON.stringify(coins)));
};

main().catch((err) => console.error(err));
