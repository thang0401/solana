import { sign } from '@noble/ed25519';
import { Connection, Keypair } from '@solana/web3.js';
import { Elusiv, SEED_MESSAGE } from '@elusiv/sdk';
import {
    CLUSTER, DEVNET_RPC_URL, PRIV_KEY,
} from './constants';

//  tạo và quản lý khóa riêng tư và công khai, kết nối đến mạng Solana

// định nghĩa trong các thông số quan trọng
export async function getParams(): Promise<{
    elusiv: Elusiv;
    keyPair: Keypair;
    conn: Connection;
}> {
    if (PRIV_KEY.length === 0) throw new Error('Need to provide a private key in constants.ts');
    // Connect to devnet
    const conn = new Connection(DEVNET_RPC_URL);

    // Tạo một cặp khóa từ khóa riêng để lấy khóa chung và tùy chọn ký txs
    const keyPair = Keypair.fromSecretKey(PRIV_KEY);

    // Tạo hạt giống đầu vào. Hãy nhớ rằng, điều này gần như quan trọng như khóa riêng tư, vì vậy đừng ghi nhật ký này!
    // (Chúng tôi sử dụng dấu hiệu từ một thư viện bên ngoài ở đây vì không có ví nào được kết nối. Thông thường, bạn sẽ sử dụng bộ điều hợp ví ở đây)
    // (Slice vì trong cặp khóa của Solana gõ 32 byte đầu tiên là privkey và 32 byte cuối cùng là pubkey)
    const seed = await sign(
        Buffer.from(SEED_MESSAGE, 'utf-8'),
        keyPair.secretKey.slice(0, 32),
    );

    // Tạo đối tượng elusiv
    const elusiv = await Elusiv.getElusivInstance(
        seed,
        keyPair.publicKey,
        conn,
        CLUSTER,
    );

    return { elusiv, keyPair, conn };
}
// tạo một cặp khóa mới và hiển thị khóa riêng tư và khóa công khai để sử dụng
export function generatePrivateKey(): Keypair {
    const kp = Keypair.generate();
    console.log('Private key (add this to constants.ts):');
    console.log(kp.secretKey);
    console.log('Public key (airdrop some sol to this):');
    console.log(kp.publicKey.toBase58());

    return kp;
}
