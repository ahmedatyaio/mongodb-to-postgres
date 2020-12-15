const fs = require('fs').promises;

const main = async () => {
  const file = await fs.readFile('./categories.json');
  const data = JSON.parse(file);

  const categories = [];

  data.map((item, i) => {
    const category = {
      id: i + 1,
      titleUZ: item.title.uz,
      titleRU: item.title.ru,
      titleEN: item.title.eng,
      descriptionUZ: '',
      descriptionRU: '',
      descriptionEN: '',
      iconType: item.iconType,
      imageUrl: item.imageUrl,
      showMain: item.showMain,
      createdAt: '2020-12-11 01:23:53.941+02',
      updatedAt: '2020-12-11 01:23:53.941+02',
    };

    categories.push(category);
  });

  fs.writeFile('pg-categories.json', JSON.stringify(categories));
};

main().catch((err) => console.error(err));
