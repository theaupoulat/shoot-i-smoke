// Sh**t! I Smoke
// Copyright (C) 2018-2019  Marcelo S. Coelho, Amaury Martiny

// Sh**t! I Smoke is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Sh**t! I Smoke is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Sh**t! I Smoke.  If not, see <http://www.gnu.org/licenses/>.

import { SQLite } from 'expo';

const DB_AQI_HISTORY = 'DB_AQI_HISTORY';
export const SAVE_DATA_INTERVAL = 3600000; // 1 hour

const initDb = () => {
  return SQLite.openDatabase(DB_AQI_HISTORY, '1.0', 'Aqi History', 5 * 1024 * 1024);
};

// Holds a singleton db object
let db;

const init = async () => {
  if (db) {
    return db;
  }

  db = await initDb();

  await db.transaction(
    (tx) => {
      console.log('AqiHistoryManager - init() - Creating table "history"');
      tx.executeSql(
        `create table if not exists history (
        id integer primary key not null,
        latitude real not null,
        longitude real not null,
        raw_pm25 real not null,
        creation_time datetime not null
      )`
      );
    },
    (error) => console.log('AqiHistoryManager - init() - Error:', error.message)
  );

  return db;
};

/**
 * We only want to save an entry every {@link SAVE_DATA_INTERVAL} milliseconds,
 * so this function checks if the last entry is > {@link SAVE_DATA_INTERVAL}
 * old.
 */
export const isSaveNeeded = async () => {
  const db = await init();

  return new Promise((resolve, reject) => {
    db.readTransaction(
      (tx) => {
        console.log('AqiHistoryManager - isSaveNeeded() - Querying last entry in db');
        tx.executeSql(
          'select * from history order by id desc limit 1',
          [],
          (_transaction, resultSet) => {
            console.log('AqiHistoryManager - isSaveNeeded() - Last entry:', resultSet.rows.item(0));
            if (resultSet.rows.length === 0) {
              console.log('AqiHistoryManager - isSaveNeeded() - No entries, needs saving: true');
              resolve(true);
            } else if ((resultSet.rows.item(0).creation_time + SAVE_DATA_INTERVAL) < Date.now()) {
              console.log('AqiHistoryManager - isSaveNeeded() - Old latest entriy, needs saving: true');
              resolve(true);
            } else {
              console.log('AqiHistoryManager - isSaveNeeded() - needs saving: false');
              resolve(false);
            }
          }
        );
      },
      (error) => {
        console.log('AqiHistoryManager - saveData() - Error:', error.message);
        reject(error);
      }
    );
  });
};

export const saveData = async (location, rawPm25) => {
  const db = await init();

  return new Promise((resolve, reject) => db.transaction(
    (tx) => {
      console.log('AqiHistoryManager - saveData() - Adding new entry in db', [location.latitude, location.longitude, rawPm25, Date.now()]);
      tx.executeSql(
        'insert into history (latitude, longitude, raw_pm25, creation_time) values (?, ?, ?, ?)',
        [location.latitude, location.longitude, rawPm25, Date.now()]
      );
    },
    (error) => {
      console.log('AqiHistoryManager - saveData() - Error:', error.message);
      reject(error);
    },
    () => {
      console.log('AqiHistoryManager - saveData() - Successfully added new entry');
      resolve();
    }
  ));
};

export const getData = async (limit) => {
  const db = await init();

  return new Promise((resolve, reject) => {
    db.readTransaction((tx) => {
      tx.executeSql(
        'select * from history order by creation_time desc limit ' + limit,
        [],
        (_transaction, resultSet) => {
          let data = [];

          for (let i = 0; i < resultSet.rows.length; i++) {
            data.push(resultSet.rows.item(i));
          }

          resolve(data);
        },
        (transaction, error) => reject(error)
      );
    });
  });
};
