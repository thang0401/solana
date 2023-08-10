import {
    ConfirmedSignatureInfo,
    LAMPORTS_PER_SOL,
    PublicKey,
} from '@solana/web3.js';
import { Elusiv, TokenType } from '@elusiv/sdk';
import { getParams } from './boilerplate';

//  Nó thực hiện các bước để gửi số tiền trên mạng Solana.
async function main() {
    // Helper function for generating the elusiv instance
    // THIS IS NOT PART OF THE SDK, check boilerplate.ts to see what exactly it does.
    const { elusiv, keyPair } = await getParams();

    // Fetch our current private balance
    // 10^9 LAMPORTS = 1 solana 
    const privateBalance = await elusiv.getLatestPrivateBalance('LAMPORTS');

    console.log('Current private balance: ', privateBalance);

    // check tài khoản còn tiền để gửi không
    if (privateBalance > BigInt(0)) {
        // Send half a SOL
        const sig = await send(
            elusiv,
            keyPair.publicKey,
            0.5 * LAMPORTS_PER_SOL,
            'LAMPORTS',
        );
        console.log(`Send complete with sig ${sig.signature}`);
    }
    else {
        throw new Error("Can't send from an empty private balance");
    }
}
// hàm hiện thông tin gửi như  recipient: người nhận, amount: số lượng , tokenType: loại tiền
async function send(
    elusiv: Elusiv,
    recipient: PublicKey,
    amount: number,
    tokenType: TokenType,
): Promise<ConfirmedSignatureInfo> {
    // Build the send transaction
    const sendTx = await elusiv.buildSendTx(amount, recipient, tokenType);
    // Send it off!
    // elusiv.buildSendTx :để xây dựng giao dịch gửi số tiền 
    // với thông tin được cung cấp và ể thực hiện gửi giao dịch và trả về thông tin về chữ ký xác nhận giao dịch
    return elusiv.sendElusivTx(sendTx);
}

// Run main when invoking this file
main().then(
    () => process.exit(),
    (err) => {
        throw err;
    },
);
