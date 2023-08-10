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
const web3_js_1 = require("@solana/web3.js");
const boilerplate_1 = require("./boilerplate");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const { elusiv, keyPair } = yield (0, boilerplate_1.getParams)();
        console.log('Initiating topup...');
        const sig = yield topup(elusiv, keyPair, web3_js_1.LAMPORTS_PER_SOL, 'LAMPORTS');
        console.log(`Topup complete with sig ${sig.signature}`);
    });
}
function topup(elusivInstance, keyPair, amount, tokenType) {
    return __awaiter(this, void 0, void 0, function* () {
        const topupTx = yield elusivInstance.buildTopUpTx(amount, tokenType);
        topupTx.tx.partialSign(keyPair);
        return elusivInstance.sendElusivTx(topupTx);
    });
}
main().then(() => process.exit(), (err) => {
    throw err;
});
