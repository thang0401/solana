import {
    ConfirmedSignatureInfo,
    Keypair,
    LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { Elusiv, TokenType } from '@elusiv/sdk';
import { getParams } from './boilerplate';
// phép bạn thực hiện giao dịch nạp tiền vào tài khoản Elusiv trên mạng Solana. 
// Lưu ý sử dụng LAMPORTS_PER_SOL để đại diện cho số lượng SOL, vì SOL không phải là token chuẩn và được đo lường bằng lamports mạng Solana.
async function main() {
    // 
    const { elusiv, keyPair } = await getParams();
   
    // Top up with 1 Sol    
    console.log('Initiating topup...');                         // topup : nạp tiền
    const sig = await topup(elusiv, keyPair, LAMPORTS_PER_SOL, 'LAMPORTS'); //LAMPORTS_PER_SOL: Số lượng lamports tương ứng với 1 SOL.
    console.log(`Topup complete with sig ${sig.signature}`);  // 'LAMPORTS': Loại token bạn muốn nạp, trong trường hợp này là lamports
}

async function topup(
    elusivInstance: Elusiv,
    keyPair: Keypair,
    amount: number,
    tokenType: TokenType,
): Promise<ConfirmedSignatureInfo> {
    // Build our topup transaction
    const topupTx = await elusivInstance.buildTopUpTx(amount, tokenType);//Bạn xây dựng giao dịch nạp tiền sử dụng hàm buildTopUpTx từ elusivInstance.
  // Ký tên (chỉ cần thiết cho các lần nạp tiền, vì chúng tôi đang nạp tiền từ khóa công khai của chúng tôi ở đó)
    topupTx.tx.partialSign(keyPair);
    // Send it off
    return elusivInstance.sendElusivTx(topupTx);
}

// Run main when invoking this file
main().then(
    () => process.exit(),
    (err) => {
        throw err;
    },
);
