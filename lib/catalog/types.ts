export type DeviceStatus = "published" | "draft" | "deprecated";

export interface DeviceImages {
  frontOff?: string;
  thumbhash?: string;
}

export interface DeviceProvenance {
  source: string;
  url: string;
  license: string;
  retrievedAt: string;
}

export interface DeviceRecord {
  id: string;
  brand: string;
  model: string;
  family?: string;
  releaseYear?: number;
  aliases: string[];
  modelNumbers: string[];
  images: DeviceImages;
  status: DeviceStatus;
  notes?: string;
  provenance?: DeviceProvenance[];
}

export interface CatalogIndex {
  devices: DeviceRecord[];
  generatedAt: string;
}
