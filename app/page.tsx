import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/Header"
import { Shield, Zap, Users, ArrowRight, Eye, Plus, Coins, Lock, Globe } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section id="hero" className="card my-8 relative overflow-hidden shadow-md">
      <div className="p-8 md:p-10 lg:p-12 flex flex-col md:flex-row items-start">
        {/* Text content - takes full width on mobile */}
        <div className="w-full md:w-3/5 z-10">
          <Badge variant="secondary" className="mb-6 bg-accent/10 border-accent/20 text-accent">
            <Coins className="h-3 w-3 mr-1" />
            Decentralized • Immutable • Trustless
          </Badge>

          <h1 className="text-black dark:text-white text-4xl md:text-5xl lg:text-6xl font-medium leading-tight">
            Your Web3
            <span className="block text-accent">Escrow</span>
            Platform
          </h1>

          <p className="my-6 text-sm md:text-base max-w-md text-gray-700 dark:text-gray-300">
            Secure your transactions with blockchain-powered escrow. No intermediaries, no trust required—just smart
            contracts ensuring fair deals for everyone in the decentralized economy.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Button
              size="lg"
              className="bg-gradient-to-r from-accent to-blue-500 hover:from-accent/90 hover:to-blue-500/90 border-0"
              asChild
            >
              <a href="/create">
                <Plus className="h-5 w-5 mr-2" />
                Create Escrow
                <ArrowRight className="h-5 w-5 ml-2" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-transparent border-accent/30 hover:bg-accent/10 text-black dark:text-white"
              asChild
            >
              <a href="/escrows">
                <Eye className="h-5 w-5 mr-2" />
                View Escrows
              </a>
            </Button>
          </div>

          {/* Web3 Features */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-full">
              <Lock className="h-4 w-4 text-accent" />
              <span>Smart Contract Secured</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-full">
              <Globe className="h-4 w-4 text-accent" />
              <span>Multi-Chain Support</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-full">
              <Zap className="h-4 w-4 text-accent" />
              <span>Instant Settlement</span>
            </div>
          </div>
        </div>

        {/* Visual element - hidden on mobile, visible on md and up */}
        <div className="hidden md:flex md:w-2/5 md:absolute md:right-0 md:top-0 md:bottom-0 md:items-center">
          <div className="w-full h-auto md:h-full md:w-auto flex items-center justify-center p-8">
            {/* Web3 Visual - Replace with your image */}
            <div className="relative w-full h-full max-w-md">
              {/* You can replace this with your Web3 image */}
              <div className="w-full h-80 bg-gradient-to-br from-accent/5 to-blue-500/5 rounded-2xl border border-accent/20 flex items-center justify-center relative overflow-hidden">
                {/* Blockchain nodes */}
                <div className="absolute top-8 left-8 w-4 h-4 bg-accent rounded-full animate-pulse"></div>
                <div className="absolute top-16 right-12 w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-500"></div>
                <div className="absolute bottom-12 left-16 w-5 h-5 bg-accent/60 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute bottom-8 right-8 w-3 h-3 bg-blue-500/60 rounded-full animate-pulse delay-1500"></div>

                {/* Central Web3 icon */}
                <div className="relative z-10">
                  <div className="w-32 h-32 bg-gradient-to-br from-accent to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                      <Shield className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Coins className="h-4 w-4 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                    <Lock className="h-4 w-4 text-white" />
                  </div>
                </div>

                {/* Connection lines */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
                <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-accent/30 to-transparent"></div>
              </div>

              {/* Add your image here by replacing the above div with: */}
              {/* 
              <Image
                src="/your-web3-image.png"
                alt="Web3 Escrow Platform"
                width={500}
                height={400}
                className="w-full h-auto object-contain rounded-2xl"
                priority
              />
              */}
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Web3 Escrow in 3 Steps</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Deploy smart contracts, lock funds, and automate settlements—all on-chain
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-accent/20 hover:border-accent/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Deploy Smart Contract</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create your escrow contract with custom terms, token amounts, and release conditions. Deployed instantly on-chain.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-accent/20 hover:border-accent/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Lock Funds On-Chain</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Both parties deposit tokens into the immutable smart contract. Funds are cryptographically secured until conditions are met.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-accent/20 hover:border-accent/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Automated Settlement</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Smart contract automatically executes when conditions are met. No human intervention, no delays—pure DeFi efficiency.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Web3 Trust Indicators */}
      <section className="py-20 px-4 bg-gradient-to-br from-muted/30 to-background">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Built for Web3 Security</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Enterprise-grade security meets decentralized innovation
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 rounded-xl bg-background/50 border border-accent/10">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-blue-500 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Battle-Tested Smart Contracts</h3>
              <p className="text-muted-foreground">Audited by ConsenSys Diligence and OpenZeppelin. Zero exploits since launch.</p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-xl bg-background/50 border border-accent/10">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-blue-500 rounded-full flex items-center justify-center mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Multi-Chain DeFi</h3>
              <p className="text-muted-foreground">Supporting Ethereum, Polygon, Arbitrum, and Optimism. More chains coming soon.</p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-xl bg-background/50 border border-accent/10">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-blue-500 rounded-full flex items-center justify-center mb-4">
                <Coins className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">$50M+ TVL Secured</h3>
              <p className="text-muted-foreground">Trusted by DeFi protocols, NFT marketplaces, and Web3 businesses worldwide.</p>
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
