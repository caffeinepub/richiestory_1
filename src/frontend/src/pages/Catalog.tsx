import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { RabbitStatus, Rarity } from "../backend.d";
import { PetCard } from "../components/PetCard";
import { sampleRabbits } from "../data/sampleData";

const rarityOptions = [
  { label: "All", value: "all" },
  { label: "Common", value: Rarity.common },
  { label: "Rare", value: Rarity.rare },
  { label: "Unique", value: Rarity.unique },
];

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "For sale", value: RabbitStatus.for_sale },
  { label: "On auction", value: RabbitStatus.auction },
  { label: "In collection", value: RabbitStatus.in_collection },
];

export default function Catalog() {
  const [search, setSearch] = useState("");
  const [rarity, setRarity] = useState("all");
  const [status, setStatus] = useState("all");

  const hasFilters = search !== "" || rarity !== "all" || status !== "all";

  const filtered = sampleRabbits.filter((r) => {
    const matchSearch =
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchRarity = rarity === "all" || r.rarity === rarity;
    const matchStatus = status === "all" || r.status === status;
    return matchSearch && matchRarity && matchStatus;
  });

  return (
    <main className="container mx-auto px-6 max-w-7xl py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-extrabold text-foreground mb-2">
          Pet Catalog
        </h1>
        <p className="text-muted-foreground mb-8">
          All collectible pets with digital passports
        </p>

        {/* Filters */}
        <div className="bg-card rounded-2xl border border-border p-5 mb-8 shadow-xs">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-full"
                data-ocid="catalog.search_input"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              {rarityOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setRarity(opt.value)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                    rarity === opt.value
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted text-muted-foreground hover:bg-primary/20"
                  }`}
                  data-ocid="catalog.tab"
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {statusOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setStatus(opt.value)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                    status === opt.value
                      ? "bg-secondary text-foreground shadow-xs"
                      : "bg-muted text-muted-foreground hover:bg-secondary/40"
                  }`}
                  data-ocid="catalog.tab"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div
            className="text-center py-20 text-muted-foreground"
            data-ocid="catalog.empty_state"
          >
            <p className="text-5xl mb-4">🐾</p>
            {hasFilters ? (
              <>
                <p className="font-semibold">No pets found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-lg">Catalog is empty</p>
                <p className="text-sm mt-1">
                  First pets will appear once the admin adds them
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((pet, i) => (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <PetCard rabbit={pet} index={i + 1} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}
