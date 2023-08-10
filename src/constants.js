"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRIV_KEY = exports.CLUSTER = exports.DEVNET_RPC_URL = void 0;
// Nút RPC là một dịch vụ cung cấp giao diện chương trình để truy vấn thông tin từ mạng blockchain.
exports.DEVNET_RPC_URL = 'https://api.devnet.solana.com';
// use devnet to run
exports.CLUSTER = 'devnet';
/**
 * ONLY FOR SAMPLES NEVER EVER STORE YOUR/ANYONE'S PRIVATE KEY IN PLAIN TEXT
 * TODO: Insert your private key here
 */
// export private key and warnning // xuất ra khoa riêng tư và cảnh báo lộ khóa riêng tư
// Chèn khóa riêng của bạn vào đây
exports.PRIV_KEY = new Uint8Array([64, 242, 167,  57,  69, 204, 200, 190, 146, 228, 112,
    119,  54,  60,  52, 186, 127,  93,  15,  55, 249, 195,
     40,  96,  66,  29,   3, 144, 177,  56, 195, 117,  14,
      2, 140, 198,  97, 104, 248, 116, 147, 167,   6,  69,
    233, 105, 116,  64, 253, 212, 128, 148,  65, 216, 142,
     17, 106,  98, 160, 126, 187, 115, 115,  74]);
