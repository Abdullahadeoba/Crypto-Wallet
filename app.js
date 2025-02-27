// ✅ Ensure Web3Modal, WalletConnect, and Ethers.js are loaded!
console.log("Initializing Crypto Wallet...");

let web3Modal;
let provider;
let signer;
let userAddress;

// ✅ Initialize Web3Modal properly
async function init() {
    console.log("Initializing Web3Modal...");

    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider.default, // ✅ Ensure correct package usage
            options: {
                infuraId: "017e0a921b4541a2addc0aa406b1bbfd" // ✅ Use your own Infura ID
            }
        }
    };

    web3Modal = new Web3Modal.default({ // ✅ FIX: Ensure correct instantiation
        cacheProvider: false,
        providerOptions
    });

    document.getElementById("walletInfo").classList.add("hidden");
    document.getElementById("transactionSection").classList.add("hidden");
    document.getElementById("disconnectWallet").classList.add("hidden");
}

// ✅ Connect Wallet Function (FIXED!)
async function connectWallet() {
    try {
        console.log("Opening Web3Modal to show available wallets...");

        provider = await web3Modal.connect();
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        signer = ethersProvider.getSigner();
        userAddress = await signer.getAddress();

        // ✅ Fetch Balance Correctly
        const balance = await ethersProvider.getBalance(userAddress);
        const formattedBalance = ethers.utils.formatEther(balance);

        // ✅ Update UI Elements
        const addressElement = document.getElementById("walletAddress");
        addressElement.innerHTML = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
        addressElement.addEventListener("click", () => copyToClipboard(userAddress));

        document.getElementById("walletBalance").innerHTML = formattedBalance;
        document.getElementById("walletInfo").classList.remove("hidden");
        document.getElementById("transactionSection").classList.remove("hidden");

        document.getElementById("connectWallet").classList.add("hidden");
        document.getElementById("disconnectWallet").classList.remove("hidden");

    } catch (error) {
        console.error("Connection failed:", error);
        alert("Wallet connection failed! Check console for details.");
    }
}

// ✅ Disconnect Wallet (FIXED!)
async function disconnectWallet() {
    console.log("Disconnecting Wallet...");

    if (provider && provider.disconnect) {
        await provider.disconnect();
    }

    provider = null;
    signer = null;
    userAddress = null;

    // ✅ Reset UI
    document.getElementById("walletInfo").classList.add("hidden");
    document.getElementById("transactionSection").classList.add("hidden");

    document.getElementById("connectWallet").classList.remove("hidden");
    document.getElementById("disconnectWallet").classList.add("hidden");
}

// ✅ Copy Wallet Address
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Wallet Address Copied!");
    }).catch(err => {
        console.error("Failed to copy: ", err);
    });
}

// ✅ Send Transaction (ETH)
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

// ✅ Ensure Event Listeners Work!
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("connectWallet").addEventListener("click", connectWallet);
    document.getElementById("disconnectWallet").addEventListener("click", disconnectWallet);
    document.getElementById("sendTransaction").addEventListener("click", sendTransaction);
});

// ✅ Initialize Web3Modal (Finally Fixed!)
init();


