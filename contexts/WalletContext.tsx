"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface WalletAccount {
  address: string
  name?: string
  source: string
}

export interface WalletContextType {
  isConnected: boolean
  account: WalletAccount | null
  connect: (walletType: string) => Promise<void>
  disconnect: () => void
  switchAccount: (address: string) => void
  isLoading: boolean
  error: string | null
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Mock wallet data for demonstration
const MOCK_ACCOUNTS = {
  metamask: [
    { address: "0x1234567890abcdef1234567890abcdef12345678", name: "Account 1", source: "metamask" },
    { address: "0xabcdef1234567890abcdef1234567890abcdef12", name: "Account 2", source: "metamask" }
  ],
  polkadot: [
    { address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", name: "Polkadot Account 1", source: "polkadot" },
    { address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", name: "Polkadot Account 2", source: "polkadot" }
  ],
  phantom: [
    { address: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM", name: "Phantom Account 1", source: "phantom" }
  ]
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<WalletAccount | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check for existing connection on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem('connectedWallet')
    const savedAccount = localStorage.getItem('walletAccount')
    
    if (savedWallet && savedAccount) {
      try {
        const accountData = JSON.parse(savedAccount)
        setAccount(accountData)
        setIsConnected(true)
      } catch (e) {
        // Clear invalid data
        localStorage.removeItem('connectedWallet')
        localStorage.removeItem('walletAccount')
      }
    }
  }, [])

  const connect = async (walletType: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate wallet connection delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock wallet connection logic
      let selectedAccount: WalletAccount

      switch (walletType) {
        case 'metamask':
          // Simulate MetaMask connection
          selectedAccount = MOCK_ACCOUNTS.metamask[0]
          break
        case 'polkadot':
          // Simulate Polkadot.js connection
          selectedAccount = MOCK_ACCOUNTS.polkadot[0]
          break
        case 'phantom':
          // Simulate Phantom connection
          selectedAccount = MOCK_ACCOUNTS.phantom[0]
          break
        default:
          throw new Error('Unsupported wallet type')
      }

      // Save to localStorage
      localStorage.setItem('connectedWallet', walletType)
      localStorage.setItem('walletAccount', JSON.stringify(selectedAccount))

      setAccount(selectedAccount)
      setIsConnected(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet')
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = () => {
    localStorage.removeItem('connectedWallet')
    localStorage.removeItem('walletAccount')
    setAccount(null)
    setIsConnected(false)
    setError(null)
  }

  const switchAccount = (address: string) => {
    if (!account) return

    // Find the account in the mock data
    const allAccounts = Object.values(MOCK_ACCOUNTS).flat()
    const newAccount = allAccounts.find(acc => acc.address === address)
    
    if (newAccount) {
      localStorage.setItem('walletAccount', JSON.stringify(newAccount))
      setAccount(newAccount)
    }
  }

  const value: WalletContextType = {
    isConnected,
    account,
    connect,
    disconnect,
    switchAccount,
    isLoading,
    error
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
