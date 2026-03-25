import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Check,
  Edit3,
  Gavel,
  QrCode,
  Tag,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { RabbitStatus, Rarity } from "../backend.d";
import { sampleRabbits } from "../data/sampleData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const myPets = sampleRabbits.filter((r) => r.owner === "bunny_lover_msk");

const rarityLabel: Record<Rarity, string> = {
  [Rarity.common]: "Common",
  [Rarity.rare]: "Rare",
  [Rarity.unique]: "Unique",
};

const INITIAL_BALANCE = 15000;

export default function Dashboard() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;
  const [activationCode, setActivationCode] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [balance, _setBalance] = useState(INITIAL_BALANCE);
  const [names, setNames] = useState<Record<string, string>>(
    Object.fromEntries(myPets.map((r) => [r.id, r.name])),
  );
  const [prices, setPrices] = useState<Record<string, string>>({});

  const transactions = [
    {
      type: "credit",
      desc: "Sale PET-004 (first sale)",
      amount: 1800,
      date: "Jun 15, 2025",
    },
    {
      type: "debit",
      desc: "Purchase PET-006",
      amount: -2400,
      date: "Jun 12, 2025",
    },
    {
      type: "credit",
      desc: "Auction PET-002 (95% of 3,500 credits)",
      amount: 3325,
      date: "Jun 5, 2025",
    },
  ];

  if (!isLoggedIn) {
    return (
      <main className="container mx-auto px-6 max-w-7xl py-20 text-center">
        <p className="text-6xl mb-4">🔒</p>
        <h1 className="text-2xl font-extrabold text-foreground mb-3">
          Sign in
        </h1>
        <p className="text-muted-foreground mb-6">
          Please sign in to access your dashboard
        </p>
        <Button
          className="rounded-full font-bold bg-primary text-primary-foreground"
          onClick={() => login()}
          data-ocid="dashboard.primary_button"
        >
          Sign in
        </Button>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 max-w-7xl py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-extrabold text-foreground mb-2">
          My Dashboard
        </h1>
        <p className="text-muted-foreground mb-8">Manage your collection</p>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-2xl border border-border shadow-card p-6 sm:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground">
                Virtual balance
              </p>
            </div>
            <p
              className="text-3xl font-extrabold text-foreground"
              data-ocid="dashboard.panel"
            >
              {balance.toLocaleString()}{" "}
              <span className="text-lg text-muted-foreground">credits</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Simulated internal currency
            </p>
          </div>
          <div className="bg-card rounded-2xl border border-border shadow-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center">
                <span className="text-xl">🐾</span>
              </div>
              <p className="text-sm font-semibold text-muted-foreground">
                Pets in collection
              </p>
            </div>
            <p className="text-3xl font-extrabold text-foreground">
              {myPets.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Active and for sale
            </p>
          </div>
          <div className="bg-card rounded-2xl border border-border shadow-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full gold-bg/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 gold-text" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground">
                Transactions
              </p>
            </div>
            <p className="text-3xl font-extrabold text-foreground">
              {transactions.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Purchases and sales
            </p>
          </div>
        </div>

        <Tabs defaultValue="pets">
          <TabsList
            className="rounded-full mb-8 bg-muted"
            data-ocid="dashboard.tab"
          >
            <TabsTrigger
              value="pets"
              className="rounded-full font-semibold"
              data-ocid="dashboard.tab"
            >
              🐾 My Pets
            </TabsTrigger>
            <TabsTrigger
              value="wallet"
              className="rounded-full font-semibold"
              data-ocid="dashboard.tab"
            >
              💰 Wallet
            </TabsTrigger>
            <TabsTrigger
              value="activate"
              className="rounded-full font-semibold"
              data-ocid="dashboard.tab"
            >
              📱 Activate
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="rounded-full font-semibold"
              data-ocid="dashboard.tab"
            >
              🔔 Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pets">
            <div className="space-y-4">
              {myPets.length === 0 ? (
                <div
                  className="text-center py-16 text-muted-foreground"
                  data-ocid="dashboard.empty_state"
                >
                  <p className="text-5xl mb-3">🐾</p>
                  <p className="font-semibold">You have no pets yet</p>
                  <p className="text-sm mt-1">Activate a pet with a QR code</p>
                </div>
              ) : (
                myPets.map((pet, i) => (
                  <motion.div
                    key={pet.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card rounded-2xl border border-border shadow-card p-6"
                    data-ocid={`dashboard.item.${i + 1}`}
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 mint-light-bg flex items-center justify-center">
                        {pet.image ? (
                          <img
                            src={pet.image}
                            alt={pet.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-4xl">🐾</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-bold text-muted-foreground">
                            {pet.id}
                          </span>
                          <span className="text-xs font-bold bg-primary/20 text-foreground px-2 py-0.5 rounded-full">
                            {rarityLabel[pet.rarity]}
                          </span>
                        </div>
                        {editingId === pet.id ? (
                          <div className="space-y-2 mb-3">
                            <Input
                              value={names[pet.id] || ""}
                              onChange={(e) =>
                                setNames((prev) => ({
                                  ...prev,
                                  [pet.id]: e.target.value,
                                }))
                              }
                              placeholder="Pet name"
                              className="rounded-xl"
                              data-ocid={`dashboard.input.${i + 1}`}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="rounded-full font-semibold bg-primary text-primary-foreground"
                                onClick={() => {
                                  setEditingId(null);
                                  toast.success("Name updated!");
                                }}
                                data-ocid={`dashboard.save_button.${i + 1}`}
                              >
                                <Check className="w-3.5 h-3.5 mr-1" /> Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full"
                                onClick={() => setEditingId(null)}
                                data-ocid={`dashboard.cancel_button.${i + 1}`}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 mb-3">
                            <h3 className="font-extrabold text-foreground text-lg">
                              {names[pet.id] || pet.name}
                            </h3>
                            <button
                              type="button"
                              onClick={() => setEditingId(pet.id)}
                              className="text-muted-foreground hover:text-primary transition-colors"
                              data-ocid={`dashboard.edit_button.${i + 1}`}
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {pet.status !== RabbitStatus.for_sale && (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                placeholder="Price (credits)"
                                value={prices[pet.id] || ""}
                                onChange={(e) =>
                                  setPrices((prev) => ({
                                    ...prev,
                                    [pet.id]: e.target.value,
                                  }))
                                }
                                className="w-32 rounded-full text-sm h-8"
                                data-ocid={`dashboard.input.${i + 1}`}
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full font-semibold gap-1 h-8 text-xs"
                                onClick={() =>
                                  toast.success("Pet listed for sale!")
                                }
                                data-ocid={`dashboard.secondary_button.${i + 1}`}
                              >
                                <Tag className="w-3.5 h-3.5" /> List for sale
                              </Button>
                            </div>
                          )}
                          {pet.status !== RabbitStatus.auction && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full font-semibold gap-1 h-8 text-xs"
                              onClick={() => toast.success("Auction started!")}
                              data-ocid={`dashboard.secondary_button.${i + 1}`}
                            >
                              <Gavel className="w-3.5 h-3.5" /> Auction
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="wallet">
            <div className="max-w-lg">
              <div className="bg-card rounded-3xl border border-border shadow-card p-8 mb-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <Wallet className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Your balance
                    </p>
                    <p className="text-3xl font-extrabold text-foreground">
                      {balance.toLocaleString()} credits
                    </p>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-2xl p-4 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground mb-1">
                    How does the balance work?
                  </p>
                  <p>First sale: 100% to admin</p>
                  <p>Secondary sale: 95% to seller, 5% platform fee</p>
                </div>
              </div>
              <h3 className="font-bold text-foreground mb-4">
                Transaction history
              </h3>
              <div className="space-y-3" data-ocid="dashboard.list">
                {transactions.map((tx, i) => (
                  <div
                    key={tx.date + tx.desc}
                    className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4"
                    data-ocid={`dashboard.item.${i + 1}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-400"}`}
                    >
                      {tx.type === "credit" ? "+" : "−"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {tx.desc}
                      </p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                    <p
                      className={`font-bold text-sm ${tx.type === "credit" ? "text-green-600" : "text-red-400"}`}
                    >
                      {tx.type === "credit" ? "+" : ""}
                      {tx.amount.toLocaleString()} credits
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activate">
            <div className="max-w-md">
              <div className="bg-card rounded-3xl border border-border shadow-card p-8">
                <div className="text-center mb-6">
                  <QrCode className="w-16 h-16 text-primary mx-auto mb-3" />
                  <h2 className="text-xl font-extrabold text-foreground">
                    Activate a Pet
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter the unique code from the package or scan the QR code
                  </p>
                </div>
                <div className="space-y-4">
                  <Input
                    placeholder="RICHIE-XXXXXXXX"
                    value={activationCode}
                    onChange={(e) =>
                      setActivationCode(e.target.value.toUpperCase())
                    }
                    className="rounded-full text-center font-mono text-lg"
                    data-ocid="dashboard.input"
                  />
                  <Button
                    className="w-full rounded-full font-bold bg-primary text-primary-foreground"
                    onClick={() => {
                      if (!activationCode) {
                        toast.error("Enter a code");
                        return;
                      }
                      toast.success("Pet activated successfully!");
                      setActivationCode("");
                    }}
                    data-ocid="dashboard.primary_button"
                  >
                    Activate
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="space-y-3">
              {[
                {
                  text: "Your bid on PET-005 was outbid — new bid is 5,500 credits",
                  time: "2 hours ago",
                  type: "bid",
                },
                {
                  text: "PET-003 is now on auction — current bid 12,000 credits",
                  time: "5 hours ago",
                  type: "auction",
                },
                {
                  text: "New message from collector_spb",
                  time: "1 day ago",
                  type: "message",
                },
              ].map((n, i) => (
                <div
                  key={n.time}
                  className="bg-card rounded-2xl border border-border shadow-xs p-4 flex items-start gap-3"
                  data-ocid={`dashboard.item.${i + 1}`}
                >
                  <Bell className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {n.text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {n.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  );
}
