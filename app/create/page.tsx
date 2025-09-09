"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Shield, ArrowLeft, Loader2, CheckCircle, ExternalLink } from "lucide-react"
import Link from "next/link"

interface EscrowFormData {
  sellerAddress: string
  amount: string
  token: string
  description: string
}

export default function CreateEscrowPage() {
  const [formData, setFormData] = useState<EscrowFormData>({
    sellerAddress: "",
    amount: "",
    token: "",
    description: ""
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [transactionHash, setTransactionHash] = useState("")
  const [errors, setErrors] = useState<Partial<EscrowFormData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<EscrowFormData> = {}
    
    if (!formData.sellerAddress.trim()) {
      newErrors.sellerAddress = "Seller address is required"
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.sellerAddress)) {
      newErrors.sellerAddress = "Invalid Ethereum address format"
    }
    
    if (!formData.amount.trim()) {
      newErrors.amount = "Amount is required"
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be a positive number"
    }
    
    if (!formData.token) {
      newErrors.token = "Please select a token"
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Deal description is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Simulate contract deployment
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Generate a mock transaction hash
      const mockHash = "0x" + Math.random().toString(16).substr(2, 64)
      setTransactionHash(mockHash)
      setShowSuccessModal(true)
      
      // Reset form
      setFormData({
        sellerAddress: "",
        amount: "",
        token: "",
        description: ""
      })
    } catch (error) {
      console.error("Error deploying escrow contract:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof EscrowFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // const selectedToken = TOKENS.find(token => token.symbol === formData.token)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-accent" />
            <span className="text-xl font-bold text-foreground">Descrow</span>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Escrow</h1>
          <p className="text-muted-foreground">
            Set up a secure escrow contract for your Web3 transaction
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Escrow Details</CardTitle>
            <CardDescription>
              Fill in the details for your escrow contract. All fields are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Seller Address */}
              <div className="space-y-2">
                <Label htmlFor="sellerAddress">Seller Address</Label>
                <Input
                  id="sellerAddress"
                  type="text"
                  placeholder="0x..."
                  value={formData.sellerAddress}
                  onChange={(e) => handleInputChange("sellerAddress", e.target.value)}
                  className={errors.sellerAddress ? "border-destructive" : ""}
                />
                {errors.sellerAddress && (
                  <p className="text-sm text-destructive">{errors.sellerAddress}</p>
                )}
              </div>

              {/* Amount and Token */}
              <div className="space-y-2">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount of DOT</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.000001"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                    className={errors.amount ? "border-destructive" : ""}
                  />
                  {errors.amount && (
                    <p className="text-sm text-destructive">{errors.amount}</p>
                  )}
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor="token">Token</Label>
                  <Select value={formData.token} onValueChange={(value: string) => handleInputChange("token", value)}>
                    <SelectTrigger className={errors.token ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      {TOKENS.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{token.symbol}</span>
                            <span className="text-muted-foreground">- {token.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.token && (
                    <p className="text-sm text-destructive">{errors.token}</p>
                  )}
                </div> */}
              </div>

              {/* Deal Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Deal Description / Reference</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the goods, services, or terms of this escrow..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className={errors.description ? "border-destructive" : ""}
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
              </div>

              {/* Summary */}
              {formData.amount && formData.token && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-foreground">Transaction Summary</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><span className="font-medium">Amount:</span> {formData.amount} DOT</p>
                    <p><span className="font-medium">Token:</span> DOT</p>
                    <p><span className="font-medium">Seller:</span> {formData.sellerAddress.slice(0, 6)}...{formData.sellerAddress.slice(-4)}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deploying Contract...
                  </>
                ) : (
                  "Deploy Escrow Contract"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Contract Deployed Successfully!</span>
            </DialogTitle>
            <DialogDescription>
              Your escrow contract has been deployed to the blockchain.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Transaction Details</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Transaction Hash:</span></p>
                <p className="font-mono text-xs break-all bg-background p-2 rounded border">
                  {transactionHash}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  navigator.clipboard.writeText(transactionHash)
                }}
              >
                Copy Hash
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  window.open(`https://etherscan.io/tx/${transactionHash}`, '_blank')
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Explorer
              </Button>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowSuccessModal(false)}
            >
              Close
            </Button>
            <Button 
              className="flex-1"
              onClick={() => {
                setShowSuccessModal(false)
                // Navigate to escrow details page
                window.location.href = `/escrow/${transactionHash}`
              }}
            >
              View Escrow
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
