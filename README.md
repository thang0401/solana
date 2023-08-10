# elusiv-samples

Repo showing sample usage of the compiled Elusiv SDK. More fine-grained info can be found in the [sdk docs](https://elusiv-privacy.github.io/elusiv-sdk/).

## Setup

1. Generate a private key (don't use a real one) and copy paste it into [`src/contants.ts`](https://github.com/elusiv-privacy/elusiv-samples/blob/main/src/constants.ts). Fund it with some devnet SOL if you want to try out the topup and sending.

(In case you don't know how to generate/format the private key, there's a helper in [`src/boilerplate.ts`](https://github.com/elusiv-privacy/elusiv-samples/blob/main/src/boilerplate.ts) you can call)

## Usage

Call the sample you want to execute using:

`npm run <sample name>`

Currently available samples: `topup`, `send`, `tx-fetching`, `solana-pay`, `spl`, `traceable-tx`, `viewing-key`,`root-viewing-key`. (This README might get out of date at some point, so the topmost authority of what samples exist is still the code in `src`)
