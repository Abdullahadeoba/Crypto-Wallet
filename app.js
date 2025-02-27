// Import dependencies (for ES6 Modules)
// Uncomment this if using Webpack, Vite, or modern JavaScript frameworks
// import Web3Modal from "web3modal";
// import { ethers } from "ethers";
// import WalletConnectProvider from "@walletconnect/web3-provider";

let web3Modal;
let provider;
let signer;
let userAddress;

// ✅ Initialize Web3Modal
async function init() {
    console.log("Initializing Web3Modal...");

    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider, // Ensure correct import
            options: {
                infuraId: "017e0a921b4541a2addc0aa406b1bbfd"
            }
        }
    };

    web3Modal = new Web3Modal.default({ // Fix instantiation
        cacheProvider: false,
        providerOptions
    });

    // Hide sections initially
    document.getElementById("walletInfo").style.display = "none";
    document.getElementById("transactionSection").style.display = "none";
    document.getElementById("disconnectWallet").style.display = "none";
}

// ✅ Connect Wallet
async function connectWallet() {
    try {
        console.log("Opening Web3Modal to show available wallets...");

        provider = await web3Modal.connect();
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        signer = ethersProvider.getSigner();
        userAddress = await signer.getAddress();

        // Fetch Balance
        const balance = await ethersProvider.getBalance(userAddress);
        const formattedBalance = ethers.utils.formatEther(balance);

        // Update UI
        const addressElement = document.getElementById("walletAddress");
        addressElement.innerHTML = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
        addressElement.addEventListener("click", () => copyToClipboard(userAddress));

        document.getElementById("walletBalance").innerHTML = `Balance: ${formattedBalance} ETH`;
        document.getElementById("walletInfo").style.display = "block";
        document.getElementById("transactionSection").style.display = "block";

        document.getElementById("connectWallet").style.display = "none";
        document.getElementById("disconnectWallet").style.display = "block";

    } catch (error) {
        console.error("Connection failed:", error);
    }
}

// ✅ Disconnect Wallet
async function disconnectWallet() {
    console.log("Disconnecting Wallet...");

    if (provider && provider.disconnect) {
        await provider.disconnect();
    }

    provider = null;
    signer = null;
    userAddress = null;

    // Reset UI
    document.getElementById("walletAddress").innerHTML = "";
    document.getElementById("walletBalance").innerHTML = "";
    document.getElementById("walletInfo").style.display = "none";
    document.getElementById("transactionSection").style.display = "none";

    document.getElementById("connectWallet").style.display = "block";
    document.getElementById("disconnectWallet").style.display = "none";
}

// ✅ Copy address to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Wallet Address Copied!");
    }).catch(err => {
        console.error("Failed to copy: ", err);
    });
}

// ✅ Send ETH Transaction
async function sendTransaction() {
    try {
        const recipient = document.getElementById("recipient").value;
        const amount = document.getElementById("amount").value;

        if (!recipient || !amount) {
            alert("Please enter recipient address and amount!");
            return;
        }

        const tx = await signer.sendTransaction({
            to: recipient,
            value: ethers.utils.parseEther(amount)
        });

        alert("Transaction Sent! Hash: " + tx.hash);
        console.log("Transaction Details:", tx);

    } catch (error) {
        console.error("Transaction Failed:", error);
        alert("Transaction Failed! Check console for details.");
    }
}

// ✅ Ensure event listeners are attached after DOM loads
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("connectWallet").addEventListener("click", connectWallet);
    document.getElementById("disconnectWallet").addEventListener("click", disconnectWallet);
    document.getElementById("sendTransaction").addEventListener("click", sendTransaction);
});

// ✅ Initialize Web3Modal
init();
