const pg = require("pg");
require("dotenv").config();

const { Client } = pg;
const url = process.env.DATABASE_URL;

async function main() {
  const client = new Client(url);

  client.on("error", (err) => {
    console.error("pg connect db error", err.stack);
  });

  await client.connect();
  console.log("pg connected to db successfully");

  // const sql = `SELECT table_name FROM information_schema.tables WHERE table_schema='public'`;
  // const result = await client.query(sql);
  // console.log(result.rows);

  // const sql = `select id, title, "contentBinary" from "Doc" where id='036c9d68-58c4-41df-991d-f1b2dfaf79a7'`;
  // const result = await client.query(sql);
  // console.log(result.rows);

  // const sql = `select id, title, "contentBinary" from "Doc" where id=$1`;
  // const values = ["036c9d68-58c4-41df-991d-f1b2dfaf79a7"];
  // const result = await client.query(sql, values);
  // console.log(result.rows);

  // const sql = `update "Doc" set title = '最简单的文档-updated' where id='036c9d68-58c4-41df-991d-f1b2dfaf79a7'`;
  // const result = await client.query(sql);
  // console.log("update result:", result);

  // const sql = `update "Doc" set title = $1 where id = $2`;
  // const params = [
  //   "最简单的文档-updated-again",
  //   "036c9d68-58c4-41df-991d-f1b2dfaf79a7",
  // ];
  // const result = await client.query(sql, params);
  // console.log("update result:", result);
}

main();
