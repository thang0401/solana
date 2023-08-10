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
        const privateBalance = yield elusiv.getLatestPrivateBalance('LAMPORTS');
        console.log('Current private balance: ', privateBalance);
        if (privateBalance > BigInt(0)) {
            const sendTxData = yield elusiv.buildSendTx(0.5 * web3_js_1.LAMPORTS_PER_SOL, keyPair.publicKey, 'LAMPORTS');
            const { elusivTxSig, commitmentInsertionPromise } = yield elusiv.sendElusivTxWithTracking(sendTxData);
            const completedMessage = `Send complete with sig ${elusivTxSig.signature}`;
            const cleanupAnimation = loadingAnimation('Cleaning up...', completedMessage);
            yield commitmentInsertionPromise;
            clearInterval(cleanupAnimation);
            console.log('Finished clean up, you can send another elusiv transaction now');
        }
        else {
            throw new Error("Can't send from an empty private balance");
        }
    });
}
function loadingAnimation(loadingText, previousText) {
    const characters = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map((c) => {
        if (previousText)
            c = `${previousText}\n${c}`;
        if (loadingText)
            c = `${c} ${loadingText}`;
        return c;
    });
    let i = 0;
    return setInterval(() => {
        i = i > 8 ? 0 : i + 1;
        console.clear();
        console.log(`${characters[i]} ${loadingText}`);
    }, 50);
}
main().then(() => process.exit(), (err) => {
    throw err;
});
