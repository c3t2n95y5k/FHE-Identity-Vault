import Navigation from "@/components/Navigation";
import VotingCard from "@/components/VotingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Filter } from "lucide-react";

const Voting = () => {
  const votings = [
    {
      id: 1,
      title: "Protocol Upgrade Proposal",
      description: "Vote on implementing the new FHE optimization improvements to reduce gas costs",
      status: "Active" as const,
      voteType: "Weighted" as const,
      totalVoters: 245,
      quorum: 500,
      endTime: "in 2 days",
    },
    {
      id: 2,
      title: "Treasury Allocation",
      description: "Decide how to allocate 100,000 tokens from the community treasury",
      status: "Active" as const,
      voteType: "Quadratic" as const,
      totalVoters: 512,
      quorum: 500,
      endTime: "in 5 hours",
      hasVoted: true,
    },
    {
      id: 3,
      title: "Grant Program Selection",
      description: "Choose which projects receive funding from the grants program",
      status: "Active" as const,
      voteType: "Single Choice" as const,
      totalVoters: 892,
      quorum: 1000,
      endTime: "in 1 week",
    },
    {
      id: 4,
      title: "Governance Framework Update",
      description: "Update the governance framework to include new voting mechanisms",
      status: "Ended" as const,
      voteType: "Weighted" as const,
      totalVoters: 1250,
      quorum: 1000,
      endTime: "2 days ago",
    },
    {
      id: 5,
      title: "Community Fund Distribution",
      description: "Vote on distributing community funds to various initiatives",
      status: "Not Started" as const,
      voteType: "Quadratic" as const,
      totalVoters: 0,
      quorum: 800,
      endTime: "starts in 3 days",
    },
    {
      id: 6,
      title: "New Feature Prioritization",
      description: "Help prioritize which features should be developed next",
      status: "Tallied" as const,
      voteType: "Single Choice" as const,
      totalVoters: 2100,
      quorum: 2000,
      endTime: "1 week ago",
    },
  ];

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
          <Button className="bg-gradient-primary shadow-primary gap-2">
            <Plus className="h-4 w-4" />
            Create Voting
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Votings</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="ended">Ended</TabsTrigger>
            <TabsTrigger value="my-votes">My Votes</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {votings.map((voting) => (
                <VotingCard key={voting.id} {...voting} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {votings
                .filter((v) => v.status === "Active")
                .map((voting) => (
                  <VotingCard key={voting.id} {...voting} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="ended" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {votings
                .filter((v) => v.status === "Ended" || v.status === "Tallied")
                .map((voting) => (
                  <VotingCard key={voting.id} {...voting} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="my-votes" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {votings
                .filter((v) => v.hasVoted)
                .map((voting) => (
                  <VotingCard key={voting.id} {...voting} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Voting;
