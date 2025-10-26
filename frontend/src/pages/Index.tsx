import Navigation from "@/components/Navigation";
import IdentityCard from "@/components/IdentityCard";
import VotingCard from "@/components/VotingCard";
import StatsCard from "@/components/StatsCard";
import { Shield, Vote, Users, Lock, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 border border-primary/20">
            <Lock className="h-4 w-4" />
            <span className="text-sm font-medium">Powered by FHE Technology</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Privacy-First Identity & Voting
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Manage your encrypted identity and participate in privacy-preserving governance with 
            Fully Homomorphic Encryption on the blockchain.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-primary shadow-primary gap-2">
              <Shield className="h-5 w-5" />
              Create Identity
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Vote className="h-5 w-5" />
              Explore Voting
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all group">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 mx-auto shadow-glow group-hover:scale-110 transition-transform">
                <Lock className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Encrypted Identity</h3>
              <p className="text-muted-foreground text-sm">
                Your sensitive data is encrypted on-chain with FHE, ensuring complete privacy
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all group">
              <div className="h-12 w-12 rounded-xl bg-gradient-accent flex items-center justify-center mb-4 mx-auto shadow-glow group-hover:scale-110 transition-transform">
                <Vote className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Private Voting</h3>
              <p className="text-muted-foreground text-sm">
                Cast votes that remain encrypted until results are revealed, preventing manipulation
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all group">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 mx-auto shadow-glow group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Verifiable Results</h3>
              <p className="text-muted-foreground text-sm">
                All computations are transparent and verifiable on-chain while preserving privacy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="container mx-auto px-4 py-16">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard
            title="Total Identities"
            value="12,450"
            icon={Users}
            trend={{ value: 12, label: "this month" }}
          />
          <StatsCard
            title="Active Votes"
            value="28"
            icon={Vote}
            trend={{ value: 8, label: "from last week" }}
            gradient
          />
          <StatsCard
            title="Participation Rate"
            value="87%"
            icon={Sparkles}
            trend={{ value: 5, label: "improvement" }}
          />
          <StatsCard
            title="Encrypted Data"
            value="100%"
            icon={Lock}
          />
        </div>

        {/* Identity Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Identity</h2>
            <Link to="/identity">
              <Button variant="ghost" className="gap-2">
                View Details
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <IdentityCard
            netWorth="1,250,000"
            domicile="United States"
            tier={7}
            isPEP={false}
            watchlistScore={0}
            riskScore={15}
            accessLevel="Premium"
            createdAt="Jan 15, 2024"
          />
        </div>

        {/* Active Votings */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Active Votings</h2>
            <Link to="/voting">
              <Button variant="ghost" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <VotingCard
              id={1}
              title="Protocol Upgrade Proposal"
              description="Vote on implementing the new FHE optimization improvements"
              status="Active"
              voteType="Weighted"
              totalVoters={245}
              quorum={500}
              endTime="in 2 days"
            />
            <VotingCard
              id={2}
              title="Treasury Allocation"
              description="Decide how to allocate 100,000 tokens from the community treasury"
              status="Active"
              voteType="Quadratic"
              totalVoters={512}
              quorum={500}
              endTime="in 5 hours"
              hasVoted
            />
            <VotingCard
              id={3}
              title="Grant Program Selection"
              description="Choose which projects receive funding from the grants program"
              status="Active"
              voteType="Single Choice"
              totalVoters={892}
              quorum={1000}
              endTime="in 1 week"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Secured by Zama FHE</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Documentation</a>
              <a href="#" className="hover:text-primary transition-colors">GitHub</a>
              <a href="#" className="hover:text-primary transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
