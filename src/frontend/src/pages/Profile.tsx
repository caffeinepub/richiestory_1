import { Button } from "@/components/ui/button";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  Calendar,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { PetCard } from "../components/PetCard";
import { sampleCollectors, sampleRabbits } from "../data/sampleData";

export default function Profile() {
  const { id } = useParams({ from: "/profile/$id" });
  const collector = sampleCollectors.find((c) => c.id === id);
  const pets = sampleRabbits.filter((r) => r.owner === id);

  if (!collector) {
    return (
      <main className="container mx-auto px-6 max-w-7xl py-20 text-center">
        <p className="text-5xl mb-4">👤</p>
        <h1 className="text-2xl font-extrabold text-foreground mb-2">
          Collector not found
        </h1>
        <Link to="/collectors">
          <Button
            className="rounded-full mt-4"
            data-ocid="profile.secondary_button"
          >
            Back to Collectors
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 max-w-7xl py-10">
      <Link
        to="/collectors"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-card rounded-3xl border border-border shadow-card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-extrabold text-foreground">
                {collector.nickname[0].toUpperCase()}
              </div>
              {collector.achievements.includes("Top-1 collector") && (
                <div className="absolute -top-1 -right-1 gold-bg w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  ★
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold text-foreground mb-1">
                {collector.nickname}
              </h1>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {collector.city}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Since {collector.joinDate}
                </span>
                <span className="flex items-center gap-1 font-bold text-foreground">
                  🐾 {collector.rabbitsCollected} pets
                </span>
              </div>
            </div>
            <Button
              className="rounded-full font-semibold bg-primary text-primary-foreground gap-2"
              onClick={() => toast.info("Messaging coming soon")}
              data-ocid="profile.primary_button"
            >
              <MessageCircle className="w-4 h-4" /> Message
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {collector.achievements.map((a) => (
              <span
                key={a}
                className="flex items-center gap-1.5 text-xs font-semibold bg-primary/15 text-foreground px-3 py-1.5 rounded-full"
              >
                <Award className="w-3.5 h-3.5 gold-text" /> {a}
              </span>
            ))}
          </div>
        </div>

        <h2 className="text-xl font-extrabold text-foreground mb-5">
          Pet Collection ({pets.length})
        </h2>
        {pets.length === 0 ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="profile.empty_state"
          >
            <p className="text-4xl mb-3">🐾</p>
            <p className="font-semibold">No pets added yet</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pets.map((r, i) => (
              <PetCard key={r.id} rabbit={r} index={i + 1} />
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}
