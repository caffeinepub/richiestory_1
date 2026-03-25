import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Clock,
  Gavel,
  Heart,
  QrCode,
  Star,
  Tag,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RabbitStatus, Rarity } from "../backend.d";
import { PetCard } from "../components/PetCard";
import { sampleRabbits } from "../data/sampleData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useActivateRabbit } from "../hooks/useQueries";

function QRCodeImage({ value, size = 200 }: { value: string; size?: number }) {
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&bgcolor=ffffff&color=2d2d2d&margin=2`;
  return (
    <img
      src={url}
      alt="QR Code"
      width={size}
      height={size}
      className="rounded-xl border border-border shadow-xs"
      loading="lazy"
    />
  );
}

export default function PetDetail() {
  const { id } = useParams({ from: "/pet/$id" });
  let showActivate = false;
  try {
    showActivate =
      new URLSearchParams(window.location.search).get("activate") === "true" ||
      new URLSearchParams(window.location.hash.split("?")[1] || "").get(
        "activate",
      ) === "true";
  } catch {
    showActivate = false;
  }

  const pet = sampleRabbits.find((r) => r.id === id);
  const similar = sampleRabbits
    .filter((r) => r.id !== id && r.rarity === pet?.rarity)
    .slice(0, 3);

  const [liked, setLiked] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [activationOpen, setActivationOpen] = useState(showActivate);
  const [collectorIdInput, setCollectorIdInput] = useState("");
  const activateRabbit = useActivateRabbit();
  const { identity } = useInternetIdentity();

  useEffect(() => {
    if (showActivate) setActivationOpen(true);
  }, [showActivate]);

  const qrValue = `${window.location.origin}${window.location.pathname.includes("#") ? "" : "/#"}/#/pet/${id}?activate=true`;

  if (!pet) {
    return (
      <main className="container mx-auto px-6 max-w-7xl py-20 text-center">
        <p className="text-5xl mb-4">🐾</p>
        <h1 className="text-2xl font-extrabold text-foreground mb-2">
          Pet not found
        </h1>
        <Link to="/catalog">
          <Button
            className="rounded-full mt-4"
            data-ocid="rabbit.secondary_button"
          >
            Back to catalog
          </Button>
        </Link>
      </main>
    );
  }

  const isUnique = pet.rarity === Rarity.unique;
  const isRare = pet.rarity === Rarity.rare;

  const rarityLabel = {
    [Rarity.common]: "Common",
    [Rarity.rare]: "Rare",
    [Rarity.unique]: "Unique",
  };
  const statusLabel = {
    [RabbitStatus.in_collection]: "In collection",
    [RabbitStatus.for_sale]: "For sale",
    [RabbitStatus.auction]: "On auction",
    [RabbitStatus.pending_activation]: "Not activated",
  };

  const ownershipHistory = [
    { event: "Created", date: pet.birthDate, actor: "RichieStory Studio" },
    ...(pet.owner
      ? [{ event: "Activated", date: "2024-06-01", actor: pet.owner }]
      : []),
  ];

  const handleActivate = async () => {
    if (!collectorIdInput.trim()) {
      toast.error("Enter your collector ID");
      return;
    }
    try {
      await activateRabbit.mutateAsync({
        rabbitId: id,
        collectorId: collectorIdInput.trim(),
      });
      toast.success(`Pet ${pet.name} activated!`);
      setActivationOpen(false);
      setCollectorIdInput("");
    } catch {
      toast.error("Activation failed. Please try again.");
    }
  };

  return (
    <main className="container mx-auto px-6 max-w-7xl py-10">
      {/* Activation Modal */}
      <Dialog open={activationOpen} onOpenChange={setActivationOpen}>
        <DialogContent
          className="rounded-3xl max-w-md"
          data-ocid="rabbit.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-foreground">
              🐾 Activate pet
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              You scanned the QR code of <strong>{pet.name}</strong> ({pet.id}).
              Enter your collector ID to register ownership.
            </p>
            {identity ? (
              <>
                <Label
                  htmlFor="collectorId"
                  className="text-sm font-semibold mb-1.5 block"
                >
                  Collector ID
                </Label>
                <Input
                  id="collectorId"
                  value={collectorIdInput}
                  onChange={(e) => setCollectorIdInput(e.target.value)}
                  placeholder="Your nickname or ID"
                  className="rounded-xl"
                  data-ocid="rabbit.input"
                />
              </>
            ) : (
              <p className="text-sm text-destructive font-semibold">
                ⚠️ Sign in to activate this pet
              </p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setActivationOpen(false)}
              className="rounded-full"
              data-ocid="rabbit.cancel_button"
            >
              Cancel
            </Button>
            {identity && (
              <Button
                onClick={handleActivate}
                disabled={activateRabbit.isPending}
                className="rounded-full font-bold bg-primary text-primary-foreground"
                data-ocid="rabbit.confirm_button"
              >
                {activateRabbit.isPending ? "Activating..." : "Activate"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Link
        to="/catalog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
        data-ocid="rabbit.link"
      >
        <ArrowLeft className="w-4 h-4" /> Back to catalog
      </Link>

      <div className="grid md:grid-cols-2 gap-10 mb-16">
        {/* Left - Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className={`rounded-3xl overflow-hidden border-2 shadow-hover ${
              isUnique ? "border-gold" : "border-border"
            } ${
              isUnique
                ? "bg-gradient-to-br from-yellow-50 to-amber-100"
                : isRare
                  ? "blush-light-bg"
                  : "mint-light-bg"
            }`}
          >
            {pet.image ? (
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full object-cover"
              />
            ) : (
              <div className="h-80 flex items-center justify-center">
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 80 80"
                  fill="none"
                  className="text-foreground opacity-30"
                >
                  <title>Pet</title>
                  <circle cx="40" cy="44" r="20" fill="currentColor" />
                  <circle
                    cx="28"
                    cy="26"
                    r="9"
                    fill="currentColor"
                    opacity="0.8"
                  />
                  <circle
                    cx="52"
                    cy="26"
                    r="9"
                    fill="currentColor"
                    opacity="0.8"
                  />
                  <circle cx="35" cy="42" r="3" fill="white" />
                  <circle cx="45" cy="42" r="3" fill="white" />
                  <ellipse
                    cx="40"
                    cy="50"
                    rx="5"
                    ry="3"
                    fill="white"
                    opacity="0.7"
                  />
                </svg>
              </div>
            )}
          </div>

          {isUnique && (
            <div className="mt-4 gold-bg/10 border gold-border rounded-2xl p-4 flex items-center gap-3">
              <Star className="w-5 h-5 gold-text" />
              <p className="text-sm font-semibold text-foreground">
                Unique specimen — one of a kind
              </p>
            </div>
          )}

          {/* QR code section */}
          <div className="mt-4 bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-sm text-foreground">
                  Passport QR Code
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs gap-1"
                onClick={() => setShowQR(!showQR)}
                data-ocid="rabbit.toggle"
              >
                {showQR ? "Hide" : "Show"}
              </Button>
            </div>
            {showQR && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3"
              >
                <QRCodeImage value={qrValue} size={200} />
                <p className="text-xs text-muted-foreground text-center">
                  Scan to view and activate
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full text-xs"
                  onClick={() => setActivationOpen(true)}
                  data-ocid="rabbit.open_modal_button"
                >
                  🐾 Activate pet
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Right - Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {pet.id}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  isUnique
                    ? "gold-bg text-white"
                    : isRare
                      ? "bg-secondary text-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {rarityLabel[pet.rarity]}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-foreground mb-1">
              {pet.name}
            </h1>
            <p className="text-muted-foreground">{pet.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { label: "Birth Date", value: pet.birthDate, icon: Clock },
              { label: "Status", value: statusLabel[pet.status], icon: Tag },
              { label: "Owner", value: pet.owner || "—", icon: User },
              { label: "Likes", value: String(pet.likes), icon: Heart },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-card rounded-2xl border border-border p-4"
              >
                <div className="flex items-center gap-2 mb-1">
                  <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {item.label}
                  </span>
                </div>
                <p className="font-bold text-sm text-foreground truncate">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {(pet.series ||
            pet.year ||
            pet.character ||
            pet.collectionNumber) && (
            <div className="bg-card rounded-2xl border border-border p-4 mb-6">
              <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">
                Digital Passport
              </p>
              <div className="grid grid-cols-2 gap-2">
                {pet.series && (
                  <div>
                    <p className="text-xs text-muted-foreground">Series</p>
                    <p className="font-bold text-sm text-foreground">
                      {pet.series}
                    </p>
                  </div>
                )}
                {pet.year && (
                  <div>
                    <p className="text-xs text-muted-foreground">Year</p>
                    <p className="font-bold text-sm text-foreground">
                      {pet.year}
                    </p>
                  </div>
                )}
                {pet.collectionNumber && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Collection #
                    </p>
                    <p className="font-bold text-sm text-foreground">
                      #{pet.collectionNumber}
                    </p>
                  </div>
                )}
                {pet.character && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Personality</p>
                    <p className="font-bold text-sm text-foreground">
                      {pet.character}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-card rounded-2xl border border-border p-4 mb-6">
            <p className="text-xs text-muted-foreground mb-1">
              Materials &amp; traits
            </p>
            <p className="text-sm font-semibold text-foreground">
              {pet.materials}
            </p>
          </div>

          {pet.status === RabbitStatus.for_sale && pet.price && (
            <div className="bg-primary/10 rounded-2xl border border-primary/30 p-4 mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Sale price</p>
                <p className="text-2xl font-extrabold text-foreground">
                  {pet.price.toLocaleString()} credits
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  100% to seller
                </p>
              </div>
              <Button
                className="rounded-full font-bold bg-primary text-primary-foreground"
                onClick={() => toast.success("Purchase complete!")}
                data-ocid="rabbit.primary_button"
              >
                <Tag className="w-4 h-4 mr-2" /> Buy
              </Button>
            </div>
          )}

          {pet.status === RabbitStatus.auction && (
            <div className="bg-secondary/30 rounded-2xl border border-secondary/60 p-4 mb-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Current bid</p>
                  <p className="text-2xl font-extrabold gold-text">
                    {pet.currentBid?.toLocaleString()} credits
                  </p>
                </div>
                {pet.auctionEnds && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Time left</p>
                    <p className="text-sm font-bold text-foreground">
                      {Math.max(
                        0,
                        Math.ceil(
                          (pet.auctionEnds.getTime() - Date.now()) /
                            (1000 * 60 * 60),
                        ),
                      )}{" "}
                      h.
                    </p>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Winner gets 95%, 5% platform commission
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Your bid (credits)"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="flex-1 rounded-full border border-border px-4 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                  data-ocid="rabbit.input"
                />
                <Button
                  onClick={() => {
                    toast.success("Bid placed!");
                    setBidAmount("");
                  }}
                  className="rounded-full font-bold gold-bg text-white hover:opacity-90"
                  data-ocid="rabbit.primary_button"
                >
                  <Gavel className="w-4 h-4 mr-2" /> Bid
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              className={`rounded-full font-semibold gap-2 ${liked ? "border-red-300 text-red-400" : ""}`}
              onClick={() => {
                setLiked(!liked);
                toast.success(
                  liked ? "Removed from favorites" : "Added to favorites",
                );
              }}
              data-ocid="rabbit.secondary_button"
            >
              <Heart
                className={`w-4 h-4 ${liked ? "fill-red-400 text-red-400" : ""}`}
              />
              {liked ? "Favorited" : "Favorite"}
            </Button>
          </div>

          <div className="mt-6">
            <h3 className="font-bold text-sm text-foreground mb-3">
              Ownership history
            </h3>
            <div className="space-y-2">
              {ownershipHistory.map((h) => (
                <div
                  key={h.event + h.date}
                  className="flex items-center gap-3 text-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="text-muted-foreground">{h.date}</span>
                  <span className="font-semibold text-foreground">
                    {h.event}
                  </span>
                  <span className="text-muted-foreground truncate">
                    — {h.actor}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {similar.length > 0 && (
        <section>
          <h2 className="text-xl font-extrabold text-foreground mb-6">
            Similar pets
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {similar.map((r, i) => (
              <PetCard key={r.id} rabbit={r} index={i + 1} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
