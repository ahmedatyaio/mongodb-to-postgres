const fs = require('fs').promises;

const findMongoUser = async (id) => {
  const file = await fs.readFile('../pros/pros.json');
  const mongoUser = JSON.parse(file);
  const user = mongoUser.filter((c) => c._id.$oid === id)[0];

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

let id = 1;

const main = async () => {
  const file = await fs.readFile('./pros.json');
  const decoded = JSON.parse(file);

  const data = decoded.filter((p) => p.templates);

  const templates = [];

  Promise.all(
    data.map(async (item) => {
      const mongoUser = await findMongoUser(item._id.$oid);
      const pgPro = await findPGPro(mongoUser);

      Promise.all(
        item.templates.map((data) => {
          const template = {
            id,
            title: data.title,
            isFixed: data.isFixed,
            price: data.price,
            text: data.text,
            file: data.file,
            createdAt: '2020-12-11 01:23:53.941+02',
            updatedAt: '2020-12-11 01:23:53.941+02',
            proId: pgPro.id,
          };

          console.log(template);

          templates.push(template);
          id++;
        })
      );
    })
  ).then(() => {
    fs.writeFile('pg-templates.json', JSON.stringify(templates));
  });
};

main().catch((err) => console.error(err));
