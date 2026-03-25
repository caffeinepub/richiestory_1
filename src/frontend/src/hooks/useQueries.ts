import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CollectorProfile,
  Coordinates,
  ExternalBlob,
  Message,
  Rabbit,
} from "../backend.d";
import { RabbitStatus, Rarity } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllRabbits() {
  const { actor, isFetching } = useActor();
  return useQuery<Rabbit[]>({
    queryKey: ["rabbits"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRabbits();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRabbitById(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Rabbit | null>({
    queryKey: ["rabbit", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getRabbitById(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetCollectorProfile(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<CollectorProfile | null>({
    queryKey: ["collector", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCollectorProfileById(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetCollectorRabbits(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Rabbit[]>({
    queryKey: ["collector-rabbits", id],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCollectorRabbits(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetCollectorMessages(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Message[]>({
    queryKey: ["messages", id],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCollectorMessages(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLikeRabbit() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (rabbitId: string) => {
      if (!actor) throw new Error("No actor");
      return actor.likeRabbit(rabbitId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rabbits"] });
    },
  });
}

export function useUpdateRabbitName() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      rabbitId,
      newName,
    }: { rabbitId: string; newName: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateRabbitName(rabbitId, newName);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rabbits"] });
    },
  });
}

export function usePlaceBid() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      rabbitId,
      bidder,
      bidAmount,
    }: {
      rabbitId: string;
      bidder: string;
      bidAmount: bigint;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.placeBid(rabbitId, bidder, bidAmount);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rabbits"] });
    },
  });
}

export function useBuyRabbit() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      rabbitId,
      newOwner,
      paymentAmount,
    }: {
      rabbitId: string;
      newOwner: string;
      paymentAmount: bigint;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.buyRabbit(rabbitId, newOwner, paymentAmount);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rabbits"] });
    },
  });
}

export function useActivateRabbit() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      rabbitId,
      collectorId,
    }: {
      rabbitId: string;
      collectorId: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.activateRabbit(rabbitId, collectorId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rabbits"] });
    },
  });
}

export function useUpdateRabbitForSale() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      rabbitId,
      price,
    }: {
      rabbitId: string;
      price: bigint;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateRabbitForSale(rabbitId, price);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rabbits"] });
    },
  });
}

export function useUpdateRabbitInAuction() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      rabbitId,
      price,
      durationInSeconds,
    }: {
      rabbitId: string;
      price: bigint;
      durationInSeconds: bigint;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateRabbitInAuction(rabbitId, price, durationInSeconds);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rabbits"] });
    },
  });
}

export function useCreateRabbit() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string;
      name: string;
      birthDate: bigint;
      materials: string;
      rarity: Rarity;
      coordinates: Coordinates;
      photo: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createRabbit(
        params.id,
        params.name,
        params.birthDate,
        params.materials,
        params.rarity,
        params.coordinates,
        params.photo,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rabbits"] });
    },
  });
}

export { Rarity, RabbitStatus };
