const { pgClient } = require("./client");

async function getShareRelationAccess(docId, userId) {
  try {
    // check if the doc is mine
    const getDocSQL = `select id from "Doc" where id = $1 and "userId" = $2`
    const getDocValues = [docId, userId]
    const getDocResult = await pgClient.query(getDocSQL, getDocValues)
    // console.log('getDocResult...', getDocResult.rowCount)
    if (getDocResult.rowCount > 0) {
      return 'ADMIN'
    }

    // If not mine, check share relation
    const getShareRelationSQL = `select * from "ShareRelation" where "docId" = $1 and "userId" = $2`
    const getShareRelationValues = [docId, userId]
    const getShareRelationResult = await pgClient.query(
      getShareRelationSQL,
      getShareRelationValues
    )
    // console.log('getShareRelationResult...', getShareRelationResult.rows[0])
    return getShareRelationResult.rows[0]?.access || null
  } catch (error) {
    console.error('getShareRelationAccess error...', error);
    return false;
  }
}

async function updateShareRelationNoticeType(docId, userId) {
  const sql = `update "ShareRelation" set "noticeType" = 'UPDATE' where "docId" = $1 and "userId" <> $2`
  const values = [docId, userId]
  try {
    const result = await pgClient.query(sql, values)
  } catch (error) {
    console.error('updateShareRelationNoticeType error...', error);
  }
}

module.exports = {
  getShareRelationAccess,
  updateShareRelationNoticeType,
}
