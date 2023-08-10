import { Connection, Keypair } from '@solana/web3.js';
import { Elusiv } from '@elusiv/sdk';
export declare function getParams(): Promise<{
    elusiv: Elusiv;
    keyPair: Keypair;
    conn: Connection;
}>;
export declare function generatePrivateKey(): Keypair;
