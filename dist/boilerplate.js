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
exports.generatePrivateKey = exports.getParams = void 0;
const ed25519_1 = require("@noble/ed25519");
const web3_js_1 = require("@solana/web3.js");
const sdk_1 = require("@elusiv/sdk");
const constants_1 = require("./constants");
function getParams() {
    return __awaiter(this, void 0, void 0, function* () {
        if (constants_1.PRIV_KEY.length === 0)
            throw new Error('Need to provide a private key in constants.ts');
        const conn = new web3_js_1.Connection(constants_1.DEVNET_RPC_URL);
        const keyPair = web3_js_1.Keypair.fromSecretKey(constants_1.PRIV_KEY);
        const seed = yield (0, ed25519_1.sign)(Buffer.from(sdk_1.SEED_MESSAGE, 'utf-8'), keyPair.secretKey.slice(0, 32));
        const elusiv = yield sdk_1.Elusiv.getElusivInstance(seed, keyPair.publicKey, conn, constants_1.CLUSTER);
        return { elusiv, keyPair, conn };
    });
}
exports.getParams = getParams;
function generatePrivateKey() {
    const kp = web3_js_1.Keypair.generate();
    console.log('Private key (add this to constants.ts):');
    console.log(kp.secretKey);
    console.log('Public key (airdrop some sol to this):');
    console.log(kp.publicKey.toBase58());
    return kp;
}
exports.generatePrivateKey = generatePrivateKey;
