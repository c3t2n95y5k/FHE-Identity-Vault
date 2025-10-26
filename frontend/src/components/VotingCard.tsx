import { Vote, Clock, Users, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface VotingCardProps {
  id: number;
  title: string;
  description: string;
  status: "Not Started" | "Active" | "Ended" | "Tallied";
  voteType: "Single Choice" | "Weighted" | "Quadratic";
  totalVoters: number;
  quorum: number;
  endTime: string;
  hasVoted?: boolean;
}

const VotingCard = ({
  id,
  title,
  description,
  status,
  voteType,
  totalVoters,
  quorum,
  endTime,
  hasVoted = false,
}: VotingCardProps) => {
  const statusColors = {
    "Not Started": "secondary",
    Active: "success",
    Ended: "warning",
    Tallied: "default",
  };

  const quorumProgress = (totalVoters / quorum) * 100;

  const getVoteTypeIcon = () => {
    switch (voteType) {
      case "Weighted":
        return "⚖️";
      case "Quadratic":
        return "📊";
      default:
        return "🗳️";
    }
  };

  return (
    <Card className="p-6 shadow-card hover:shadow-primary transition-all duration-300 border-border/50 hover:border-primary/30 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="text-3xl">{getVoteTypeIcon()}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>
        </div>
        <Badge variant={statusColors[status] as any} className="ml-2">
          {status}
        </Badge>
      </div>

      <div className="space-y-4">
        {/* Vote Type & Time */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Vote className="h-4 w-4" />
            <span>{voteType}</span>
          </div>
          {status === "Active" && (
            <div className="flex items-center gap-2 text-warning">
              <Clock className="h-4 w-4" />
              <span>Ends {endTime}</span>
            </div>
          )}
        </div>

        {/* Quorum Progress */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Participation</span>
            </div>
            <span className="font-medium">
              {totalVoters}/{quorum}
            </span>
          </div>
          <Progress value={quorumProgress} className="h-2" />
        </div>

        {/* Voting Status */}
        {hasVoted ? (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 text-success">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">You voted</span>
          </div>
        ) : (
          <Button
            className={`w-full ${
              status === "Active"
                ? "bg-gradient-primary shadow-primary"
                : ""
            }`}
            disabled={status !== "Active"}
          >
            {status === "Active" ? (
              <>
                <Vote className="h-4 w-4 mr-2" />
                Cast Vote
              </>
            ) : status === "Not Started" ? (
              "Voting Not Started"
            ) : (
              "Voting Ended"
            )}
          </Button>
        )}

        {status === "Ended" || status === "Tallied" ? (
          <Button variant="outline" className="w-full">
            View Results
          </Button>
        ) : null}
      </div>
    </Card>
  );
};

export default VotingCard;
