/* -disable no-param-reassign */ //: tắt cảnh báo liên quan đến việc chỉnh sửa tham số không được phép.


import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getParams } from './boilerplate';
// Dòng đầu tiên tắt cảnh báo eslint liên quan đến việc chỉnh sửa tham số không được phép.
//thực hiện giao dịch trên mạng Solana và theo dõi tiến trình giao dịch bằng cách hiển thị 
// biểu tượng hoạt động trên console. Khi giao dịch hoàn thành, thông báo sẽ được in ra màn hình.
async function main() {
    const { elusiv, keyPair } = await getParams();

    const privateBalance = await elusiv.getLatestPrivateBalance('LAMPORTS');

    console.log('Current private balance: ', privateBalance);

    // Can't send without a private balance
    if (privateBalance > BigInt(0)) {
        // Send half a SOL
        const sendTxData = await elusiv.buildSendTx(
            0.5 * LAMPORTS_PER_SOL,
            keyPair.publicKey,
            'LAMPORTS',
        );

        const { elusivTxSig, commitmentInsertionPromise } = await elusiv.sendElusivTxWithTracking(sendTxData);
        // Money has arrived, we can tell user
        const completedMessage = `Send complete with sig ${elusivTxSig.signature}`;
        // Wait for clean up in the background
        const cleanupAnimation = loadingAnimation(
            'Cleaning up...',
            completedMessage,
        );
        await commitmentInsertionPromise;
        clearInterval(cleanupAnimation);
        console.log(
            'Finished clean up, you can send another elusiv transaction now',
        );
    }
    else {
        throw new Error("Can't send from an empty private balance");
    }
}
// : Hàm này tạo một hiệu ứng vòng lặp liên tục trên console để biểu thị tiến trình hoạt động.
function loadingAnimation(loadingText?: string, previousText?: string) {
    const characters = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map(
        (c) => {
            if (previousText) c = `${previousText}\n${c}`;
            if (loadingText) c = `${c} ${loadingText}`;
            return c;
        },
    );
    let i = 0;

    return setInterval(() => {
        i = i > 8 ? 0 : i + 1;
        console.clear();
        console.log(`${characters[i]} ${loadingText}`);
    }, 50);
}

// Run main when invoking this file
main().then(
    () => process.exit(),
    (err) => {
        throw err;
    },
);
