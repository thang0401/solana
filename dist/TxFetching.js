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
const boilerplate_1 = require("./boilerplate");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const { elusiv } = yield (0, boilerplate_1.getParams)();
        const mostRecentPrivTx = yield elusiv.getPrivateTransactions(1);
        console.log('Our most recent private transaction:\n');
        console.log(mostRecentPrivTx);
        const last5PrivTxs = yield elusiv.getPrivateTransactions(5, 'LAMPORTS');
        console.log('Our last 5 private transactions:\n');
        console.log(last5PrivTxs);
    });
}
main().then(() => process.exit(), (err) => {
    throw err;
});
