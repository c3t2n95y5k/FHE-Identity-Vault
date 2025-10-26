import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, ShieldCheck, Clock, CheckCircle2, Lock } from "lucide-react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  useVotingDetails,
  VotingStatus,
  VoteType,
  useVotingOptions,
  useCastVote,
} from "@/hooks/useVoting";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const getStatusLabel = (status: number | undefined) => {
  switch (status) {
    case VotingStatus.Active:
      return { label: "Active", className: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" };
    case VotingStatus.Ended:
      return { label: "Ended", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" };
    case VotingStatus.Tallied:
      return { label: "Tallied", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300" };
    default:
      return { label: "Not Started", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200" };
  }
};

const getVoteTypeLabel = (voteType: number | undefined) => {
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

const formatTimestamp = (timestamp?: bigint) => {
  if (!timestamp) return "Unknown";
  const seconds = Number(timestamp);
  if (!Number.isFinite(seconds) || seconds === 0) return "Not scheduled";
  return new Date(seconds * 1000).toLocaleString();
};

const VotingDetail = () => {
  const { votingId: votingIdParam } = useParams<{ votingId: string }>();
  const votingId = votingIdParam !== undefined ? Number(votingIdParam) : NaN;

  if (!Number.isInteger(votingId) || votingId < 0) {
    return <Navigate to="/voting" replace />;
  }

  const { isConnected } = useAccount();
  const { config, status, totalVoters, hasVoted, refetchAll } = useVotingDetails(votingId);
  const { options, isLoading: optionsLoading, error: optionsError } = useVotingOptions(votingId);
  const { castVote, isVoting } = useCastVote();

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const configData = useMemo(() => {
    if (!config) return null;
    if (Array.isArray(config)) {
      return {
        name: config[0] as string,
        description: config[1] as string,
        voteType: Number(config[2]),
        startTime: config[3] as bigint,
        endTime: config[4] as bigint,
        quorum: config[5] as bigint,
        whitelistEnabled: Boolean(config[6]),
        maxVotersCount: Number(config[7]),
      };
    }
    return {
      name: config.name as string,
      description: config.description as string,
      voteType: Number(config.voteType),
      startTime: config.startTime as bigint,
      endTime: config.endTime as bigint,
      quorum: config.quorum as bigint,
      whitelistEnabled: Boolean(config.whitelistEnabled),
      maxVotersCount: Number(config.maxVotersCount),
    };
  }, [config]);

  const statusMeta = getStatusLabel(status);
  const isActive = status === VotingStatus.Active;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isConnected) {
      toast.error("Please connect your wallet first.");
      return;
    }

    if (selectedOption === null) {
      toast.error("Select an option before casting your vote.");
      return;
    }

    if (!isActive) {
      toast.error("This voting session is not currently active.");
      return;
    }

    if (hasVoted) {
      toast.error("You have already voted in this session.");
      return;
    }

    try {
      setIsSubmitting(true);
      const txHash = await castVote(votingId, selectedOption);
      toast.success("Vote submitted! Your encrypted vote has been recorded.", {
        action: {
          label: "View Tx",
          onClick: () => window.open(`https://sepolia.etherscan.io/tx/${txHash}`, "_blank", "noopener,noreferrer"),
        },
      });
      setSelectedOption(null);
      refetchAll();
    } catch (error: any) {
      console.error("Failed to cast vote:", error);
      toast.error(error?.shortMessage || error?.message || "Failed to cast encrypted vote.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />

      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <Link to="/voting" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to votings
          </Link>
          {!isConnected && (
            <div className="hidden sm:block">
              <ConnectButton />
            </div>
          )}
        </div>

        <Card className="p-8 shadow-lg">
          {!configData ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center">
                      <ShieldCheck className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Voting #{votingId}</p>
                      <h1 className="text-2xl font-bold tracking-tight">{configData.name}</h1>
                    </div>
                  </div>
                  <p className="text-muted-foreground max-w-2xl">{configData.description}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${statusMeta.className}`}>
                    {statusMeta.label}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
                    {getVoteTypeLabel(configData.voteType)}
                  </span>
                  {hasVoted && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                      <CheckCircle2 className="h-3 w-3" />
                      Already voted
                    </span>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Voting window</p>
                    <p className="text-sm">
                      <span className="font-medium">Start:</span> {formatTimestamp(configData.startTime)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">End:</span> {formatTimestamp(configData.endTime)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                  <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Quorum & participation</p>
                    <p className="text-sm">
                      <span className="font-medium">Quorum:</span> {configData.quorum.toString()}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Participants:</span> {totalVoters}/{configData.maxVotersCount || "∞"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Cast your encrypted vote</h2>
              <p className="text-sm text-muted-foreground">Only one option can be selected. Votes remain encrypted on-chain.</p>
            </div>
            {!isConnected && (
              <div className="sm:hidden">
                <ConnectButton />
              </div>
            )}
          </div>

          {optionsError && (
            <div className="mb-6 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              Failed to load voting options. {optionsError.message}
            </div>
          )}

          {optionsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : options.length === 0 ? (
            <div className="rounded-lg border border-dashed border-muted-foreground/40 py-12 text-center text-muted-foreground">
              No options configured for this voting session.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <RadioGroup
                value={selectedOption !== null ? selectedOption.toString() : ""}
                onValueChange={(value) => setSelectedOption(Number(value))}
                className="space-y-4"
              >
                {options.map((option) => (
                  <div
                    key={option.index}
                    className={`group relative flex items-start gap-4 rounded-lg border border-border p-4 transition hover:border-primary ${
                      selectedOption === option.index ? "border-primary shadow-sm" : ""
                    } ${!option.active ? "opacity-60" : ""}`}
                  >
                    <RadioGroupItem
                      value={option.index.toString()}
                      id={`option-${option.index}`}
                      disabled={!option.active || hasVoted || !isActive || !isConnected}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor={`option-${option.index}`} className="text-base font-medium">
                        {option.name}
                      </Label>
                      {option.description && (
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Lock className="h-3 w-3" />
                        Encrypted tally: hidden via FHE
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  {hasVoted
                    ? "You have already submitted an encrypted vote for this session."
                    : isActive
                    ? "Your selection will be encrypted locally before being sent on-chain."
                    : "Voting is not open right now."}
                </div>
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-gradient-primary shadow-primary"
                  disabled={
                    selectedOption === null ||
                    isSubmitting ||
                    isVoting ||
                    !isConnected ||
                    hasVoted ||
                    !isActive
                  }
                >
                  {isSubmitting || isVoting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Encrypting & submitting
                    </>
                  ) : (
                    "Cast Vote"
                  )}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default VotingDetail;
