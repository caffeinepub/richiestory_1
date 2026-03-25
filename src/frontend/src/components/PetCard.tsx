import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Gavel, Heart, Tag } from "lucide-react";
import { RabbitStatus, Rarity } from "../backend.d";
import type { SamplePet } from "../data/sampleData";

const rarityLabel: Record<Rarity, string> = {
  [Rarity.common]: "Common",
  [Rarity.rare]: "Rare",
  [Rarity.unique]: "Unique",
};

const statusLabel: Record<RabbitStatus, string> = {
  [RabbitStatus.in_collection]: "In collection",
  [RabbitStatus.for_sale]: "For sale",
  [RabbitStatus.auction]: "On auction",
  [RabbitStatus.pending_activation]: "Not activated",
};

const statusColor: Record<RabbitStatus, string> = {
  [RabbitStatus.in_collection]: "bg-muted text-muted-foreground",
  [RabbitStatus.for_sale]: "bg-primary/20 text-foreground",
  [RabbitStatus.auction]: "bg-secondary/60 text-foreground",
  [RabbitStatus.pending_activation]: "bg-muted text-muted-foreground",
};

interface Props {
  rabbit: SamplePet;
  index?: number;
}

export function PetCard({ rabbit, index = 1 }: Props) {
  const isUnique = rabbit.rarity === Rarity.unique;
  const isRare = rabbit.rarity === Rarity.rare;

  return (
    <div
      className={`group bg-card rounded-2xl shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden border ${
        isUnique ? "border-gold" : "border-border"
      }`}
      data-ocid={`catalog.item.${index}`}
    >
      {/* Image area */}
      <div
        className={`relative h-52 flex items-center justify-center overflow-hidden ${
          isUnique
            ? "bg-gradient-to-br from-yellow-50 to-amber-100"
            : isRare
              ? "blush-light-bg"
              : "mint-light-bg"
        }`}
      >
        {rabbit.image ? (
          <img
            src={rabbit.image}
            alt={rabbit.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-40">
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              className="text-foreground"
            >
              <title>Pet</title>
              <circle
                cx="40"
                cy="44"
                r="20"
                fill="currentColor"
                opacity="0.5"
              />
              <circle cx="28" cy="26" r="9" fill="currentColor" opacity="0.6" />
              <circle cx="52" cy="26" r="9" fill="currentColor" opacity="0.6" />
              <circle cx="35" cy="42" r="3" fill="white" opacity="0.9" />
              <circle cx="45" cy="42" r="3" fill="white" opacity="0.9" />
              <ellipse
                cx="40"
                cy="50"
                rx="5"
                ry="3"
                fill="white"
                opacity="0.6"
              />
            </svg>
            <span className="text-xs font-semibold">{rabbit.id}</span>
          </div>
        )}
        {isUnique && (
          <div className="absolute top-3 right-3 gold-bg text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            ★ Unique
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs font-bold text-muted-foreground">
              {rabbit.id}
            </p>
            <h3 className="font-bold text-foreground truncate">
              {rabbit.name}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Heart className="w-3.5 h-3.5" />
            {rabbit.likes}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              isUnique
                ? "gold-bg text-white"
                : isRare
                  ? "bg-secondary/60 text-foreground"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {rarityLabel[rabbit.rarity]}
          </span>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[rabbit.status]}`}
          >
            {statusLabel[rabbit.status]}
          </span>
        </div>

        {rabbit.status === RabbitStatus.for_sale && rabbit.price && (
          <div className="flex items-center gap-1 text-sm font-bold text-foreground mb-3">
            <Tag className="w-4 h-4 text-primary" />
            {rabbit.price.toLocaleString()} credits
          </div>
        )}
        {rabbit.status === RabbitStatus.auction && rabbit.currentBid && (
          <div className="flex items-center gap-1 text-sm font-bold text-foreground mb-3">
            <Gavel className="w-4 h-4 gold-text" />
            <span className="gold-text">
              {rabbit.currentBid.toLocaleString()} credits
            </span>
          </div>
        )}

        <Link to="/pet/$id" params={{ id: rabbit.id }}>
          <Button
            size="sm"
            className="w-full rounded-full font-semibold bg-primary text-primary-foreground hover:bg-primary/80"
            data-ocid={`catalog.item.button.${index}`}
          >
            View details
          </Button>
        </Link>
      </div>
    </div>
  );
}

// Backward compat alias
export { PetCard as RabbitCard };
