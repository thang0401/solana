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
const spl_token_1 = require("@solana/spl-token");
const sdk_1 = require("@elusiv/sdk");
const boilerplate_1 = require("./boilerplate");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const { elusiv, keyPair, conn } = yield (0, boilerplate_1.getParams)();
        const usdcMint = (0, sdk_1.getMintAccount)('USDC', 'devnet');
        console.log('get or create');
        const ataAcc = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(conn, keyPair, usdcMint, keyPair.publicKey, undefined, 'finalized');
        console.log(`ATA is ${ataAcc.address}`);
        const airdropSig = yield (0, sdk_1.airdropToken)('USDC', web3_js_1.LAMPORTS_PER_SOL, ataAcc.address);
        console.log(`Successfully airdropped USDC with sig ${airdropSig.signature}`);
        let privateBalance = yield elusiv.getLatestPrivateBalance('USDC');
        console.log(`Private balance = ${privateBalance}`);
        if (privateBalance === BigInt(0)) {
            console.log('Topping up');
            const sig = yield topup(elusiv, keyPair, 0.5 * web3_js_1.LAMPORTS_PER_SOL, 'USDC');
            console.log(`Topup complete with sig ${sig.signature}`);
        }
        privateBalance = yield elusiv.getLatestPrivateBalance('USDC');
        if (privateBalance > BigInt(0)) {
            console.log('Sending');
            const sig = yield send(elusiv, keyPair.publicKey, 0.1 * web3_js_1.LAMPORTS_PER_SOL, 'USDC');
            console.log(`Send complete with sig ${sig.signature}`);
        }
        else {
            throw new Error("Can't send from an empty private balance");
        }
    });
}
main().then(() => process.exit(), (err) => {
    throw err;
});
function topup(elusivInstance, keyPair, amount, tokenType) {
    return __awaiter(this, void 0, void 0, function* () {
        const topupTx = yield elusivInstance.buildTopUpTx(amount, tokenType);
        topupTx.tx.partialSign(keyPair);
        return elusivInstance.sendElusivTx(topupTx);
    });
}
function send(elusiv, recipient, amount, tokenType) {
    return __awaiter(this, void 0, void 0, function* () {
        const sendTx = yield elusiv.buildSendTx(amount, recipient, tokenType);
        return elusiv.sendElusivTx(sendTx);
    });
}
