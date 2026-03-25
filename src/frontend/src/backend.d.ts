import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Rabbit {
    id: RabbitId;
    status: RabbitStatus;
    birthDate: Timestamp;
    owner?: CollectorId;
    name: string;
    likes: bigint;
    materials: string;
    rarity: Rarity;
    photo?: ExternalBlob;
    price?: Price;
    coordinates: Coordinates;
}
export type Timestamp = bigint;
export interface CollectorProfile {
    id: string;
    nickname: string;
    city: string;
    rabbitsCollected: bigint;
    photo?: ExternalBlob;
}
export interface Coordinates {
    x: number;
    y: number;
}
export type RabbitId = string;
export type Price = bigint;
export type CollectorId = string;
export interface Message {
    status: string;
    content: string;
    recipient: CollectorId;
    sender: CollectorId;
    timestamp: Timestamp;
}
export interface UserProfile {
    name: string;
}
export enum RabbitStatus {
    pending_activation = "pending_activation",
    for_sale = "for_sale",
    auction = "auction",
    in_collection = "in_collection"
}
export enum Rarity {
    rare = "rare",
    unique = "unique",
    common = "common"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    activateRabbit(rabbitId: RabbitId, collectorId: CollectorId): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    buyRabbit(rabbitId: RabbitId, newOwner: CollectorId, paymentAmount: bigint): Promise<void>;
    completeAuction(rabbitId: RabbitId, owner: CollectorId): Promise<void>;
    createCollectorProfile(id: string, nickname: string, city: string, photo: ExternalBlob | null): Promise<void>;
    createRabbit(id: RabbitId, name: string, birthDate: Timestamp, materials: string, rarity: Rarity, coordinates: Coordinates, photo: ExternalBlob | null): Promise<void>;
    getAllRabbits(): Promise<Array<Rabbit>>;
    getAvailableRabbits(): Promise<Array<Rabbit>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCollectorMessages(collectorId: CollectorId): Promise<Array<Message>>;
    getCollectorProfileById(collectorId: CollectorId): Promise<CollectorProfile | null>;
    getCollectorRabbits(collectorId: CollectorId): Promise<Array<Rabbit>>;
    getRabbitById(rabbitId: RabbitId): Promise<Rabbit | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    likeRabbit(rabbitId: RabbitId): Promise<void>;
    placeBid(rabbitId: RabbitId, bidder: CollectorId, bidAmount: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(sender: CollectorId, recipient: CollectorId, content: string, status: string): Promise<void>;
    updateRabbitForSale(rabbitId: RabbitId, price: bigint): Promise<void>;
    updateRabbitInAuction(rabbitId: RabbitId, price: bigint, durationInSeconds: bigint): Promise<void>;
    updateRabbitMaterials(rabbitId: RabbitId, newMaterials: string): Promise<void>;
    updateRabbitName(rabbitId: RabbitId, newName: string): Promise<void>;
    claimFirstAdmin(userSecret: string): Promise<void>;
}
