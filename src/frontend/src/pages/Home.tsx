import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRightLeft,
  ChevronRight,
  GitBranch,
  Shield,
  Star,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { PetCard } from "../components/PetCard";
import { sampleCollectors, sampleRabbits } from "../data/sampleData";

const featuredPets = sampleRabbits.slice(0, 3);
const topCollectors = sampleCollectors.slice(0, 3);

const steps = [
  {
    icon: "🐾",
    title: "Find a pet",
    desc: "Choose a unique pet from the catalog — each has its own story",
  },
  {
    icon: "📱",
    title: "Activate QR code",
    desc: "Scan the QR code and link the pet to your account",
  },
  {
    icon: "📜",
    title: "Get the passport",
    desc: "A digital passport confirms authenticity and records history",
  },
  {
    icon: "🏆",
    title: "Build your collection",
    desc: "Trade, swap, join auctions and grow your collection",
  },
];

const passportFeatures = [
  { icon: Shield, label: "Authenticity", desc: "Every pet is verified" },
  { icon: GitBranch, label: "Ownership history", desc: "Full transfer log" },
  { icon: Users, label: "Community", desc: "Network of collectors" },
  { icon: ArrowRightLeft, label: "Transfer", desc: "Secure rights exchange" },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 30% 50%, oklch(0.89 0.055 195 / 0.35) 0%, oklch(0.96 0.02 55 / 0.25) 50%, oklch(0.97 0.008 75 / 0) 100%)",
          }}
        />
        <div className="container mx-auto px-6 max-w-7xl py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block bg-primary/30 text-foreground text-xs font-bold px-4 py-1.5 rounded-full mb-6">
                🐾 Collect your world of pets
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 text-foreground">
                Unique pets with a{" "}
                <span className="text-primary">digital soul.</span> Every
                specimen — <span className="gold-text">one of a kind</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-4 leading-relaxed">
                Collect, trade and cherish your pets. A digital passport
                confirms the authenticity of each one.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/80 border border-border rounded-2xl px-5 py-3 inline-flex mb-8 w-fit">
                <Star className="w-4 h-4 gold-text" />
                Platform ready for the first pets from the admin
              </div>
              <div className="flex gap-4 flex-wrap">
                <Link to="/catalog">
                  <Button
                    size="lg"
                    className="rounded-full font-bold bg-primary text-primary-foreground hover:bg-primary/80 shadow-card"
                    data-ocid="home.primary_button"
                  >
                    Browse catalog
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link to="/auction">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full font-bold border-2"
                    data-ocid="home.secondary_button"
                  >
                    Auction
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right — visual card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <div className="relative w-full max-w-sm mx-auto">
                <div className="rounded-3xl overflow-hidden shadow-hover border-2 border-border bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10 flex flex-col items-center justify-center py-20">
                  <span className="text-8xl mb-4">🐾</span>
                  <p className="text-lg font-bold text-foreground">
                    RichieStory
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Collector platform
                  </p>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-2xl p-3 shadow-card z-10 w-40">
                  <p className="text-xs font-bold text-primary mb-0.5">
                    🔐 Digital Passport
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    Each one unique
                  </p>
                  <p className="text-xs text-muted-foreground">Verified</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newest Arrivals */}
      {featuredPets.length > 0 && (
        <section className="container mx-auto px-6 max-w-7xl py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
              Latest arrivals
            </h2>
            <Link to="/catalog">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full font-semibold gap-1"
                data-ocid="home.secondary_button"
              >
                All pets <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredPets.map((pet, i) => (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <PetCard rabbit={pet} index={i + 1} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Creators + Top Collectors */}
      <section className="container mx-auto px-6 max-w-7xl py-10">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-card rounded-3xl border border-border p-8 shadow-card">
            <h2 className="text-2xl font-extrabold text-foreground mb-3">
              Meet the creators
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Every pet is an original work. Discover the stories behind the
              creators who pour their soul into each one.
            </p>
            <Link to="/collectors">
              <Button
                variant="outline"
                className="rounded-full font-semibold"
                data-ocid="home.secondary_button"
              >
                Learn more
              </Button>
            </Link>
          </div>

          <div className="bg-card rounded-3xl border border-border p-8 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-foreground">
                Top collectors
              </h2>
              <Link to="/collectors">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full font-semibold text-xs"
                  data-ocid="home.secondary_button"
                >
                  All
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {topCollectors.map((c, i) => (
                <Link key={c.id} to="/profile/$id" params={{ id: c.id }}>
                  <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-foreground font-bold text-sm">
                        {c.nickname[0].toUpperCase()}
                      </div>
                      {i === 0 && (
                        <div className="absolute -top-1 -right-1 gold-bg text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                          ★
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-foreground truncate">
                        {c.nickname}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {c.city} · {c.rabbitsCollected} pets
                      </p>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">
                      #{i + 1}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Passport Feature Band */}
      <section className="container mx-auto px-6 max-w-7xl py-10 mb-8">
        <div className="mint-light-bg rounded-3xl border border-primary/30 p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
              RichieStory Passports
            </h2>
            <p className="text-muted-foreground mt-2">
              A digital passport — the guarantee of authenticity and uniqueness
              of your pet
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {passportFeatures.map((f) => (
              <div
                key={f.label}
                className="bg-card/80 rounded-2xl p-5 text-center border border-border shadow-xs"
              >
                <div className="w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center mx-auto mb-3">
                  <f.icon className="w-6 h-6 text-foreground" />
                </div>
                <p className="font-bold text-sm text-foreground mb-1">
                  {f.label}
                </p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-6 max-w-7xl py-10 mb-16">
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground text-center mb-10">
          How it works
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl border border-border p-6 text-center shadow-card"
            >
              <div className="text-4xl mb-3">{step.icon}</div>
              <div className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center text-xs font-bold text-foreground mx-auto mb-3">
                {i + 1}
              </div>
              <h3 className="font-bold text-sm text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
