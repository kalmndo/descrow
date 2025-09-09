"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, ArrowLeft, Search, Filter, Clock, CheckCircle, XCircle, AlertTriangle, Eye, ExternalLink } from "lucide-react"
import Link from "next/link"

// Mock data for escrows
const MOCK_ESCROWS = [
  {
    id: "0x1234567890abcdef1234567890abcdef12345678",
    amount: "100.5",
    token: "DOT",
    buyer: "0x1111111111111111111111111111111111111111",
    seller: "0x2222222222222222222222222222222222222222",
    arbitrator: "0x3333333333333333333333333333333333333333",
    description: "Web3 Development Services - Frontend React Application",
    status: "active",
    role: "buyer",
    createdAt: "2024-01-15T10:30:00Z",
    deadline: "2024-02-15T10:30:00Z",
    funded: true
  },
  {
    id: "0xabcdef1234567890abcdef1234567890abcdef12",
    amount: "250.0",
    token: "DOT",
    buyer: "0x4444444444444444444444444444444444444444",
    seller: "0x5555555555555555555555555555555555555555",
    arbitrator: "0x3333333333333333333333333333333333333333",
    description: "Smart Contract Audit and Security Review",
    status: "completed",
    role: "seller",
    createdAt: "2024-01-10T14:20:00Z",
    deadline: "2024-01-25T14:20:00Z",
    funded: true
  },
  {
    id: "0x9876543210fedcba9876543210fedcba98765432",
    amount: "75.25",
    token: "DOT",
    buyer: "0x6666666666666666666666666666666666666666",
    seller: "0x7777777777777777777777777777777777777777",
    arbitrator: "0x3333333333333333333333333333333333333333",
    description: "UI/UX Design for DeFi Dashboard",
    status: "disputed",
    role: "arbitrator",
    createdAt: "2024-01-20T09:15:00Z",
    deadline: "2024-02-05T09:15:00Z",
    funded: true
  },
  {
    id: "0xfedcba0987654321fedcba0987654321fedcba09",
    amount: "500.0",
    token: "DOT",
    buyer: "0x8888888888888888888888888888888888888888",
    seller: "0x9999999999999999999999999999999999999999",
    arbitrator: "0x3333333333333333333333333333333333333333",
    description: "Blockchain Infrastructure Setup and Deployment",
    status: "pending",
    role: "buyer",
    createdAt: "2024-01-25T16:45:00Z",
    deadline: "2024-02-10T16:45:00Z",
    funded: false
  },
  {
    id: "0x13579bdf02468ace13579bdf02468ace13579bdf",
    amount: "150.75",
    token: "DOT",
    buyer: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    seller: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    arbitrator: "0x3333333333333333333333333333333333333333",
    description: "NFT Marketplace Development",
    status: "cancelled",
    role: "seller",
    createdAt: "2024-01-05T11:30:00Z",
    deadline: "2024-01-20T11:30:00Z",
    funded: false
  }
]

const STATUS_CONFIG = {
  active: { label: "Active", color: "bg-blue-500", icon: Clock },
  completed: { label: "Completed", color: "bg-green-500", icon: CheckCircle },
  disputed: { label: "Disputed", color: "bg-orange-500", icon: AlertTriangle },
  pending: { label: "Pending", color: "bg-yellow-500", icon: Clock },
  cancelled: { label: "Cancelled", color: "bg-red-500", icon: XCircle }
}

const ROLE_CONFIG = {
  buyer: { label: "Buyer", color: "bg-purple-500" },
  seller: { label: "Seller", color: "bg-blue-500" },
  arbitrator: { label: "Arbitrator", color: "bg-green-500" }
}

export default function MyEscrowsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredEscrows = MOCK_ESCROWS.filter(escrow => {
    const matchesSearch = escrow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         escrow.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || escrow.role === roleFilter
    const matchesStatus = statusFilter === "all" || escrow.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getStatusBadge = (status: keyof typeof STATUS_CONFIG) => {
    const config = STATUS_CONFIG[status]
    const Icon = config.icon
    
    return (
      <Badge className={`${config.color} text-white hover:${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getRoleBadge = (role: keyof typeof ROLE_CONFIG) => {
    const config = ROLE_CONFIG[role]
    
    return (
      <Badge variant="outline" className={`border-${config.color.replace('bg-', '')} text-${config.color.replace('bg-', '')}`}>
        {config.label}
      </Badge>
    )
  }

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
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Escrows</h1>
          <p className="text-muted-foreground">
            Manage and track all your escrow transactions
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search escrows..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="arbitrator">Arbitrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="disputed">Disputed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Results Count */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Results</label>
                <div className="flex items-center h-10 px-3 py-2 text-sm bg-muted rounded-md">
                  {filteredEscrows.length} escrow{filteredEscrows.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Escrows List */}
        <div className="space-y-4">
          {filteredEscrows.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No escrows found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                    ? "Try adjusting your filters to see more results."
                    : "You haven't created or participated in any escrows yet."}
                </p>
                <Link href="/create">
                  <Button>
                    Create Your First Escrow
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredEscrows.map((escrow) => (
              <Card key={escrow.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg">{escrow.description}</CardTitle>
                        {getStatusBadge(escrow.status as keyof typeof STATUS_CONFIG)}
                        {getRoleBadge(escrow.role as keyof typeof ROLE_CONFIG)}
                      </div>
                      <CardDescription className="font-mono text-xs">
                        {formatAddress(escrow.id)}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/escrow/${escrow.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`https://polkadot.subscan.io/extrinsic/${escrow.id}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Explorer
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Amount */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Amount</p>
                      <p className="text-lg font-semibold">{escrow.amount} {escrow.token}</p>
                    </div>

                    {/* Counterparty */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        {escrow.role === "buyer" ? "Seller" : escrow.role === "seller" ? "Buyer" : "Parties"}
                      </p>
                      <p className="font-mono text-sm">
                        {escrow.role === "arbitrator" 
                          ? `${formatAddress(escrow.buyer)} / ${formatAddress(escrow.seller)}`
                          : formatAddress(escrow.role === "buyer" ? escrow.seller : escrow.buyer)
                        }
                      </p>
                    </div>

                    {/* Created Date */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Created</p>
                      <p className="text-sm">{formatDate(escrow.createdAt)}</p>
                    </div>

                    {/* Deadline */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Deadline</p>
                      <p className="text-sm">{formatDate(escrow.deadline)}</p>
                    </div>
                  </div>

                  {/* Funding Status */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${escrow.funded ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <span className="text-sm font-medium">
                          {escrow.funded ? 'Fully Funded' : 'Pending Funding'}
                        </span>
                      </div>
                      {escrow.status === "disputed" && (
                        <Badge variant="destructive">
                          Requires Arbitration
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
