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
        const { elusiv, conn } = yield (0, boilerplate_1.getParams)();
        const privateBalance = yield elusiv.getLatestPrivateBalance('LAMPORTS');
        console.log(`Current private balance: ${privateBalance}`);
        const rvk = elusiv.getRootViewingKey();
        console.log(`Generated viewing key: ${rvk}`);
        const viewer = yield sdk_1.ElusivViewer.getElusivViewerInstance(rvk, conn, constants_1.CLUSTER);
        const viewerBalance = yield viewer.getLatestPrivateBalance('LAMPORTS');
        console.log(`Current private balance (with ElusivViewer): ${viewerBalance}`);
        const last5PrivTxs = yield elusiv.getPrivateTransactions(5);
        console.log('Our last 5 private transactions:\n');
        console.log(last5PrivTxs);
        const last5PrivTxsWithViewer = yield viewer.getPrivateTransactions(5);
        console.log('Our last 5 private transactions (with ElusivViewer):\n');
        console.log(last5PrivTxsWithViewer);
        const last5SolPrivTxs = yield elusiv.getPrivateTransactions(5, 'LAMPORTS');
        console.log('Our last 5 private SOL transactions:\n');
        console.log(last5SolPrivTxs);
        const last5SolPrivTxsWithViewer = yield viewer.getPrivateTransactions(5, 'LAMPORTS');
        console.log('Our last 5 private SOL transactions (with ElusivViewer):\n');
        console.log(last5SolPrivTxsWithViewer);
    });
}
main().then(() => process.exit(), (err) => {
    throw err;
});
