"use client"

import { Button } from "@/components/ui/button"
import { WalletConnect } from "@/components/WalletConnect"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface HeaderProps {
  showBackButton?: boolean
  backHref?: string
  backLabel?: string
}

export function Header({ showBackButton = false, backHref = "/", backLabel = "Back" }: HeaderProps) {
  const pathname = usePathname()

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Shield className="h-8 w-8 text-accent" />
            <span className="text-xl font-bold text-foreground">Descrow</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className={pathname === "/" ? "bg-accent" : ""}>
                Home
              </Button>
            </Link>
            <Link href="/create">
              <Button variant="ghost" size="sm" className={pathname === "/create" ? "bg-accent" : ""}>
                Create Escrow
              </Button>
            </Link>
            <Link href="/escrows">
              <Button variant="ghost" size="sm" className={pathname === "/escrows" ? "bg-accent" : ""}>
                My Escrows
              </Button>
            </Link>
          </nav>

          {/* Back Button (when needed) */}
          {showBackButton && (
            <Link href={backHref}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {backLabel}
              </Button>
            </Link>
          )}

          {/* Wallet Connection */}
          <WalletConnect />
        </div>
      </div>
    </header>
  )
}
