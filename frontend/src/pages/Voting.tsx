import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Filter, Loader2, Vote } from "lucide-react";
import { useAllVotings, useVotingDetails, VotingStatus, VoteType } from "@/hooks/useVoting";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Helper to convert status enum to string
const getStatusString = (status: number | undefined): "Active" | "Ended" | "Not Started" | "Tallied" => {
  if (status === undefined) return "Not Started";
  switch (status) {
    case VotingStatus.Active:
      return "Active";
    case VotingStatus.Ended:
      return "Ended";
    case VotingStatus.Tallied:
      return "Tallied";
    default:
      return "Not Started";
  }
};

// Helper to convert vote type enum to string
const getVoteTypeString = (voteType: number): "Single Choice" | "Weighted" | "Quadratic" | "Multi Choice" => {
  switch (voteType) {
    case VoteType.Weighted:
      return "Weighted";
    case VoteType.Quadratic:
      return "Quadratic";
    case VoteType.MultiChoice:
      return "Multi Choice";
    default:
      return "Single Choice";
  }
};

// Helper to format time remaining
const getTimeRemaining = (endTime: bigint): string => {
  const now = Math.floor(Date.now() / 1000);
  const end = Number(endTime);
  const diff = end - now;

  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);

  if (days > 0) return `in ${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `in ${hours} hour${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
  return "ending soon";
};

// Single voting card component
function VotingItem({ votingId }: { votingId: number }) {
  const { config, status, totalVoters, hasVoted } = useVotingDetails(votingId);

  if (!config) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  // Handle config as array or object (Solidity struct can be returned as array)
  const configData = Array.isArray(config) ? {
    name: config[0],
    description: config[1],
    voteType: config[2],
    startTime: config[3],
    endTime: config[4],
    quorum: config[5],
    whitelistEnabled: config[6],
    maxVotersCount: config[7],
  } : config as any;

  const statusString = getStatusString(status);
  const voteTypeString = getVoteTypeString(Number(configData.voteType));
  const timeRemaining = getTimeRemaining(configData.endTime);

  return (
    <Link to={`/voting/${votingId}`}>
      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">{configData.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {configData.description}
              </p>
            </div>
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap gap-2">
            <span
              className={`px-2 py-1 rounded-md text-xs font-medium ${
                statusString === "Active"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : statusString === "Ended"
                  ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  : statusString === "Tallied"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
              }`}
            >
              {statusString}
            </span>
            <span className="px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
              {voteTypeString}
            </span>
            {hasVoted && (
              <span className="px-2 py-1 rounded-md text-xs font-medium bg-primary text-primary-foreground">
                Voted
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="text-muted-foreground">Voters: </span>
              <span className="font-medium">
                {totalVoters} / {configData.quorum.toString()}
              </span>
            </div>
            <div className="text-muted-foreground">{timeRemaining}</div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

const Voting = () => {
  const { count, isLoading } = useAllVotings();
  const [votingIds, setVotingIds] = useState<number[]>([]);

  useEffect(() => {
    if (count > 0) {
      // Generate array of voting IDs [0, 1, 2, ..., count-1]
      setVotingIds(Array.from({ length: count }, (_, i) => i));
    }
  }, [count]);

  // Fetch details for each voting (this will be done by VotingItem component)
  const activeVotingIds = votingIds; // For now, show all - filtering will be done by VotingItem
  const endedVotingIds = votingIds;
  const myVotingIds = votingIds;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Voting Dashboard</h1>
          <p className="text-muted-foreground">
            Participate in governance with privacy-preserving encrypted votes
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search votings..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Link to="/voting/create">
            <Button className="bg-gradient-primary shadow-primary gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              Create Voting
            </Button>
          </Link>
        </div>

        {/* Loading state */}
        {isLoading && (
          <Card className="p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading votings...</p>
          </Card>
        )}

        {/* No votings state */}
        {!isLoading && count === 0 && (
          <Card className="p-12 text-center">
            <div className="h-20 w-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-6">
              <Vote className="h-10 w-10 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-3">No Votings Yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              There are no voting proposals yet. Be the first to create one!
            </p>
            <Link to="/voting/create">
              <Button className="bg-gradient-primary shadow-primary">
                <Plus className="mr-2 h-4 w-4" />
                Create First Voting
              </Button>
            </Link>
          </Card>
        )}

        {/* Tabs with votings */}
        {!isLoading && count > 0 && (
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Votings ({count})</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="ended">Ended</TabsTrigger>
              <TabsTrigger value="my-votes">My Votes</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {votingIds.map((id) => (
                  <VotingItem key={id} votingId={id} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="active" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeVotingIds.map((id) => (
                  <VotingItem key={id} votingId={id} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ended" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {endedVotingIds.map((id) => (
                  <VotingItem key={id} votingId={id} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="my-votes" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myVotingIds.map((id) => (
                  <VotingItem key={id} votingId={id} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Voting;
