import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  useAccount,
  usePublicClient,
  useReadContract,
} from "wagmi";
import { formatDistanceToNowStrict } from "date-fns";
import Navigation from "@/components/Navigation";
import IdentityCard from "@/components/IdentityCard";
import VotingCard from "@/components/VotingCard";
import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Vote, Users, Lock, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { useIdentity } from "@/hooks/useIdentity";
import { useVotingCount } from "@/hooks/useVoting";
import { CONTRACTS, IDENTITY_VAULT_ABI, BALLOT_ABI } from "@/lib/contracts";
import { numericCodeToCountryLabel } from "@/lib/countries";

type VotingStatusLabel = "Not Started" | "Active" | "Ended" | "Tallied";
type VotingTypeLabel = "Single Choice" | "Weighted" | "Quadratic";

type DashboardVoting = {
  id: number;
  title: string;
  description: string;
  status: VotingStatusLabel;
  voteType: VotingTypeLabel;
  quorum: number;
  totalVoters: number;
  endTime: number;
  endTimeLabel: string;
  hasVoted: boolean;
};

const STATUS_LABELS: Record<number, VotingStatusLabel> = {
  0: "Not Started",
  1: "Active",
  2: "Ended",
  3: "Tallied",
};

const VOTE_TYPE_LABELS: Record<number, VotingTypeLabel> = {
  0: "Single Choice",
  1: "Single Choice",
  2: "Weighted",
  3: "Quadratic",
};

const statusSortOrder: Record<VotingStatusLabel, number> = {
  "Active": 0,
  "Not Started": 1,
  "Ended": 2,
  "Tallied": 3,
};

const deriveAccessLevel = (
  tier: number,
  watchlist: number,
  riskScore: number
): "Denied" | "Basic" | "Full" | "Premium" => {
  if (tier >= 7 && watchlist === 0 && riskScore <= 30) return "Premium";
  if (tier >= 5 && watchlist <= 1 && riskScore <= 40) return "Full";
  if (tier >= 3 && riskScore < 70) return "Basic";
  return "Denied";
};

const formatEndTimeLabel = (timestamp: number) => {
  if (!timestamp) return "unknown";
  const date = new Date(timestamp * 1000);
  return formatDistanceToNowStrict(date, { addSuffix: true });
};

const Index = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { hasIdentity, identity, isLoading: identityLoading } = useIdentity();
  const { count: votingCount } = useVotingCount();

  const {
    data: totalIdentitiesData,
    status: totalIdentitiesStatus,
  } = useReadContract({
    address: CONTRACTS.IDENTITY_VAULT,
    abi: IDENTITY_VAULT_ABI,
    functionName: "totalIdentities",
  });

  const [votings, setVotings] = useState<DashboardVoting[]>([]);
  const [votingsLoading, setVotingsLoading] = useState(true);

  useEffect(() => {
    if (!publicClient) return;
    if (!votingCount) {
      setVotings([]);
      setVotingsLoading(false);
      return;
    }

    let cancelled = false;
    const loadVotings = async () => {
      setVotingsLoading(true);
      try {
        const ids = Array.from({ length: votingCount }, (_, i) => BigInt(i));

        const [configs, statuses, totals, votedFlags] = await Promise.all([
          Promise.all(
            ids.map((id) =>
              publicClient.readContract({
                address: CONTRACTS.BALLOT,
                abi: BALLOT_ABI,
                functionName: "votingConfigs",
                args: [id],
              })
            )
          ),
          Promise.all(
            ids.map((id) =>
              publicClient.readContract({
                address: CONTRACTS.BALLOT,
                abi: BALLOT_ABI,
                functionName: "getVotingStatus",
                args: [id],
              })
            )
          ),
          Promise.all(
            ids.map((id) =>
              publicClient.readContract({
                address: CONTRACTS.BALLOT,
                abi: BALLOT_ABI,
                functionName: "totalVoters",
                args: [id],
              })
            )
          ),
          address
            ? Promise.all(
                ids.map((id) =>
                  publicClient.readContract({
                    address: CONTRACTS.BALLOT,
                    abi: BALLOT_ABI,
                    functionName: "hasVoted",
                    args: [id, address],
                  })
                )
              )
            : [],
        ]);

        if (cancelled) return;

        const mapped: DashboardVoting[] = configs.map((rawConfig, idx) => {
          const config = rawConfig as any;
          const idNumber = Number(ids[idx]);
          const statusValue = Number(statuses[idx] ?? 0);
          const totalVoters = Number(totals[idx] ?? 0);
          const voteTypeValue = Number(config.voteType ?? config[2] ?? 0);
          const endTimeValue = Number(config.endTime ?? config[4] ?? 0);
          const quorumValue = Number(config.quorum ?? config[5] ?? 0);

          return {
            id: idNumber,
            title: config.name ?? config[0] ?? `Voting #${idNumber}`,
            description: config.description ?? config[1] ?? "",
            status: STATUS_LABELS[statusValue] ?? "Not Started",
            voteType: VOTE_TYPE_LABELS[voteTypeValue] ?? "Single Choice",
            quorum: quorumValue,
            totalVoters,
            endTime: endTimeValue,
            endTimeLabel: formatEndTimeLabel(endTimeValue),
            hasVoted: Boolean(address && votedFlags[idx]),
          };
        });

        setVotings(mapped);
      } catch (error) {
        console.error("Failed to load voting data", error);
        setVotings([]);
      } finally {
        if (!cancelled) {
          setVotingsLoading(false);
        }
      }
    };

    loadVotings();

    return () => {
      cancelled = true;
    };
  }, [address, publicClient, votingCount]);

  const totalIdentities =
    totalIdentitiesStatus === "success"
      ? Number(totalIdentitiesData ?? 0)
      : null;

  const activeVotes = useMemo(
    () => votings.filter((vote) => vote.status === "Active").length,
    [votings]
  );

  const { participationRate, totalQuorum } = useMemo(() => {
    const quorumSum = votings.reduce((sum, vote) => sum + (vote.quorum || 0), 0);
    const participantSum = votings.reduce(
      (sum, vote) => sum + (vote.totalVoters || 0),
      0
    );
    const rate = quorumSum > 0 ? Math.min(100, Math.round((participantSum / quorumSum) * 100)) : 0;
    return {
      participationRate: rate,
      totalQuorum: quorumSum,
    };
  }, [votings]);

  const topVotings = useMemo(() => {
    if (!votings.length) return [];
    return [...votings]
      .sort(
        (a, b) =>
          statusSortOrder[a.status] - statusSortOrder[b.status] ||
          Number(a.endTime) - Number(b.endTime)
      )
      .slice(0, 3);
  }, [votings]);

  const identityCard = () => {
    if (identityLoading) {
      return (
        <Card className="p-6 flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading identity...
        </Card>
      );
    }

    if (hasIdentity && identity) {
      return (
        <IdentityCard
          domicile={numericCodeToCountryLabel(identity.domicileCode)}
          tier={identity.tier}
          isPEP={identity.pep}
          watchlistScore={identity.watchlist}
          riskScore={identity.riskScore}
          accessLevel={deriveAccessLevel(
            identity.tier,
            identity.watchlist,
            identity.riskScore
          )}
          createdAt={new Date(identity.createdAt * 1000).toLocaleDateString()}
        />
      );
    }

    return (
      <Card className="p-6 border-dashed text-center text-muted-foreground">
        <p className="text-lg font-semibold mb-2">Identity not created yet</p>
        <p className="text-sm mb-4">
          Create your encrypted identity to unlock personalized access and private voting rights.
        </p>
        <Button asChild>
          <Link to="/identity" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Create Identity
          </Link>
        </Button>
      </Card>
    );
  };

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
            <Button size="lg" className="bg-gradient-primary shadow-primary gap-2" asChild>
              <Link to="/identity">
                <BrandLogo size={20} />
                Create Identity
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link to="/voting">
                <Vote className="h-5 w-5" />
                Explore Voting
              </Link>
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
            value={
              totalIdentities === null
                ? "..."
                : totalIdentities.toLocaleString()
            }
            icon={Users}
          />
          <StatsCard
            title="Active Votes"
            value={votingsLoading ? "..." : activeVotes.toString()}
            icon={Vote}
            gradient
          />
          <StatsCard
            title="Participation Rate"
            value={
              votingsLoading && !votings.length
                ? "..."
                : totalQuorum === 0
                ? "0%"
                : `${participationRate}%`
            }
            icon={Sparkles}
          />
          <StatsCard
            title="Encrypted Data"
            value={
              totalIdentities === null
                ? "..."
                : totalIdentities > 0
                ? "100%"
                : "0%"
            }
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
          {identityCard()}
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

          {votingsLoading ? (
            <Card className="p-12 text-center text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3" />
              Loading votings...
            </Card>
          ) : topVotings.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topVotings.map((vote) => (
                <VotingCard
                  key={vote.id}
                  id={vote.id}
                  title={vote.title}
                  description={vote.description}
                  status={vote.status}
                  voteType={vote.voteType}
                  totalVoters={vote.totalVoters}
                  quorum={vote.quorum}
                  endTime={vote.endTimeLabel}
                  hasVoted={vote.hasVoted}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center text-muted-foreground">
              <p className="text-lg font-semibold mb-2">No votings found</p>
              <p className="text-sm">
                Create the first encrypted governance proposal to kick things off.
              </p>
            </Card>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BrandLogo size={20} />
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
