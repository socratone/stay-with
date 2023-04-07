/* eslint-disable no-console */
import * as dotenv from 'dotenv';
import inquirer from 'inquirer';

import { CollectionName } from '../constants/mongodb';
import { LexioDivina, User } from '../types/document';
import Mongodb from '../utils/mongodb';

dotenv.config({ path: './.env.development' });

const devUrl = process.env.MONGO_CLIENT_URL;

(async () => {
  const confirmResult = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message:
        'Dev Database에 덮어씌우는 작업을 진행합니다. 계속 하시겠습니까?',
    },
  ]);

  if (!confirmResult.confirm) {
    console.log('❌ 작업이 취소되었습니다.');
    return;
  }

  const urlResult = await inquirer.prompt([
    {
      type: 'input',
      name: 'url',
      message: '복제할 Mongodb Client URL을 넣어주세요.',
    },
  ]);

  try {
    const db = new Mongodb(urlResult.url);
    const users = await db.find<User[]>(CollectionName.Users);
    const lexioDivinas = await db.find<LexioDivina[]>(
      CollectionName.LexioDivinas
    );
    await db.close();

    // 👿 반드시 devUrl이어야 한다.
    const devDb = new Mongodb(devUrl);

    // 비어 있지 않다면 삭제
    const devUsers = await devDb.find<User[]>(CollectionName.Users);
    if (devUsers.length > 0) {
      await devDb.drop(CollectionName.Users);
    }

    // 비어 있지 않다면 삭제
    const devLexioDivinas = await devDb.find<LexioDivina[]>(
      CollectionName.LexioDivinas
    );
    if (devLexioDivinas.length > 0) {
      await devDb.drop(CollectionName.LexioDivinas);
    }

    await devDb.insertMany(CollectionName.Users, users);
    await devDb.insertMany(CollectionName.LexioDivinas, lexioDivinas);

    await devDb.close();
  } catch (error) {
    console.log('😱 에러가 발생했어요.');
    console.error(error);
    return;
  }

  console.log('😆 작업이 완료되었습니다.');
})();
