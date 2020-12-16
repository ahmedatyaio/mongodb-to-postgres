const fs = require('fs').promises;

const findQuestionMongo = async (id) => {
  const file = await fs.readFile('./questions.json');
  const mongoQuestions = JSON.parse(file);
  const question = mongoQuestions.filter((c) => c._id.$oid === id)[0];

  return question;
};

const findPGService = async (mongoService) => {
  const file = await fs.readFile('../services/pg-services.json');
  const pgServices = JSON.parse(file);

  const service = pgServices.filter(
    (c) =>
      c.titleUZ === mongoService.title.uz &&
      c.titleRU === mongoService.title.ru &&
      c.titleEN === mongoService.title.eng &&
      c.imageUrl === mongoService.imageUrl
  );

  return service[0];
};

const main = async () => {
  const file = await fs.readFile('./services.json');
  const dataServices = JSON.parse(file);

  const services = [];
  var questions = [];
  var questionTextArray = [];

  var questionTextCount = 1;
  var questionCount = 1;

  Promise.all(
    dataServices.map(async (service, i) => {
      if (service.spec_questions.length > 0) {
        await Promise.all(
          service.spec_questions.map(async (questionId, index) => {
            const item = await findQuestionMongo(
              service.spec_questions[index].$oid
            );
            if (item !== undefined) {
              const servicePG = await findPGService(service);
              var questionText;

              const question = {
                id: questionCount,
                type: 'question',
                skip: false,
                input_bar: false,
                client_only: false,
                filter_show: item.filter,
                pro_page: item.check,
                is_template: false,
                createdAt: '2020-12-11 01:23:53.941+02',
                updatedAt: '2020-12-11 01:23:53.941+02',
                serviceId: servicePG.id,
              };

              // console.log(question);
              questionCount++;
              questions.push(question);
              // console.log(questions);

              // // Question Texts START

              //Pro Question text
              questionText = {
                id: questionTextCount,
                uz: item.question.uz,
                ru: item.question.ru,
                 eng: item.question.eng,
                 belongs: 'pro',
                 group_id: 0,
                 type: 'question',
                 multiple: false,
                 createdAt: '2020-12-11 01:23:53.941+02',
                 uptedAt: '2020-12-11 01:23:53.941+02',
                 questionId: questionCount - 1,
               };
               questionTextCount++;
               //console.log(questionText);
               questionTextArray.push(questionText);

               //Client Question text
               questionText = {
                 id: questionTextCount,
                 uz: item.title.uz,
                 ru: item.title.ru,
                 eng: item.title.eng,
                 belongs: 'client',
                 group_id: 0,
                 type: 'question',
                 multiple: false,
                 createdAt: '2020-12-11 01:23:53.941+02',
                 updatedAt: '2020-12-11 01:23:53.941+02',
                 questionId: questionCount - 1,
               };
               questionTextCount++;
               //console.log(questionText);
               questionTextArray.push(questionText);

             // Choiceses QuestionText

             await item.values.map((value, index) => {
               questionText = {
                 id: questionTextCount,
                 uz: value.uz,
                 ru: value.ru,
                 eng: value.eng,
                 belongs: 'client',
                 group_id: index,
                 type: 'choice',
                 multiple: item.multiple,
                createdAt: '2020-12-11 01:23:53.941+02',
                 updatedAt: '2020-12-11 01:23:53.941+02',
                 questionId: questionCount - 1,
               };
               questionTextCount++;
                //console.log(questionText);
               questionTextArray.push(questionText);
              });

              //Question Text END
            }
          })
        );
      }
      //console.log(questions)
      //console.log(questionTextArray)
    })
  ).then(() => {
    let questionsStringify = JSON.stringify(questions);
    let questionsTextStringify = JSON.stringify(questionTextArray);
    fs.writeFile(
      'pg-questions.json',
      questionsStringify,
      'utf8',
      function (err) {
        if (err) throw err;
        console.log('complete');
      }
    );

     fs.writeFile(
       'pg-questionsTexts.json',
       questionsTextStringify,
       'utf8',
       function (err) {
         if (err) throw err;
         console.log('complete');
       }
     );
  });
};

main().catch((err) => console.error(err));
