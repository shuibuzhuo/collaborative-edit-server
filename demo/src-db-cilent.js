const { connect } = require("../src/db/client");
const { getDocById } = require("../src/db/doc");

async function main() {
  await connect();
  console.log("src-db-client demo...");
  const res = await getDocById("036c9d68-58c4-41df-991d-f1b2dfaf79a7");
  console.log("res:", res);
}

main();
