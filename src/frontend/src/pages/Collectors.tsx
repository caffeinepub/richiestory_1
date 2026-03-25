import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { Award, MapPin, Search, Trophy, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { sampleCollectors } from "../data/sampleData";

export default function Collectors() {
  const [search, setSearch] = useState("");

  const filtered = sampleCollectors.filter(
    (c) =>
      !search ||
      c.nickname.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase()),
  );

  const sorted = [...filtered].sort(
    (a, b) => b.rabbitsCollected - a.rabbitsCollected,
  );

  const topThree = [...sampleCollectors]
    .sort((a, b) => b.rabbitsCollected - a.rabbitsCollected)
    .slice(0, 3);

  return (
    <main className="container mx-auto px-6 max-w-7xl py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-extrabold text-foreground mb-2">
          Collectors
        </h1>
        <p className="text-muted-foreground mb-8">
          Community of unique collectible pet enthusiasts
        </p>

        <div className="relative max-w-md mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by nickname or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-full"
            data-ocid="collectors.search_input"
          />
        </div>

        {sampleCollectors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="collectors.empty_state"
          >
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-xl font-extrabold text-foreground mb-2">
              No collectors yet
            </h2>
            <p className="text-muted-foreground">Be the first to register!</p>
          </motion.div>
        ) : (
          <>
            {topThree.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-extrabold text-foreground mb-5 flex items-center gap-2">
                  <Trophy className="w-5 h-5 gold-text" /> Collector Rankings
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {topThree.map((c, i) => (
                    <Link key={c.id} to="/profile/$id" params={{ id: c.id }}>
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`bg-card rounded-2xl border shadow-card hover:shadow-hover transition-all duration-300 p-6 text-center cursor-pointer ${
                          i === 0 ? "border-gold" : "border-border"
                        }`}
                        data-ocid={`collectors.item.${i + 1}`}
                      >
                        <div className="relative inline-block mb-3">
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-extrabold mx-auto ${
                              i === 0
                                ? "bg-gradient-to-br from-yellow-100 to-amber-200 border-2 border-gold"
                                : i === 1
                                  ? "bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300"
                                  : "bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-300"
                            }`}
                          >
                            {c.nickname[0].toUpperCase()}
                          </div>
                          <div
                            className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                              i === 0
                                ? "gold-bg"
                                : i === 1
                                  ? "bg-gray-400"
                                  : "bg-orange-400"
                            }`}
                          >
                            {i + 1}
                          </div>
                        </div>
                        <p className="font-extrabold text-foreground">
                          {c.nickname}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" /> {c.city}
                        </p>
                        <p className="text-lg font-extrabold gold-text mt-2">
                          {c.rabbitsCollected}
                        </p>
                        <p className="text-xs text-muted-foreground">pets</p>
                        <div className="mt-3 flex flex-wrap gap-1 justify-center">
                          {c.achievements.slice(0, 2).map((a) => (
                            <span
                              key={a}
                              className="text-xs bg-primary/20 text-foreground px-2 py-0.5 rounded-full"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3" data-ocid="collectors.list">
              {sorted.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-12 text-center"
                  data-ocid="collectors.empty_state"
                >
                  <Users className="w-10 h-10 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">Nothing found</p>
                </div>
              ) : (
                sorted.map((c, i) => (
                  <Link key={c.id} to="/profile/$id" params={{ id: c.id }}>
                    <motion.div
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-card rounded-2xl border border-border shadow-xs hover:shadow-card transition-all duration-200 p-4 flex items-center gap-4 cursor-pointer"
                      data-ocid={`collectors.row.${i + 1}`}
                    >
                      <span className="text-sm font-bold text-muted-foreground w-6 text-center">
                        #{i + 1}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-extrabold text-foreground shrink-0">
                        {c.nickname[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground">
                          {c.nickname}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {c.city}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-extrabold text-foreground">
                          {c.rabbitsCollected}{" "}
                          <span className="text-muted-foreground font-normal text-xs">
                            pets
                          </span>
                        </p>
                      </div>
                      {c.achievements.slice(0, 1).map((a) => (
                        <span
                          key={a}
                          className="hidden md:block text-xs bg-primary/20 text-foreground px-2 py-1 rounded-full"
                        >
                          <Award className="w-3 h-3 inline mr-1" />
                          {a}
                        </span>
                      ))}
                    </motion.div>
                  </Link>
                ))
              )}
            </div>
          </>
        )}
      </motion.div>
    </main>
  );
}
