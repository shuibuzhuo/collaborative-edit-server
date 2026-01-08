const { pgClient } = require("./client");
const { sendEmail } = require("../lib/mailer");

/**
 * update doc json content
 * @param {string} id doc id
 * @param {string} jsonStr json string
 */
async function updateDocJsonStr(id, jsonStr) {
  try {
    const sql = `update "Doc" set content = $1, "updatedAt" = $2 where id = $3`;
    const values = [jsonStr, new Date(), id];
    const res = await pgClient.query(sql, values);
    return res.rowCount;
  } catch (error) {
    console.error("hocuspocus db updateDocJsonStr error...", error);
    sendEmail({
      subject: "hocuspocus db updateDocJsonStr error",
      text: error.message || "error",
    });
    return 0;
  }
}

/**
 * update doc binary content
 * @param {string} id doc id
 * @param {binary} binary doc binary content
 */
async function updateDocBinary(id, binary) {
  try {
    const sql = `update "Doc" set "contentBinary"=$1 where id=$2`;
    const values = [binary, id];
    const res = await pgClient.query(sql, values);
    return res.rowCount;
  } catch (error) {
    console.error("hocuspocus db updateDocBinary error...", error);
    sendEmail({
      subject: "hocuspocus db updateDocBinary error",
      text: error.message || "error",
    });
    return 0;
  }
}

async function getDocById(id) {
  try {
    const sql = `select content, "contentBinary" from "Doc" where id='${id}'`;
    const res = await pgClient.query(sql);
    return res.rows[0];
  } catch (error) {
    console.error("hocuspocus db getDocById error...", error);
    sendEmail({
      subject: "hocuspocus db getDocById error",
      text: error.message || "error",
    });
    return null;
  }
}

module.exports = {
  updateDocJsonStr,
  updateDocBinary,
  getDocById,
};
