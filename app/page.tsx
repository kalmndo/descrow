import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, Users, ArrowRight, Wallet, Eye, Plus } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-accent" />
            <span className="text-xl font-bold text-foreground">Descrow</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6">
            <Zap className="h-3 w-3 mr-1" />
            Powered by Smart Contracts
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Trustless Escrow for <span className="text-accent">Web3 Deals</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Secure your transactions with blockchain-powered escrow. No intermediaries, no trust required—just smart
            contracts ensuring fair deals for everyone.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <a href="/create">
                <Plus className="h-5 w-5 mr-2" />
                Create Escrow
                <ArrowRight className="h-5 w-5 ml-2" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent" asChild>
              <a href="/escrows">
                <Eye className="h-5 w-5 mr-2" />
                View Escrows
              </a>
            </Button>
          </div>

          {/* Wallet Connect Section */}
          <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Connect Your Wallet</h3>
            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="justify-start bg-transparent">
                <div className="w-5 h-5 bg-orange-500 rounded mr-3"></div>
                MetaMask
              </Button>
              <Button variant="outline" className="justify-start bg-transparent">
                <div className="w-5 h-5 bg-pink-500 rounded mr-3"></div>
                Polkadot.js
              </Button>
              <Button variant="outline" className="justify-start bg-transparent">
                <div className="w-5 h-5 bg-purple-500 rounded mr-3"></div>
                Phantom
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to secure your Web3 transactions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-accent-foreground">1</span>
                </div>
                <CardTitle>Create Escrow</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Set up your escrow with terms, amount, and counterparty details. Smart contract handles the rest.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-accent-foreground">2</span>
                </div>
                <CardTitle>Fund & Wait</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Both parties fund the escrow. Funds are locked in the smart contract until conditions are met.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-accent-foreground">3</span>
                </div>
                <CardTitle>Automatic Release</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  When conditions are fulfilled, funds are automatically released. No manual intervention needed.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">Built for Security & Trust</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <Shield className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Smart Contract Audited</h3>
              <p className="text-muted-foreground">Our contracts are thoroughly audited by leading security firms</p>
            </div>

            <div className="flex flex-col items-center">
              <Users className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">10,000+ Users</h3>
              <p className="text-muted-foreground">Trusted by thousands of users across multiple blockchains</p>
            </div>

            <div className="flex flex-col items-center">
              <Zap className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">Instant escrow creation and automated fund release</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-sidebar py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-accent" />
                <span className="text-lg font-bold text-sidebar-foreground">TrustlessEscrow</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Secure Web3 transactions with smart contract-powered escrow services.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-sidebar-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/create" className="hover:text-accent transition-colors">
                    Create Escrow
                  </a>
                </li>
                <li>
                  <a href="/escrows" className="hover:text-accent transition-colors">
                    View Escrows
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sidebar-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sidebar-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-sidebar-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">© 2024 TrustlessEscrow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
