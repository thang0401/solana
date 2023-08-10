import {
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    ConfirmedSignatureInfo,
    Keypair,
} from '@solana/web3.js';
import {
    encodeURL,
    parseURL,
    TransferRequestURL,
    findReference,
    FindReferenceError,
} from '@solana/pay';
import BigNumber from 'bignumber.js';
import { getParams } from './boilerplate';

// tạo một yêu cầu chuyển tiền bằng cách sử dụng các thông số như người nhận, giá trị, tham chiếu, nhãn, thông điệp và ghi chú.
async function main() {
    const { elusiv, conn } = await getParams();
    // Generate the values for the solana pay request
    const recipient = Keypair.generate().publicKey;
    const ref = Keypair.generate().publicKey;
    //memo là nội dung dùng để ghi chú cho giao dịch.
    const memo = encodeURIComponent('My first elusiv tx');
    const amount = new BigNumber(0.1);

    // in ra nội dụng chuyển khoản
    console.log(
        `Creating solana pay transfer request with recipient ${recipient.toBase58()} and reference ${ref.toBase58()} and memo ${memo} and amount ${amount.toString()}...`,
    );
    // tạo yêu cầu chuyển tiền.
    const req = createRequest(
        recipient, //Đây là địa chỉ công khai (public key) của người nhận tiền.
        amount, // Đây là số lượng tiền cần chuyển, được đại diện bởi một đối tượn
        ref, // Đây là địa chỉ công khai (public key) của tham chiếu, một đối tượng Keypair.
        encodeURIComponent('Monke Store'), // Đây là nhãn (label) của yêu cầu chuyển tiền, được mã hóa để đảm bảo tính hợp lệ trong URL.
        encodeURIComponent('Monke shirt'), // Đây là thông điệp (message) của yêu cầu chuyển tiền, cũng được mã hóa để đảm bảo tính hợp lệ trong URL.
        memo, // Đây là nội dung dùng để ghi chú cho giao dịch, không cần mã hóa.  undefined nếu không có ghi chú.
    );

    
    // req : URL của yêu cầu chuyển tiền.
    //parseRequest để phân tích yêu cầu chuyển tiền từ URL và trích xuất 
    // các thông tin cần thiết. Kết quả của quá trình này sẽ được lưu trữ trong biến params.
    const params = parseRequest(req);

    // Fetch our current private balance to check if we have enough money to pay for the item
    // để kiểm tra có đủ tiền để thực hiện thanh toán hay không.
    const privateBalance = await elusiv.getLatestPrivateBalance('LAMPORTS');

    // Build the send transaction
    const sendTx = await elusiv.buildSendTx(
        params.amountLamports,
        params.recipient,
        'LAMPORTS',
        params.reference,
        params.memo,
        undefined,
        true,
    );
    if (
        Number(privateBalance) - sendTx.getTotalFeeAmount() < params.amountLamports
    ) throw new Error('Insufficient private balance');
                    // Insufficient : không đủ

    console.log('Built private send transaction, sending...');

    // Enough money? Send it off: Gửi đi!           
    elusiv.sendElusivTx(sendTx);
    console.log(
        'Solana pay transfer initiated, using solana pay to await confirmation...',
    );

    //  Kiểm tra xem tham chiếu của yêu cầu có tồn tại hay không. 
    if (params.reference) {
        console.log('Awaiting confirmation...');
        const conf = await awaitSolanaPayConfirmation(params.reference, conn);
            // hàm awaitSolanaPayConfirmation để chờ xác nhận giao dịch bằng cách truyền vào tham chiếu của yêu cầu và kết nối Solana
                            //Biến conf sẽ chứa thông tin về chữ ký xác nhận 
        console.log(conf);
    }
}

// Wrapper for creating a solana pay request
// :createRequest : tạo yêu cầu chuyển khoản Kết quả là một đối tượng URL chứa thông tin yêu cầu đã được mã hóa.
function createRequest(
    recipient: PublicKey,
    amount: BigNumber,
    reference: PublicKey,
    label: string,
    message: string,
    memo: string,
): URL {
    return encodeURL({
        recipient, amount, reference, label, message, memo,
    });
}
// dùng để phân tích URL và yêu cầu và trích xuất các thông tin cần thiết cho giao dịch.
function parseRequest(url: URL): {
    recipient: PublicKey;
    amountLamports: number;
    reference: PublicKey | undefined;
    memo: string | undefined;
} 

// trả về một đối tượng chứa các thông tin cần thiết để thực hiện giao dịch
    {
    const req = parseURL(url) as TransferRequestURL;
    const {
        recipient, amount, reference, memo,
    } = req;

    // Limitations: Elusiv currently only supports one reference key & only lamports (undefined spltoken means sol)

    if (
        amount === undefined || (reference !== undefined && reference.length !== 1)
    ) throw new Error('Invalid transfer request');

    // Convert from sol to lamports
    return {
        recipient,
        amountLamports: amount.toNumber() * LAMPORTS_PER_SOL,
        reference: reference ? reference[0] : undefined,
        memo,
    };
}
// : Hàm này sử dụng Solana Pay để chờ xác nhận giao dịch.
async function awaitSolanaPayConfirmation(
    reference: PublicKey,
    connection: Connection, 
): Promise<ConfirmedSignatureInfo> {
    // Adapted from https://github.com/solana-labs/solana-pay/blob/master/core/example/payment-flow-merchant/main.ts#L61
    let signatureInfo: ConfirmedSignatureInfo;

    return new Promise((resolve, reject) => {  //   bạn tạo một Promise mới để theo dõi quá trình xác nhận giao dịc
      
        /**
         * Thử lại cho đến khi chúng tôi tìm thấy giao dịch
         *
         * Nếu không thể tìm thấy giao dịch với tham chiếu đã cho, `findTransactionSignature`
         * sẽ báo lỗi. Có một số lý do tại sao điều này có thể là âm tính giả:
         *
         * - Giao dịch chưa được xác nhận/hoàn tất
         * - Khách hàng chưa phê duyệt/hoàn tất giao dịch
         *
         * Bạn có thể triển khai chiến lược bỏ phiếu để truy vấn giao dịch theo định kỳ.
         */
        // dùng hàm tạo thời gian lặp theo khoảng thời gian nhất định
        
        const interval = setInterval(async () => { // để lặp lại một đoạn mã một lượng thời gian nhất định.
            console.count('Checking for transaction...');
            try {
                signatureInfo = await findReference(connection, reference, {
                    finality: 'finalized', //'finalized' được truyền vào giao dịch đã được xác nhận (finalized).
                });
                console.log('\n 🖌  Signature found: ', signatureInfo.signature); //Dòng này in ra màn hình thông tin về  chữ ký của giao dịch đã tìm thấy
                clearInterval(interval);                                    //  Chữ ký này có thể được sử dụng để xác định giao dịch cụ thể trong mạng Solana
                resolve(signatureInfo); // resolve : chấm dứt Promise và trả về thông tin về giao dịch đã tìm thấy và xác nhận
            }
            catch (error: unknown) {
                if (!(error instanceof FindReferenceError)) {
                    console.error(error);
                    clearInterval(interval);
                    reject(error);
                }
            }
        }, 35000);
    });
}

// Run main when invoking this file
// out program if error
main().then(
    () => process.exit(),
    (err) => {
        throw err;
    },
);
