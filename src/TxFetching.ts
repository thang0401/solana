import { getParams } from './boilerplate';
//  sử dụng Elusiv SDK để truy vấn thông tin về giao dịch riêng tư trên mạng Solana và hiển thị kết quả trên console.
async function main() {
   
    const { elusiv } = await getParams();

    // Fetch our most recent private transactions of any token type
    // để lấy thông tin về giao dịch riêng tư gần đây nhất, bất kể loại token nào.
    const mostRecentPrivTx = await elusiv.getPrivateTransactions(1);

    console.log('Our most recent private transaction:\n');
    console.log(mostRecentPrivTx);

    // Fetch our last 5 private transactions using Sol (if we only have 1 it will only return 1 of course)
    const last5PrivTxs = await elusiv.getPrivateTransactions(5, 'LAMPORTS');

    console.log('Our last 5 private transactions:\n');
    console.log(last5PrivTxs);
}

// Run main when invoking this file
main().then(
    () => process.exit(),
    (err) => {
        throw err;
    },
);
