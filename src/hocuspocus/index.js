const { Server } = require("@hocuspocus/server");
const { basicExts } = require("./exts");
const { TiptapTransformer } = require("@hocuspocus/transformer");
const Y = require("yjs");
const { Logger } = require("@hocuspocus/extension-logger");
const { Database } = require("@hocuspocus/extension-database");
const { updateDocJsonStr, updateDocBinary, getDocById } = require("../db/doc");

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
      basicExts
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

const hocuspocusServer = Server.configure({
  onStoreDocument,
  extensions: [
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
