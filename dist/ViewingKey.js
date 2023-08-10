"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@elusiv/sdk");
const boilerplate_1 = require("./boilerplate");
const constants_1 = require("./constants");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const { elusiv, conn, keyPair } = yield (0, boilerplate_1.getParams)();
        const last5PrivTxs = yield elusiv.getPrivateTransactions(0.02, 'LAMPORTS');
        const lastSendTx = last5PrivTxs.find((tx) => tx.txType === 'SEND');
        if (lastSendTx === undefined) {
            throw new Error('Could not find a send tx to generate a viewing key for!');
        }
        console.log(`Generating a viewing key for (original owner is ${keyPair.publicKey.toBase58()}):`);
        console.log(lastSendTx);
        const viewingKey = elusiv.getViewingKey(lastSendTx);
        console.log(`Generated viewing key: ${viewingKeyToString(viewingKey)}`);
        const decryptedTx = yield (0, sdk_1.getSendTxWithViewingKey)(conn, constants_1.CLUSTER, viewingKey);
        console.log(`Parsed owner ${decryptedTx.owner.toBase58()} from following tx with viewing key:`);
        console.log(decryptedTx.sendTx);
    });
}
function viewingKeyToString(v) {
    return `Version: ${v.version}\nId Key: ${v.idKey}\nDecryption Key: ${v.decryptionKey}`;
}
main().then(() => process.exit(), (err) => {
    throw err;
});
