import {
    ConfirmedSignatureInfo,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
} from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import {
    airdropToken, Elusiv, getMintAccount, TokenType,
} from '@elusiv/sdk';
import { getParams } from './boilerplate';

// hàm dùng để airdrop (nạp tiền) và gửi token trên mạng Solana. 
async function main() {
    // Helper function for generating the elusiv instance
    // THIS IS NOT PART OF THE SDK, check boilerplate.ts to see what exactly it does.
    const { elusiv, keyPair, conn } = await getParams();

    // Airdrop ourselves some "USDC" to our devnet USDC associated token account
    const usdcMint = getMintAccount('USDC', 'devnet'); // tạo tài khoản và liên kết tài khoản cho 1 mint 
    console.log('get or create');
    //  tạo hoặc lấy tài khoản ví token liên kết (associated token account) cho tài khoản Elusiv hiện tại.
    const ataAcc = await getOrCreateAssociatedTokenAccount(
        conn,
        keyPair,
        usdcMint,          //  Mint là nơi phát hành token.
        keyPair.publicKey,
        undefined, // 
        'finalized',
    );
    console.log(`ATA is ${ataAcc.address}`);
    // Important to remember, USDC is actually measured in 1_000_000, so that means we're airdropping 1 billion USDC here,
    // but that's only $1000.
    //nạp tiền vào tài khoản
    const airdropSig = await airdropToken(
        'USDC',   // Tham số đầu tiên là tên của loại token cần nạp tiền ở đây là USDC
        LAMPORTS_PER_SOL, // Tham số thứ hai là số lượng lamports (đơn vị tiền tệ của Solana) cần nạp vào tài khoản.
        ataAcc.address, // Tham số thứ ba là địa chỉ của tài khoản ví token liên kết (ATA) mà bạn muốn nạp tiền vào.
    );
    console.log(`Successfully airdropped USDC with sig ${airdropSig.signature}`); // :thông tin chữ ký của giao dịch airdrop

    // Fetch our current private balance
    // lấy số dư hiênj tại tài khoản riêng
    let privateBalance = await elusiv.getLatestPrivateBalance('USDC');
    console.log(`Private balance = ${privateBalance}`);

  // Chúng tôi không có số dư riêng tư? Nạp tiền! (Tất nhiên, chúng tôi cũng có thể nạp tiền nếu chúng tôi đã có số dư riêng)
    if (privateBalance === BigInt(0)) {
        // Top up with 500 Million USDC
        console.log('Topping up');
        const sig = await topup(elusiv, keyPair, 0.5 * LAMPORTS_PER_SOL, 'USDC');
        console.log(`Topup complete with sig ${sig.signature}`);
    }

    // Let's send some usdc!
    privateBalance = await elusiv.getLatestPrivateBalance('USDC');

    // Can't send without a private balance
    // Nếu số dư là 0, thực hiện nạp tiền (topup) vào tài khoản.
    if (privateBalance > BigInt(0)) {
        // Send 100 million USDC. Important to note: When sending with elusiv, we provide the owner NOT the token account.
        console.log('Sending');
        const sig = await send(
            elusiv,
            keyPair.publicKey,
            0.1 * LAMPORTS_PER_SOL,
            'USDC',
        );
        console.log(`Send complete with sig ${sig.signature}`);
    }
    else {
        throw new Error("Can't send from an empty private balance");
    }
}

// Run main when invoking this file
main().then(
    () => process.exit(),
    (err) => {
        throw err;
    },
);
// thực hiện giao dịch nạp tiền vào tài khoản Elusiv 
async function topup(
    elusivInstance: Elusiv,
    keyPair: Keypair,
    amount: number,
    tokenType: TokenType,
): Promise<ConfirmedSignatureInfo> {
    // Build our topup transaction
    const topupTx = await elusivInstance.buildTopUpTx(amount, tokenType);
    // Sign it (only needed for topups, as we're topping up from our public key there)
    topupTx.tx.partialSign(keyPair);
    // Send it off
    return elusivInstance.sendElusivTx(topupTx);
}

async function send(
    elusiv: Elusiv,
    recipient: PublicKey,
    amount: number,
    tokenType: TokenType,
): Promise<ConfirmedSignatureInfo> {
    // Build the send transaction
    const sendTx = await elusiv.buildSendTx(amount, recipient, tokenType);
    // Send it off!
    return elusiv.sendElusivTx(sendTx);
}
