const fs = require('fs').promises;

const findMongoUser = async (id) => {
  const file = await fs.readFile('../users/users.json');
  const mongoUser = JSON.parse(file);
  const user = mongoUser.filter((c) => c._id.$oid === id)[0];

  return user;
};

const findPGUser = async (mongoUser) => {
  const file = await fs.readFile('../users/pg-users.json');
  const pgUsers = JSON.parse(file);

  const user = pgUsers.filter(
    (c) =>
      c.firstName === mongoUser.firstName &&
      c.email === mongoUser.email &&
      c.password === mongoUser.password
  );

  return user[0];
};

const main = async () => {
  const file = await fs.readFile('./pros.json');
  const data = JSON.parse(file);

  const pros = [];

  Promise.all(
    data.map(async (item, i) => {
      const mongoUser = await findMongoUser(item.user.$oid);
      const user = await findPGUser(mongoUser);

      const payments =
        item.payments && item.payments.length > 0
          ? JSON.stringify(item.payments).replace('[', '{').replace(']', '}')
          : null;

      const work_images =
        item.work_images && item.work_images.length > 0
          ? JSON.stringify(item.work_images).replace('[', '{').replace(']', '}')
          : null;

      const overview_address =
        item.overview.address && item.overview.address.length > 0
          ? JSON.stringify(item.overview.address)
              .replace('[', '{')
              .replace(']', '}')
          : null;

      const overview_employees_count = item.overview.count_employees
        ? item.overview.count_employees.length > 0
          ? parseInt(item.overview.count_employees)
          : null
        : null;

      const work_time =
        item.work_time.length > 0 ? JSON.stringify(item.work_time) : null;

      const pro = {
        id: i + 1,
        name: item.name,
        overview_hired: item.overview.hired,
        overview_confirmed: item.overview.confirmed,
        overview_employees_count,
        overview_year_founded: item.overview.year_founded || null,
        overview_phone: item.overview.phone,
        overview_website: item.overview.website,
        overview_address,
        description: item.description,
        profile_image: item.profile_image,
        work_images,
        payments,
        pricing_display: item.pricing.display,
        pricing_contact: item.pricing.contact,
        pricing_manual_hourly_price: item.pricing.manual.hourly_price,
        pricing_manual_estimated: item.pricing.manual.estimated,
        pricing_manual_starting: item.pricing.manual.starting,
        social_media_telegram: item.social_media.telegram,
        social_media_facebook: item.social_media.facebook,
        social_media_instagram: item.social_media.instagram,
        review_average: item.review ? item.review.average : 0,
        work_time,
        createdAt: '2020-12-11 01:23:53.941+02',
        updatedAt: '2020-12-11 01:23:53.941+02',
        userId: user.id,
      };

      pros.push(pro);
    })
  ).then(() => {
    fs.writeFile('pg-pros.json', JSON.stringify(pros));
  });
};

main().catch((err) => console.error(err));
