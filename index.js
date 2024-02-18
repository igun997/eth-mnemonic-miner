const bip39 = require('bip39');
const { hdkey } = require('ethereumjs-wallet');
const fs = require('fs');
const networkFromENV = process.env.WSS_ENDPOINT;
if (!networkFromENV) {
    throw new Error('WSS_ENDPOINT environment variable is required');
}
const ethers = require('ethers')
const provider = new ethers.providers.WebSocketProvider(
    networkFromENV
)


async function generateWallet() {
    const mnemonic = bip39.generateMnemonic();
    console.log(`Mnemonic: ${mnemonic}`);

    const seed = await bip39.mnemonicToSeed(mnemonic);
    const hdWallet = hdkey.fromMasterSeed(seed);
    const walletHdpath = "m/44'/60'/0'/0/";
    const wallet = hdWallet.derivePath(walletHdpath + 0).getWallet();
    const address = `0x${wallet.getAddress().toString('hex')}`;
    const privateKey = wallet.getPrivateKey().toString('hex');

    console.log(`Wallet Address: ${address}`);
    // Note: In a real application, be cautious about logging private keys!

    return { address, privateKey };
}

async function checkBalanceAndSave(address, privateKey) {
    const balance = await provider.getBalance(address)
    const balanceEth = ethers.utils.formatEther(balance)
    console.log('Checking balance for address:', address, 'Balance:', balanceEth, 'ETH');

    if (balance.gt(0)) {
        const data = `Address: ${address}, Private Key: ${privateKey}, Balance: ${balanceEth} ETH\n`;
        fs.appendFileSync('walletsWithBalance.txt', data, 'utf8');
        console.log('Saved wallet (with balance > 0) and private key to txt file.');
    }
}
let sequence = 0;
async function main() {
    const { address, privateKey } = await generateWallet();
    await checkBalanceAndSave(address, privateKey);
    sequence++;
    console.log('Sequence:', sequence);
    setImmediate(main);
}

main();
