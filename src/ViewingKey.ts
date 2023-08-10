import { ViewingKey, getSendTxWithViewingKey } from '@elusiv/sdk';
import { getParams } from './boilerplate';
import { CLUSTER } from './constants';
//  truy vấn thông tin về giao dịch riêng tư trên mạng Solana và hiển thị kết quả trên console.
async function main() {
    // Helper function for generating the elusiv instance
    // THIS IS NOT PART OF THE SDK, check boilerplate.ts to see what exactly it does.
    const { elusiv, conn, keyPair } = await getParams();

    // Fetch our last 5 private transactions using SOL
    const last5PrivTxs = await elusiv.getPrivateTransactions(0.02, 'LAMPORTS');
   
    // Get our latest send tx if it exists
        //để tạo khóa xem từ giao dịch gửi gần đây nhất.
    const lastSendTx = last5PrivTxs.find((tx) => tx.txType === 'SEND');
    if (lastSendTx === undefined) {
        throw new Error('Could not find a send tx to generate a viewing key for!');
    }

    console.log(
        `Generating a viewing key for (original owner is ${keyPair.publicKey.toBase58()}):`,
    );


     
    console.log(lastSendTx);
    const viewingKey = elusiv.getViewingKey(lastSendTx);
    console.log(`Generated viewing key: ${viewingKeyToString(viewingKey)}`);

    // *Pass the generated viewing key to someone else
    // who DOES NOT know our seed or have access to our elusiv instance*

    // Decrypt & display the provided transaction
   // từ SDK Elusiv để giải mã và hiển thị nội dung của giao dịch sử dụng khóa xem.
    const decryptedTx = await getSendTxWithViewingKey(conn, CLUSTER, viewingKey);

    console.log(
        `Parsed owner ${decryptedTx.owner.toBase58()} from following tx with viewing key:`,
    );
    console.log(decryptedTx.sendTx);
}
//  Hàm này chuyển đổi khóa xem sang chuỗi để hiển thị thông tin của khóa xem.
function viewingKeyToString(v: ViewingKey): string {
    return `Version: ${v.version}\nId Key: ${v.idKey}\nDecryption Key: ${v.decryptionKey}`;
}

// Run main when invoking this file
main().then(
    () => process.exit(),
    (err) => {
        throw err;
    },
);
