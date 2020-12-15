const fs = require('fs').promises;

const findMongoCategory = async (id) => {
  const file = await fs.readFile('../categories/categories.json');
  const mongoCategory = JSON.parse(file);
  const category = mongoCategory.filter((c) => c._id.$oid === id)[0];

  return category;
};

const findPGCategory = async (mongoCategory) => {
  const file = await fs.readFile('../categories/pg-categories.json');
  const pgCategories = JSON.parse(file);

  const category = pgCategories.filter(
    (c) =>
      c.titleUZ === mongoCategory.title.uz &&
      c.titleRU === mongoCategory.title.ru &&
      c.titleEN === mongoCategory.title.eng &&
      c.imageUrl === mongoCategory.imageUrl
  );

  return category[0];
};

const main = async () => {
  const file = await fs.readFile('./services.json');
  const data = JSON.parse(file);

  const services = [];

  Promise.all(
    data.map(async (item, i) => {
      const mongoCategory = await findMongoCategory(item.category.$oid);
      const category = await findPGCategory(mongoCategory);

      const keywords =
        item.keywords && item.keywords.length > 0
          ? JSON.stringify(item.keywords).replace('[', '{').replace(']', '}')
          : null;

      const service = {
        id: i + 1,
        titleUZ: item.title.uz,
        titleRU: item.title.ru,
        titleEN: item.title.eng,
        imageUrl: item.imageUrl,
        main: false,
        keywords,
        createdAt: '2020-12-11 01:23:53.941+02',
        updatedAt: '2020-12-11 01:23:53.941+02',
        categoryId: category.id,
      };

      console.log(service);

      services.push(service);
    })
  ).then(() => {
    fs.writeFile('pg-services.json', JSON.stringify(services));
  });
};

main().catch((err) => console.error(err));
