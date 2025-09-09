"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/contexts/WalletContext"
import { Wallet, ChevronDown, LogOut, User, Copy, Check, Loader2 } from "lucide-react"

const WALLET_OPTIONS = [
  {
    id: 'metamask',
    name: 'MetaMask',
    description: 'Connect using MetaMask browser extension',
    icon: '🦊',
    color: 'bg-orange-500'
  },
  {
    id: 'polkadot',
    name: 'Polkadot.js',
    description: 'Connect using Polkadot.js browser extension',
    icon: '🔗',
    color: 'bg-pink-500'
  },
  {
    id: 'phantom',
    name: 'Phantom',
    description: 'Connect using Phantom wallet',
    icon: '👻',
    color: 'bg-purple-500'
  }
]

export function WalletConnect() {
  const { isConnected, account, connect, disconnect, isLoading, error } = useWallet()
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleConnect = async (walletType: string) => {
    await connect(walletType)
    setShowConnectModal(false)
  }

  const handleDisconnect = () => {
    disconnect()
    setShowAccountMenu(false)
  }

  const copyAddress = async () => {
    if (account?.address) {
      await navigator.clipboard.writeText(account.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (address: string) => {
    if (address.startsWith('0x')) {
      // Ethereum address
      return `${address.slice(0, 6)}...${address.slice(-4)}`
    } else {
      // Polkadot address
      return `${address.slice(0, 8)}...${address.slice(-8)}`
    }
  }

  if (isConnected && account) {
    return (
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setShowAccountMenu(!showAccountMenu)}
          className="flex items-center space-x-2"
        >
          <div className={`w-2 h-2 rounded-full ${account.source === 'metamask' ? 'bg-orange-500' : account.source === 'polkadot' ? 'bg-pink-500' : 'bg-purple-500'}`} />
          <span className="font-mono text-sm">{formatAddress(account.address)}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>

        {showAccountMenu && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50">
            <div className="p-4 space-y-4">
              {/* Account Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${account.source === 'metamask' ? 'bg-orange-500' : account.source === 'polkadot' ? 'bg-pink-500' : 'bg-purple-500'}`} />
                  <span className="font-medium">{account.name || 'Connected Account'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm text-muted-foreground">{account.address}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyAddress}
                    className="h-6 w-6 p-0"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                <Badge variant="outline" className="text-xs">
                  {account.source === 'metamask' ? 'MetaMask' : account.source === 'polkadot' ? 'Polkadot.js' : 'Phantom'}
                </Badge>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={copyAddress}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Address
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  onClick={handleDisconnect}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowConnectModal(true)}
        className="flex items-center space-x-2"
      >
        <Wallet className="h-4 w-4" />
        <span>Connect Wallet</span>
      </Button>

      <Dialog open={showConnectModal} onOpenChange={setShowConnectModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogDescription>
              Choose a wallet to connect to your account
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {WALLET_OPTIONS.map((wallet) => (
              <Button
                key={wallet.id}
                variant="outline"
                className="w-full justify-start h-auto p-4"
                onClick={() => handleConnect(wallet.id)}
                disabled={isLoading}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg ${wallet.color} flex items-center justify-center text-white text-lg`}>
                    {wallet.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{wallet.name}</div>
                    <div className="text-sm text-muted-foreground">{wallet.description}</div>
                  </div>
                  {isLoading && (
                    <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                  )}
                </div>
              </Button>
            ))}
          </div>

          <div className="text-xs text-muted-foreground text-center">
            By connecting a wallet, you agree to our Terms of Service and Privacy Policy
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
