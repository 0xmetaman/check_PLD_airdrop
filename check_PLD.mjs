import fetch from 'node-fetch';
import fs from 'fs/promises';

async function get_token_amount(address) {
    const url = `https://www.pilotdog.tech/api/get_eligible?address=${address}`;

    const response = await fetch(url);
    const data = await response.json();
    return data.data.claimable_amount || "0";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function batch_query(addresses) {
    let totalAmount = 0;  // 用于累计所有代币的数量
    let serialNumber = 1;  // 序列号

    for (let address of addresses) {
        const amount = await get_token_amount(address);
        totalAmount += parseInt(amount);  // 累加代币数量
        const formattedAmount = parseInt(amount).toLocaleString();
        console.log(`#${serialNumber} Address: ${address}, Amount: ${formattedAmount}`);
        serialNumber++;  // 递增序列号
        await sleep(5000);  // 延迟5秒
    }

    console.log(`\nTotal Amount PLD Token: ${totalAmount.toLocaleString()}\n`);  // 打印总计代币数量
}

async function read_addresses_from_file(filename) {
    const text = await fs.readFile(filename, 'utf-8');
    return text.split('\n').map(line => line.trim());
}

// 示例用法
read_addresses_from_file('addresses.txt').then(addresses => {
    batch_query(addresses);
});
