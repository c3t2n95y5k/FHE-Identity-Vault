import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Lock,
  Users,
  CheckCircle2,
  AlertCircle,
  Zap,
  FileCheck,
  Globe,
  Play
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About VeilCivic</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Privacy-First Identity & Governance Platform powered by Zama FHE
          </p>
        </div>

        {/* Project Overview */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Project Overview
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            VeilCivic is a next-generation decentralized platform that combines <strong>encrypted identity management</strong> with <strong>privacy-preserving governance</strong>.
            Built on Zama's Fully Homomorphic Encryption (FHE) technology, VeilCivic enables communities, DAOs, and organizations to manage sensitive identity data and conduct secure voting without ever exposing confidential information on-chain.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">End-to-End Encryption</h3>
                <p className="text-sm text-muted-foreground">
                  All sensitive data encrypted on client-side before submission
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">On-Chain Computation</h3>
                <p className="text-sm text-muted-foreground">
                  Compute directly on encrypted data without decryption
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Decentralized Governance</h3>
                <p className="text-sm text-muted-foreground">
                  Multiple voting types with voter privacy protection
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Demo Video */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Play className="h-6 w-6 text-primary" />
            Demo Video
          </h2>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Demo video coming soon</p>
              <p className="text-sm text-muted-foreground mt-2">
                See how to create encrypted identities and participate in private voting with VeilCivic
              </p>
            </div>
          </div>
        </Card>

        {/* Problems We Solve */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-primary" />
            Problems We Solve
          </h2>
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-2">Transparency vs Privacy Dilemma</h3>
              <p className="text-muted-foreground">
                Traditional blockchain systems expose all transaction data on public ledgers, making privacy-sensitive applications impractical.
                VeilCivic achieves on-chain encrypted storage and computation through FHE technology.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-2">Identity Management Challenge</h3>
              <p className="text-muted-foreground">
                KYC/identity data cannot be stored on-chain without compromising user privacy.
                Our encrypted identity vault allows users to verify identity attributes while maintaining complete privacy.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-2">Voting Security Issues</h3>
              <p className="text-muted-foreground">
                Traditional encrypted voting requires trust in third parties or reveals voter choices.
                FHE enables true secret ballot voting without any trusted third parties.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-2">Compliance Gap</h3>
              <p className="text-muted-foreground">
                Regulatory privacy protections required by law are impossible with standard blockchains.
                VeilCivic complies with GDPR and other data protection regulations while maintaining decentralization.
              </p>
            </div>
          </div>
        </Card>

        {/* How It Works */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-primary" />
            How It Works
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Fully Homomorphic Encryption (FHE) Explained</h3>
              <p className="text-muted-foreground mb-4">
                Fully Homomorphic Encryption is a special encryption technique that allows computation on encrypted data without decryption.
                This means sensitive information can be processed while maintaining complete privacy protection.
              </p>

              <div className="bg-muted p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">Voting Process Example</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>User selects voting option in browser</li>
                  <li>fhevmjs SDK encrypts vote data client-side (euint32)</li>
                  <li>Generate cryptographic proof to verify data correctness</li>
                  <li>Submit encrypted vote and proof to FHEBallot contract</li>
                  <li>Smart contract verifies encrypted proof on-chain</li>
                  <li>Use FHE.add() to directly accumulate encrypted votes</li>
                  <li>Vote data permanently stored encrypted on-chain</li>
                  <li>After voting period ends, request Zama Gateway to decrypt final results</li>
                  <li>Zama Gateway decrypts the encrypted tally</li>
                  <li>Final results published on-chain for everyone to view</li>
                </ol>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">Core Features</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Encrypted Identity Vault
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Client-side encrypted identity data (name, age, nationality, net worth)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Access level management based on encrypted net worth thresholds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Zero-knowledge proof verification of identity attributes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Users maintain full control over their encrypted data</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Privacy-Preserving Voting System
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Single, multi-choice, weighted, and quadratic voting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Votes remain encrypted throughout entire process</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Automatic time-gated voting period enforcement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Whitelist support to restrict voting participants</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Roadmap */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            Development Roadmap
          </h2>

          <div className="space-y-6">
            {/* Stage 1 */}
            <div className="relative pl-8 border-l-2 border-green-500">
              <div className="absolute left-0 top-0 -translate-x-1/2">
                <div className="h-4 w-4 rounded-full bg-green-500"></div>
              </div>
              <div className="mb-4">
                <Badge className="bg-green-500 mb-2">Completed</Badge>
                <h3 className="text-lg font-semibold">Stage 1: Foundation</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✅ Smart contract architecture design</li>
                <li>✅ Zama fhEVM FHE technology integration</li>
                <li>✅ Identity vault contract implementation</li>
                <li>✅ Basic voting mechanisms (Single, Multi, Weighted)</li>
                <li>✅ React frontend application setup</li>
                <li>✅ Wallet integration (MetaMask, WalletConnect)</li>
              </ul>
            </div>

            {/* Stage 2 */}
            <div className="relative pl-8 border-l-2 border-green-500">
              <div className="absolute left-0 top-0 -translate-x-1/2">
                <div className="h-4 w-4 rounded-full bg-green-500"></div>
              </div>
              <div className="mb-4">
                <Badge className="bg-green-500 mb-2">Completed</Badge>
                <h3 className="text-lg font-semibold">Stage 2: Core Features</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✅ Encrypted identity creation & management</li>
                <li>✅ Client-side FHE encryption (fhevmjs)</li>
                <li>✅ Multiple voting types implementation</li>
                <li>✅ Time-gated voting periods</li>
                <li>✅ Whitelist management system</li>
                <li>✅ Quadratic voting formula</li>
                <li>✅ Result decryption via Gateway</li>
                <li>✅ Responsive UI with Tailwind CSS</li>
              </ul>
            </div>

            {/* Stage 3 */}
            <div className="relative pl-8 border-l-2 border-blue-500">
              <div className="absolute left-0 top-0 -translate-x-1/2">
                <div className="h-4 w-4 rounded-full bg-blue-500 animate-pulse"></div>
              </div>
              <div className="mb-4">
                <Badge className="bg-blue-500 mb-2">In Progress</Badge>
                <h3 className="text-lg font-semibold">Stage 3: Enhanced Governance</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✅ Voting page with real contract data</li>
                <li>✅ FHE encrypted voting</li>
                <li>✅ Voting detail page with live results</li>
                <li>⏳ Governance management dashboard</li>
                <li>⏳ Voting analytics and statistics</li>
                <li>⏳ Vote delegation system</li>
                <li>⏳ Proposal creation UI</li>
                <li>⏳ Multi-signature voting results</li>
              </ul>
            </div>

            {/* Stage 4 */}
            <div className="relative pl-8 border-l-2 border-gray-300">
              <div className="absolute left-0 top-0 -translate-x-1/2">
                <div className="h-4 w-4 rounded-full bg-gray-300"></div>
              </div>
              <div className="mb-4">
                <Badge variant="outline" className="mb-2">Planned</Badge>
                <h3 className="text-lg font-semibold">Stage 4: Advanced Features</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>📋 Identity Verification: Integration with real KYC providers</li>
                <li>📋 Cross-Chain Support: Bridge to Polygon, Arbitrum</li>
                <li>📋 DAO Templates: Pre-built governance structures</li>
                <li>📋 Mobile App: React Native mobile client</li>
                <li>📋 Gasless Transactions: Meta-transactions for better UX</li>
                <li>📋 IPFS Integration: Decentralized proposal storage</li>
                <li>📋 ENS Support: Human-readable addresses</li>
              </ul>
            </div>

            {/* Stage 5 */}
            <div className="relative pl-8 border-l-2 border-gray-300">
              <div className="absolute left-0 top-0 -translate-x-1/2">
                <div className="h-4 w-4 rounded-full bg-gray-300"></div>
              </div>
              <div className="mb-4">
                <Badge variant="outline" className="mb-2">Planned</Badge>
                <h3 className="text-lg font-semibold">Stage 5: Enterprise & Scale</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>📋 API Platform: REST API for third-party integrations</li>
                <li>📋 White-Label Solution: Customizable for enterprises</li>
                <li>📋 Audit & Security: Professional smart contract audit</li>
                <li>📋 Mainnet Deployment: Production launch on Ethereum</li>
                <li>📋 Governance Token: Native token for platform governance</li>
                <li>📋 Staking Mechanism: Stake tokens for voting power</li>
                <li>📋 Treasury Management: Multi-sig treasury for DAOs</li>
              </ul>
            </div>

            {/* Stage 6 */}
            <div className="relative pl-8 border-l-2 border-gray-300">
              <div className="absolute left-0 top-0 -translate-x-1/2">
                <div className="h-4 w-4 rounded-full bg-gray-300"></div>
              </div>
              <div className="mb-4">
                <Badge variant="outline" className="mb-2">Planned</Badge>
                <h3 className="text-lg font-semibold">Stage 6: Ecosystem Growth</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>📋 SDK Release: Developer toolkit for integrations</li>
                <li>📋 Plugin System: Extensible voting mechanisms</li>
                <li>📋 Marketplace: Templates and governance modules</li>
                <li>📋 Analytics Platform: Advanced voting insights</li>
                <li>📋 Education Hub: Tutorials and documentation</li>
                <li>📋 Grant Program: Fund community projects</li>
                <li>📋 Partnerships: Integrate with major DAOs</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Technology Stack */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Technology Stack</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Frontend</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• React 18</li>
                <li>• TypeScript</li>
                <li>• Vite</li>
                <li>• Tailwind CSS</li>
                <li>• shadcn/ui</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Web3 Integration</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• wagmi v2</li>
                <li>• viem</li>
                <li>• RainbowKit</li>
                <li>• Privy SDK</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Blockchain & Encryption</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Solidity 0.8.19</li>
                <li>• Zama fhEVM</li>
                <li>• fhevmjs</li>
                <li>• Hardhat</li>
                <li>• Sepolia Testnet</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Footer CTA */}
        <div className="text-center py-8">
          <h3 className="text-xl font-semibold mb-2">Ready to Get Started?</h3>
          <p className="text-muted-foreground mb-4">
            Explore privacy-first decentralized identity and governance
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/identity"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6"
            >
              Create Identity
            </a>
            <a
              href="/voting"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6"
            >
              Join Voting
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
