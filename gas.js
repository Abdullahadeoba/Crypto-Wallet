import { Bundler } from "@account-abstraction/sdk";
import { ethers } from "ethers";

const bundlerUrl = "https://api.pimlico.io/v1/rpc?chainId=1&apiKey=pim_LstQquUhX9DzWoikrjN2kL";

export const bundler = new Bundler({
    provider: new ethers.providers.JsonRpcProvider(bundlerUrl),
    entryPointAddress: "0x18B833F57FD5E83fa31a9Ca1114758eE756eb45d",
});

import { ethers } from "ethers";
import { bundler } from "./bundler.js";

async function sendGaslessTransaction(userAddress, to, value) {
    try {
        const op = {
            sender: userAddress,
            to,
            value: ethers.utils.parseEther(value).toHexString(),
            gasLimit: "0x5208", // Approx. 21000 gas
            callData: "0x",
        };

        // Send transaction through Bundler
        const userOpHash = await bundler.sendUserOperation(op);
        console.log("UserOperation Hash:", userOpHash);
        alert("Transaction sent successfully!");
    } catch (error) {
        console.error("Transaction failed:", error);
        alert("Transaction failed!");
    }
}

document.getElementById("sendTransaction").addEventListener("click", async () => {
    const recipient = document.getElementById("recipient").value;
    const amount = document.getElementById("amount").value;

    if (!recipient || !amount) {
        alert("Please enter recipient address and amount!");
        return;
    }

    await sendGaslessTransaction(userAddress, recipient, amount);
});


