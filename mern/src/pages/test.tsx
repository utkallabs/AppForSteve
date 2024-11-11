import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { ethers } from 'ethers';
import testContractABI from '@src/configs/abis/test_contract.json';

// Replace with your contract's address
const contractAddress: string = "0xE2dfda1769eA4BaD0426Ab345db525044eDaBE7d";

const Test: React.FC = () => {
  const [balance, setBalance] = useState<string | null>(null);
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const loadProviderAndContract = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
        await web3Provider.send("eth_requestAccounts", []);
        const signer = web3Provider.getSigner();
        setProvider(web3Provider);
        setAccount(await signer.getAddress());

        const tokenContract = new ethers.Contract(contractAddress, testContractABI, signer);
        setContract(tokenContract);
      } else {
        alert('Please install MetaMask');
      }
    };

    loadProviderAndContract();
  }, []);

  // Fetch the logged-in user's token balance
  const fetchBalance = async () => {
    if (contract && account) {
      const balance = await contract.balanceOf(account);
      setBalance(ethers.utils.formatUnits(balance, 18)); // Adjust decimals as per your token
    }
  };

  useEffect(() => {
    if (account) {
      fetchBalance();
    }
  }, [account, contract]);

  // Handle token transfer
  const transferTokens = async (e: FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount) return alert('Please fill out both fields');
    if (contract) {
      const amountInWei = ethers.utils.parseUnits(amount, 18); // Adjust decimals as per your token
      try {
        const tx = await contract.transfer(recipient, amountInWei);
        await tx.wait(); // Wait for transaction to be confirmed
        alert('Transfer successful');
        fetchBalance(); // Update balance after transfer
      } catch (error) {
        console.error('Transfer failed:', error);
        alert('Transfer failed');
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>ERC-20 Token Wallet</h2>
      {account ? (
        <>
          <p><strong>Account:</strong> {account}</p>
          <p><strong>Balance:</strong> {balance} Tokens</p>
          <button style={styles.button} onClick={fetchBalance}>Refresh Balance</button>

          <h3>Transfer Tokens</h3>
          <form style={styles.form} onSubmit={transferTokens}>
            <div style={styles.formGroup}>
              <label>Recipient Address:</label>
              <input
                type="text"
                value={recipient}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setRecipient(e.target.value)}
                placeholder="0x..."
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Amount:</label>
              <input
                type="number"
                value={amount}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                placeholder="Amount in tokens"
                style={styles.input}
              />
            </div>
            <button style={styles.button} type="submit">Transfer</button>
          </form>
        </>
      ) : (
        <p style={styles.message}>Please connect your wallet</p>
      )}
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center' as 'center',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    marginTop: '1rem',
  },
  formGroup: {
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
  },
  input: {
    padding: '0.5rem',
    width: '300px',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginTop: '0.5rem',
    textAlign: 'center' as 'center',
  },
  button: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  message: {
    fontSize: '1.2rem',
  },
};

export default Test;
