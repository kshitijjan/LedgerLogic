import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract, parseEther } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = async () => {
  try {
    if (!ethereum) throw new Error("Please install MetaMask.");
    
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const transactionsContract = new Contract(
      contractAddress,
      contractABI,
      signer
    );

    return transactionsContract;
  } catch (error) {
    console.error("Error creating Ethereum contract:", error);
    throw error;
  }
};

export const TransactionsProvider = ({ children }) => {
  const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllTransactions = async () => {
    try {
      if (!ethereum) throw new Error("Please install MetaMask.");
      
      const transactionsContract = await createEthereumContract();

      const availableTransactions = await transactionsContract.getAllTransactions();

      const structuredTransactions = availableTransactions.map((transaction) => ({
        addressTo: transaction.receiver,
        addressFrom: transaction.sender,
        timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
        message: transaction.message,
        keyword: transaction.keyword,
        amount: parseInt(transaction.amount._hex) / (10 ** 18)
      }));

      setTransactions(structuredTransactions);
      
      return structuredTransactions;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  };

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) throw new Error("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        await getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
      throw error;
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      const transactionsContract = await createEthereumContract();
      const currentTransactionCount = await transactionsContract.getTransactionCount();

      window.localStorage.setItem("transactionCount", currentTransactionCount.toString());
    } catch (error) {
      console.error("Error checking transactions:", error);
      throw error;
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) throw new Error("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      setCurrentAccount(accounts[0]);
      await getAllTransactions(); 
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) throw new Error("Please install MetaMask.");

      const { addressTo, amount, keyword, message } = formData;
      const transactionsContract = await createEthereumContract();
      const parsedAmount = parseEther(amount);

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: currentAccount,
          to: addressTo,
          gas: "0x5208",
          value: parsedAmount.toString(),
        }],
      });

      const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      console.log(`Success - ${transactionHash.hash}`);
      setIsLoading(false);

      const transactionsCount = await transactionsContract.getTransactionCount();
      setTransactionCount(transactionsCount.toString());
      
      await getAllTransactions();
    } catch (error) {
      console.error("Error sending transaction:", error);
      throw error;
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};