import { Actor, HttpAgent } from "@icp-sdk/core/agent";
import type { Identity } from "@icp-sdk/core/agent";
import { idlFactory } from "./declarations/backend.did";

export { Rarity, RabbitStatus, UserRole } from "./backend.d";
export type {
  Rabbit,
  CollectorProfile,
  Message,
  UserProfile,
  RabbitId,
  CollectorId,
  Price,
  Timestamp,
  Coordinates,
} from "./backend.d";

import type { backendInterface as _BaseBackendInterface } from "./backend.d";

export type backendInterface = _BaseBackendInterface & {
  _initializeAccessControlWithSecret: (token: string) => Promise<void>;
};

export interface CreateActorOptions {
  agentOptions?: {
    identity?: Identity;
    host?: string;
  };
}

export class ExternalBlob {
  private _bytes: Uint8Array | null = null;
  private _url: string | null = null;
  private _progressCallback: ((pct: number) => void) | null = null;

  private constructor() {}

  async getBytes(): Promise<Uint8Array<ArrayBuffer>> {
    if (this._bytes) return this._bytes as Uint8Array<ArrayBuffer>;
    if (this._url) {
      const resp = await fetch(this._url);
      const buf = await resp.arrayBuffer();
      return new Uint8Array(buf) as Uint8Array<ArrayBuffer>;
    }
    return new Uint8Array(0) as Uint8Array<ArrayBuffer>;
  }

  getDirectURL(): string {
    return this._url ?? "";
  }

  get onProgress(): (pct: number) => void {
    return this._progressCallback ?? (() => {});
  }

  withUploadProgress(cb: (pct: number) => void): ExternalBlob {
    const clone = new ExternalBlob();
    clone._bytes = this._bytes;
    clone._url = this._url;
    clone._progressCallback = cb;
    return clone;
  }

  static fromURL(url: string): ExternalBlob {
    const b = new ExternalBlob();
    b._url = url;
    return b;
  }

  static fromBytes(bytes: Uint8Array<ArrayBuffer>): ExternalBlob {
    const b = new ExternalBlob();
    b._bytes = bytes;
    return b;
  }
}

type BackendActor = backendInterface & {
  _initializeAccessControlWithSecret: (token: string) => Promise<void>;
};

export async function createActor(
  canisterId: string,
  uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
  downloadFile: (bytes: Uint8Array) => Promise<ExternalBlob>,
  options?: CreateActorOptions,
): Promise<BackendActor> {
  const host =
    options?.agentOptions?.host ??
    (import.meta.env.DEV ? "http://localhost:4943" : "https://ic0.app");
  const agent = await HttpAgent.create({
    host,
    identity: options?.agentOptions?.identity,
    shouldFetchRootKey: import.meta.env.DEV,
  });

  const rawActor = Actor.createActor<BackendActor>(idlFactory, {
    agent,
    canisterId,
  });

  return rawActor;
}
