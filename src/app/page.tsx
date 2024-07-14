"use client"

import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import Image from 'next/image';
import logo from '@/app/logo.svg'

const usdcABI = [
    {
        constant: false,
        inputs: [
            { name: "_to", type: "address" },
            { name: "_value", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: true,
        inputs: [
            { name: "_owner", type: "address" }
        ],
        name: "balanceOf",
        outputs: [
            { name: "balance", type: "uint256" }
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
];

const USDC_CONTRACT_ADDRESS_CELO = "0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B";
const USDC_CONTRACT_ADDRESS_ARBITRUM = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d";
const USDC_CONTRACT_ADDRESS_ROOTSTOCK = "0x81532a7ab169efb8c3a0b6a173c8c4613a336eea";
const RELAYER_ADDRESS = "0x632b39E5Fe4EAAFDF21601b2Bc206ca0f602C85A";

export default function Home() {
    const { address, isConnected, chainId } = useAccount();
    const [amount, setAmount] = useState("");
    const [balance, setBalance] = useState("");

    useEffect(() => {
        const fetchBalance = async () => {
            if (!window.ethereum || !isConnected || !address) return;

            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);

            let contractAddress = "";
            if (chainId === 421614) {
                contractAddress = USDC_CONTRACT_ADDRESS_ARBITRUM;
            } else if (chainId === 44787) {
                contractAddress = USDC_CONTRACT_ADDRESS_CELO;
            } else if (chainId === 31) {
                contractAddress = USDC_CONTRACT_ADDRESS_ROOTSTOCK;
            } else {
                console.error("Chain not supported");
                return;
            }

            const usdcContract = new ethers.Contract(contractAddress, usdcABI, provider);
            const balance = await usdcContract.balanceOf(address);
            setBalance(parseFloat(ethers.formatUnits(balance, 6)).toFixed(6).replace(/\.?0+$/, ""));
        };

        fetchBalance();
    }, [address, isConnected, chainId]);

    const handleSwap = async () => {
        if (!window.ethereum || !isConnected) {
            throw new Error("No crypto wallet found. Please install it.");
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();

        let contractAddress = "";
        if (chainId == 421614) {
            contractAddress = USDC_CONTRACT_ADDRESS_ARBITRUM
        } else if (chainId == 44787) {
            contractAddress = USDC_CONTRACT_ADDRESS_CELO
        } else {
            console.error("chain not supported");
            return;
        }

        const usdcContract = new ethers.Contract(
            contractAddress,
            usdcABI,
            signer
        );
        const transactionResponse = await usdcContract.transfer(
            RELAYER_ADDRESS,
            ethers.parseUnits(amount, 6)
        );
        console.log('Transaction response:', transactionResponse);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="mt-32">
                <div className="flex flex-col items-center justify-center space-y-4 my-10">
                    <Image src={logo} alt="Logo" width={300} height={300} />
                </div>
                <div className="flex flex-col items-center justify-center">
                    <ConnectButton showBalance={false} />
                </div>
                <div className="flex flex-col items-center justify-center space-y-4 my-10">
                    <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount"
                        className="border border-gray-300 rounded-md p-2 text-black"
                    />
                    <button
                        onClick={handleSwap}
                        className="bg-blue-500 text-white py-2 px-4 rounded-md"
                    >
                        Swap
                    </button>
                    <p className="text-2xl text-pink-600 font-bold mb-4">
                        Balance: <span className="text-white text-shadow">{balance} USDC</span>
                    </p>
                </div>
            </div>
        </main>
    );
}
