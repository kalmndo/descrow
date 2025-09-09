"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Clock, CheckCircle, XCircle, AlertTriangle, DollarSign, Users, Calendar, ExternalLink, Loader2 } from "lucide-react"
import { useWallet } from "@/contexts/WalletContext"
import { Header } from "@/components/Header"
import Link from "next/link"

// Mock data for escrow details
const MOCK_ESCROW = {
  id: "0x1234567890abcdef1234567890abcdef12345678",
  amount: "100.5",
  token: "DOT",
  buyer: "0x1111111111111111111111111111111111111111",
  seller: "0x2222222222222222222222222222222222222222",
  arbitrator: "0x3333333333333333333333333333333333333333",
  description: "Web3 Development Services - Frontend React Application",
  status: "pending", // pending, completed, cancelled, disputed
  role: "buyer", // buyer, seller, arbitrator
  createdAt: "2024-01-15T10:30:00Z",
  fundedAt: "2024-01-16T14:20:00Z",
  deadline: "2024-02-15T10:30:00Z",
  funded: true,
  disputeReason: null,
  resolution: null
}

const STATUS_CONFIG = {
  pending: { 
    label: "Pending", 
    color: "bg-yellow-500", 
    icon: Clock,
    description: "Funded but not released"
  },
  completed: { 
    label: "Completed", 
    color: "bg-green-500", 
    icon: CheckCircle,
    description: "Funds released to seller"
  },
  cancelled: { 
    label: "Cancelled", 
    color: "bg-red-500", 
    icon: XCircle,
    description: "Escrow cancelled and refunded"
  },
  disputed: { 
    label: "Disputed", 
    color: "bg-orange-500", 
    icon: AlertTriangle,
    description: "Dispute requires arbitration"
  }
}

const ROLE_CONFIG = {
  buyer: { label: "Buyer", color: "bg-purple-500" },
  seller: { label: "Seller", color: "bg-blue-500" },
  arbitrator: { label: "Arbitrator", color: "bg-green-500" }
}

const TIMELINE_STEPS = [
  { id: "created", label: "Created", icon: Calendar },
  { id: "funded", label: "Funded", icon: DollarSign },
  { id: "released", label: "Released", icon: CheckCircle }
]

export default function EscrowDetailsPage({ params }: { params: { id: string } }) {
  const { isConnected, account } = useWallet()
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showReleaseDialog, setShowReleaseDialog] = useState(false)
  const [showDisputeDialog, setShowDisputeDialog] = useState(false)
  const [showResolveDialog, setShowResolveDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [disputeReason, setDisputeReason] = useState("")
  const [resolution, setResolution] = useState("")

  const escrow = MOCK_ESCROW // In real app, fetch by params.id
  const statusConfig = STATUS_CONFIG[escrow.status as keyof typeof STATUS_CONFIG]
  const roleConfig = ROLE_CONFIG[escrow.role as keyof typeof ROLE_CONFIG]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getTimelineStatus = (step: string) => {
    switch (step) {
      case "created":
        return "completed"
      case "funded":
        return escrow.funded ? "completed" : "pending"
      case "released":
        if (escrow.status === "completed") return "completed"
        if (escrow.status === "cancelled") return "cancelled"
        return "pending"
      default:
        return "pending"
    }
  }

  const handleCancel = async () => {
    setIsProcessing(true)
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsProcessing(false)
    setShowCancelDialog(false)
    // Update escrow status
  }

  const handleRequestRelease = async () => {
    setIsProcessing(true)
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setShowReleaseDialog(false)
    // Update escrow status
  }

  const handleDispute = async () => {
    setIsProcessing(true)
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setShowDisputeDialog(false)
    // Update escrow status
  }

  const handleResolve = async () => {
    setIsProcessing(true)
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsProcessing(false)
    setShowResolveDialog(false)
    // Update escrow status
  }

  const getActionButtons = () => {
    if (escrow.status === "completed" || escrow.status === "cancelled") {
      return null
    }

    switch (escrow.role) {
      case "buyer":
        return (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setShowCancelDialog(true)}
              disabled={!escrow.funded}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel & Refund
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setShowDisputeDialog(true)}
              disabled={!escrow.funded}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Dispute
            </Button>
          </div>
        )
      case "seller":
        return (
          <Button 
            onClick={() => setShowReleaseDialog(true)}
            disabled={!escrow.funded}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Request Release
          </Button>
        )
      case "arbitrator":
        if (escrow.status === "disputed") {
          return (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowResolveDialog(true)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Resolve Dispute
              </Button>
            </div>
          )
        }
        return null
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton={true} backHref="/escrows" backLabel="Back to Escrows" />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{escrow.description}</h1>
              <p className="text-muted-foreground font-mono text-sm">{formatAddress(escrow.id)}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={`${statusConfig.color} text-white`}>
                <statusConfig.icon className="h-3 w-3 mr-1" />
                {statusConfig.label}
              </Badge>
              <Badge variant="outline" className={`border-${roleConfig.color.replace('bg-', '')} text-${roleConfig.color.replace('bg-', '')}`}>
                {roleConfig.label}
              </Badge>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">{statusConfig.description}</p>
          {!isConnected && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Wallet Required:</strong> Connect your wallet to interact with this escrow.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Timeline</CardTitle>
                <CardDescription>Track the progress of this escrow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {TIMELINE_STEPS.map((step, index) => {
                    const status = getTimelineStatus(step.id)
                    const Icon = step.icon
                    
                    return (
                      <div key={step.id} className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          status === "completed" ? "bg-green-500 text-white" :
                          status === "cancelled" ? "bg-red-500 text-white" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{step.label}</h4>
                            <span className="text-sm text-muted-foreground">
                              {step.id === "created" && formatDate(escrow.createdAt)}
                              {step.id === "funded" && escrow.fundedAt && formatDate(escrow.fundedAt)}
                              {step.id === "released" && escrow.status === "completed" && "Completed"}
                              {step.id === "released" && escrow.status === "cancelled" && "Cancelled"}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {step.id === "created" && "Escrow contract created and deployed"}
                            {step.id === "funded" && (escrow.funded ? "Funds deposited into escrow" : "Waiting for funding")}
                            {step.id === "released" && escrow.status === "completed" && "Funds released to seller"}
                            {step.id === "released" && escrow.status === "cancelled" && "Funds refunded to buyer"}
                            {step.id === "released" && escrow.status === "pending" && "Awaiting release or cancellation"}
                          </div>
                        </div>
                        {index < TIMELINE_STEPS.length - 1 && (
                          <div className={`w-px h-8 ml-5 ${
                            status === "completed" ? "bg-green-500" : "bg-muted"
                          }`} />
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Deal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Deal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-muted-foreground">{escrow.description}</p>
                  </div>
                  
                  {escrow.disputeReason && (
                    <div>
                      <h4 className="font-medium mb-2 text-orange-600">Dispute Reason</h4>
                      <p className="text-muted-foreground bg-orange-50 p-3 rounded-md">{escrow.disputeReason}</p>
                    </div>
                  )}

                  {escrow.resolution && (
                    <div>
                      <h4 className="font-medium mb-2 text-green-600">Resolution</h4>
                      <p className="text-muted-foreground bg-green-50 p-3 rounded-md">{escrow.resolution}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Transaction Details */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Amount</h4>
                  <p className="text-2xl font-bold">{escrow.amount} {escrow.token}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Buyer</h4>
                  <p className="font-mono text-sm">{formatAddress(escrow.buyer)}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Seller</h4>
                  <p className="font-mono text-sm">{formatAddress(escrow.seller)}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Arbitrator</h4>
                  <p className="font-mono text-sm">{formatAddress(escrow.arbitrator)}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Deadline</h4>
                  <p className="text-sm">{formatDate(escrow.deadline)}</p>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Funding Status</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${escrow.funded ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      <span className="text-sm">{escrow.funded ? 'Funded' : 'Pending'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                {getActionButtons() || (
                  <p className="text-muted-foreground text-sm">
                    No actions available for this escrow.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* External Links */}
            <Card>
              <CardHeader>
                <CardTitle>External Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <a href={`https://polkadot.subscan.io/extrinsic/${escrow.id}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Subscan
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Escrow</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this escrow? The funds will be refunded to the buyer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Cancellation"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Release Dialog */}
      <Dialog open={showReleaseDialog} onOpenChange={setShowReleaseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Release</DialogTitle>
            <DialogDescription>
              Request the release of funds to complete this escrow transaction.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReleaseDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRequestRelease} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Request Release"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dispute Dialog */}
      <Dialog open={showDisputeDialog} onOpenChange={setShowDisputeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>File Dispute</DialogTitle>
            <DialogDescription>
              Explain the reason for disputing this escrow. An arbitrator will review your case.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="dispute-reason">Reason for Dispute</Label>
              <Textarea
                id="dispute-reason"
                placeholder="Please explain why you are disputing this escrow..."
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisputeDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDispute} disabled={isProcessing || !disputeReason.trim()}>
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "File Dispute"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Dispute Dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Dispute</DialogTitle>
            <DialogDescription>
              As an arbitrator, decide how to resolve this dispute.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="resolution">Resolution Decision</Label>
              <Textarea
                id="resolution"
                placeholder="Explain your decision and reasoning..."
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResolveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleResolve} disabled={isProcessing || !resolution.trim()}>
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Resolve Dispute"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
