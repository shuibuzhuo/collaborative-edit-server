const { Server } = require("@hocuspocus/server");
const { basicExts } = require("./exts");
const { TiptapTransformer } = require("@hocuspocus/transformer");
const Y = require("yjs");
const { Logger } = require("@hocuspocus/extension-logger");
const { Database } = require("@hocuspocus/extension-database");
const { Throttle } = require("@hocuspocus/extension-throttle");
const { updateDocJsonStr, updateDocBinary, getDocById } = require("../db/doc");
const { decryptToken } = require("../lib/token");
const { getShareRelationAccess } = require("../db/share-relation");

// on store document
async function onStoreDocument(data) {
  const documentName = data.documentName;
  const json = TiptapTransformer.fromYdoc(data.document, "default");
  const jsonStr = JSON.stringify(json);
  const rowCount = await updateDocJsonStr(documentName, jsonStr);
  console.log("hocuspocus onStoreDocument updated rowCount...", rowCount);
}

// on db fetch doc
async function dbFetch({ documentName }) {
  const res = await getDocById(documentName);
  console.log("fetch db res...", documentName, Object.keys(res));
  if (res == null) return null;
  if (res.contentBinary) return res.contentBinary;
  if (res.content == null) return null;

  try {
    // json to yjs doc
    const bytes = TiptapTransformer.toYdoc(
      JSON.parse(res.content),
      "default",
      basicExts,
    );

    // yjs doc to binary
    const state = Y.encodeStateAsUpdate(bytes);
    return state;
  } catch (error) {
    console.log("hocuspocus transformer toYdoc error...", error);
  }
  return null;
}

// on db store doc
async function dbStore({ documentName, state }) {
  const rowCount = await updateDocBinary(documentName, state);
  console.log("hocuspocus dbStore updated rowCount...", rowCount);
}

async function onAuthenticate(data) {
  const { token, documentName } = data
  if (token == null || !token) throw new Error('token is required');

  const info = decryptToken(token);
  if (info == null) throw new Error('token is invalid or expired');

  const access = await getShareRelationAccess(documentName, info.userId);
  if (access == null) throw new Error('no access to this document');
  if (access === 'READ') {
    data.connection.readOnly = true
  }

  return {
    userId: info.userId,
  }
}

const hocuspocusServer = Server.configure({
  onAuthenticate,
  async onDisconnect(data) {
    console.log('hocuspocus onDisconnect context...', data.context);
  },
  onStoreDocument,
  extensions: [
    new Throttle({
      throttle: 15,
      banTime: 5,
    }),
    new Logger(),
    new Database({
      fetch: dbFetch, // fetch doc content from db
      store: dbStore, /// store doc contentBinary to db
    }),
  ],
});

module.exports = {
  hocuspocusServer,
};
