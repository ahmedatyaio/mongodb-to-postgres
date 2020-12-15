const fs = require('fs').promises;

const main = async () => {
  const file = await fs.readFile('./users.json');
  const data = JSON.parse(file);

  const users = [];

  data.map((item, i) => {
    const {
      firstName,
      lastName,
      email,
      phone,
      tgusername,
      password,
      status,
      imageUrl,
      isAdmin,
      isPro,
    } = item;

    const user = {
      id: i + 1,
      firstName,
      lastName,
      email,
      phone,
      tgusername,
      password,
      status,
      imageUrl,
      isAdmin,
      isPro,
      createdAt: '2020-12-11 01:23:53.941+02',
      updatedAt: '2020-12-11 01:23:53.941+02',
    };

    users.push(user);
  });

  fs.writeFile('pg-users.json', JSON.stringify(users));
};

main().catch((err) => console.error(err));
