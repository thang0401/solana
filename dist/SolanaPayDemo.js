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
const pay_1 = require("@solana/pay");
const bignumber_js_1 = require("bignumber.js");
const boilerplate_1 = require("./boilerplate");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const { elusiv, conn } = yield (0, boilerplate_1.getParams)();
        const recipient = web3_js_1.Keypair.generate().publicKey;
        const ref = web3_js_1.Keypair.generate().publicKey;
        const memo = encodeURIComponent('My first elusiv tx');
        const amount = new bignumber_js_1.default(0.1);
        console.log(`Creating solana pay transfer request with recipient ${recipient.toBase58()} and reference ${ref.toBase58()} and memo ${memo} and amount ${amount.toString()}...`);
        const req = createRequest(recipient, amount, ref, encodeURIComponent('Monke Store'), encodeURIComponent('Monke shirt'), memo);
        const params = parseRequest(req);
        const privateBalance = yield elusiv.getLatestPrivateBalance('LAMPORTS');
        const sendTx = yield elusiv.buildSendTx(params.amountLamports, params.recipient, 'LAMPORTS', params.reference, params.memo, undefined, true);
        if (Number(privateBalance) - sendTx.getTotalFeeAmount() < params.amountLamports)
            throw new Error('Insufficient private balance');
        console.log('Built private send transaction, sending...');
        elusiv.sendElusivTx(sendTx);
        console.log('Solana pay transfer initiated, using solana pay to await confirmation...');
        if (params.reference) {
            console.log('Awaiting confirmation...');
            const conf = yield awaitSolanaPayConfirmation(params.reference, conn);
            console.log(conf);
        }
    });
}
function createRequest(recipient, amount, reference, label, message, memo) {
    return (0, pay_1.encodeURL)({
        recipient, amount, reference, label, message, memo,
    });
}
function parseRequest(url) {
    const req = (0, pay_1.parseURL)(url);
    const { recipient, amount, reference, memo, } = req;
    if (amount === undefined || (reference !== undefined && reference.length !== 1))
        throw new Error('Invalid transfer request');
    return {
        recipient,
        amountLamports: amount.toNumber() * web3_js_1.LAMPORTS_PER_SOL,
        reference: reference ? reference[0] : undefined,
        memo,
    };
}
function awaitSolanaPayConfirmation(reference, connection) {
    return __awaiter(this, void 0, void 0, function* () {
        let signatureInfo;
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                console.count('Checking for transaction...');
                try {
                    signatureInfo = yield (0, pay_1.findReference)(connection, reference, {
                        finality: 'finalized',
                    });
                    console.log('\n 🖌  Signature found: ', signatureInfo.signature);
                    clearInterval(interval);
                    resolve(signatureInfo);
                }
                catch (error) {
                    if (!(error instanceof pay_1.FindReferenceError)) {
                        console.error(error);
                        clearInterval(interval);
                        reject(error);
                    }
                }
            }), 35000);
        });
    });
}
main().then(() => process.exit(), (err) => {
    throw err;
});
