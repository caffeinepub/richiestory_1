import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Clock, Gavel } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { sampleBids, sampleRabbits } from "../data/sampleData";

const auctionPets = sampleRabbits.filter((r) => r.status === "auction");

function Countdown({ end }: { end: Date }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = end.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Ended");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [end]);

  return <span>{timeLeft}</span>;
}

export default function Auction() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const selected = auctionPets.find((r) => r.id === selectedId);

  return (
    <main className="container mx-auto px-6 max-w-7xl py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-extrabold text-foreground mb-2">
          Auction
        </h1>
        <p className="text-muted-foreground mb-8">
          Place bids on unique collectible pets
        </p>

        {auctionPets.length === 0 ? (
          <div
            className="text-center py-24 text-muted-foreground"
            data-ocid="auction.empty_state"
          >
            <p className="text-5xl mb-4">🏷️</p>
            <p className="font-semibold text-lg">No active auctions</p>
            <p className="text-sm mt-1">Check back soon</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {auctionPets.map((pet, i) => (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden group"
                data-ocid={`auction.item.${i + 1}`}
              >
                <div
                  className={`h-52 overflow-hidden ${pet.rarity === "unique" ? "bg-gradient-to-br from-yellow-50 to-amber-100" : "blush-light-bg"}`}
                >
                  {pet.image ? (
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center opacity-30">
                      <Gavel className="w-16 h-16 text-foreground" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground">
                        {pet.id}
                      </p>
                      <h3 className="font-bold text-foreground">{pet.name}</h3>
                    </div>
                    {pet.rarity === "unique" && (
                      <span className="gold-bg text-white text-xs font-bold px-2 py-1 rounded-full">
                        ★
                      </span>
                    )}
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3 mb-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Current bid</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />{" "}
                        <Countdown end={pet.auctionEnds!} />
                      </span>
                    </div>
                    <p className="text-xl font-extrabold gold-text">
                      {pet.currentBid?.toLocaleString()} credits
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 rounded-full font-bold gold-bg text-white hover:opacity-90"
                      onClick={() => setSelectedId(pet.id)}
                      data-ocid={`auction.item.button.${i + 1}`}
                    >
                      <Gavel className="w-3.5 h-3.5 mr-1" /> Place Bid
                    </Button>
                    <Link to="/pet/$id" params={{ id: pet.id }}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full font-semibold"
                        data-ocid={`auction.item.button.${i + 1}`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <Dialog
        open={!!selectedId}
        onOpenChange={(o) => !o && setSelectedId(null)}
      >
        <DialogContent
          className="rounded-3xl max-w-md"
          data-ocid="auction.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold">
              Place Bid
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-muted/50 rounded-2xl p-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  {selected.image ? (
                    <img
                      src={selected.image}
                      alt={selected.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/20 flex items-center justify-center text-xl">
                      🐾
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-foreground">{selected.name}</p>
                  <p className="text-xs text-muted-foreground">{selected.id}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Current bid:{" "}
                  <strong className="gold-text">
                    {selected.currentBid?.toLocaleString()} credits
                  </strong>
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  Minimum bid:{" "}
                  {((selected.currentBid || 0) + 100).toLocaleString()} credits
                </p>
                <input
                  type="number"
                  placeholder={`Minimum ${((selected.currentBid || 0) + 100).toLocaleString()} credits`}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full rounded-2xl border border-border px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  data-ocid="auction.input"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-2">
                  Bid history:
                </p>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {(sampleBids[selected.id] || [])
                    .slice()
                    .reverse()
                    .map((bid) => (
                      <div
                        key={bid.bidder + bid.timestamp}
                        className="flex justify-between items-center text-xs py-1.5 px-3 bg-muted/40 rounded-xl"
                      >
                        <span className="font-semibold text-foreground">
                          {bid.bidder}
                        </span>
                        <span className="gold-text font-bold">
                          {bid.amount.toLocaleString()} credits
                        </span>
                        <span className="text-muted-foreground">
                          {bid.timestamp}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-full"
                  onClick={() => setSelectedId(null)}
                  data-ocid="auction.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 rounded-full font-bold gold-bg text-white hover:opacity-90"
                  onClick={() => {
                    toast.success("Bid placed!");
                    setSelectedId(null);
                    setBidAmount("");
                  }}
                  data-ocid="auction.confirm_button"
                >
                  Confirm bid
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
