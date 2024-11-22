import React, { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import useFetch from "../hooks/useFetch";
import dummyData from "../utils/dummyData";
import { shortenAddress } from "../utils/shortenAddress";

const TransactionsCard = ({ addressTo, addressFrom, timestamp, message, keyword, amount, url }) => {
  const gifUrl = useFetch({ keyword });

  return (
    <div className="bg-[#181918] m-4 flex flex-1
      2xl:min-w-[450px]
      2xl:max-w-[500px]
      sm:min-w-[270px]
      sm:max-w-[300px]
      min-w-full
      flex-col p-3 rounded-md hover:shadow-2xl"
    >
      <div className="flex flex-col items-center w-full mt-3">
        <div className="w-full mb-6 p-2">
          <div className="flex flex-col gap-2">
            <a 
              href={`https://sepolia.etherscan.io/address/${addressFrom}`} 
              target="_blank" 
              rel="noreferrer"
              className="text-white hover:text-blue-400 transition-colors"
            >
              <p className="text-white text-base">From: {shortenAddress(addressFrom)}</p>
            </a>
            <a 
              href={`https://sepolia.etherscan.io/address/${addressTo}`} 
              target="_blank" 
              rel="noreferrer"
              className="text-white hover:text-blue-400 transition-colors"
            >
              <p className="text-white text-base">To: {shortenAddress(addressTo)}</p>
            </a>
            <p className="text-white text-base">Amount: {amount} ETH</p>
            {message && (
              <p className="text-white text-base">Message: {message}</p>
            )}
            {timestamp && (
              <p className="text-white text-base text-sm">Time: {timestamp}</p>
            )}
          </div>
        </div>
        {(gifUrl || url) && (
          <img
            src={gifUrl || url}
            alt="transaction gif"
            className="w-full h-64 2xl:h-96 rounded-md shadow-lg object-cover"
          />
        )}
      </div>
    </div>
  );
};

const Transactions = () => {
  const { transactions, currentAccount } = useContext(TransactionContext);

  const reversedTransactions = React.useMemo(() => {
    return [...(dummyData || []), ...(transactions || [])].reverse();
  }, [transactions]);

  if (!currentAccount) {
    return (
      <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
        <div className="flex flex-col md:p-12 py-12 px-4">
          <h3 className="text-white text-3xl text-center my-2">
            Connect your account to see the latest transactions
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
      <div className="flex flex-col md:p-12 py-12 px-4">
        <h3 className="text-white text-3xl text-center my-2">
          Latest Transactions
        </h3>

        <div className="flex flex-wrap justify-center items-center mt-10">
          {reversedTransactions.length > 0 ? (
            reversedTransactions.map((transaction, i) => (
              <TransactionsCard key={`${transaction.addressFrom}-${i}`} {...transaction} />
            ))
          ) : (
            <p className="text-white text-lg text-center">No transactions found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;