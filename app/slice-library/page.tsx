import * as fs from "node:fs/promises";
import * as path from "node:path";
import { Metadata } from "next";
import { SharedSlice } from "@prismicio/types-internal/lib/customtypes";
import { SharedSliceContent } from "@prismicio/types-internal/lib/content";
import React from "react";
import { SliceLibrary } from "./SliceLibrary";

export interface SliceLibrary {
  name: string;
  slices: SliceWithMocks[];
}

interface SliceWithMocks {
  model: SharedSlice;
  mocks: Partial<Record<string, SharedSliceContent>>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Slice Library",
    description: "Slice Library",
  };
}

export const dynamic = "force-static";

export default async function SliceLibraryPage() {
  const libraries = await loadSliceLibraries();

  return <SliceLibrary libraries={libraries} />;
}

// Load all the slice libraries defined for this Prismic project
async function loadSliceLibraries(): Promise<SliceLibrary[]> {
  try {
    const file = await fs.readFile(
      process.cwd() + "/slicemachine.config.json",
      "utf8"
    );

    const config = JSON.parse(file);
    const libraries = await Promise.all(
      (config.libraries || []).map(loadSliceLibrary)
    );
    return libraries;
  } catch (error) {
    console.error(error);
    throw new Error(
      "Issue when reading local slice libraries listed in slicemachine.config.json"
    );
  }
}

// Load all slices and their associated mocks for the given slice library
async function loadSliceLibrary(library: string): Promise<SliceLibrary> {
  const libraryPath = path.join(process.cwd(), library);

  // Read only the immediate entries (each slice is usually a folder)
  const entries = await fs.readdir(libraryPath, {
    withFileTypes: true,
  });

  const slices: SliceWithMocks[] = [];

  // Order slice folders alphabetically
  entries
    .filter((entry) => entry.isDirectory())
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const sliceDir = path.join(libraryPath, entry.name);
    const modelPath = path.join(sliceDir, "model.json");
    const mocksPath = path.join(sliceDir, "mocks.json");

    // Try to read model.json; if it's missing, skip this folder
    let modelContents: string;
    try {
      modelContents = await fs.readFile(modelPath, "utf8");
    } catch {
      continue;
    }

    const model = JSON.parse(modelContents) as SharedSlice;
    const mocks: SliceWithMocks["mocks"] = {};

    // Read mocks for the given slice – if mocks are not present, ignore
    try {
      const mocksContents = await fs.readFile(mocksPath, "utf-8");
      const mocksJson = JSON.parse(mocksContents) as SharedSliceContent[];

      for (const { id } of model.variations) {
        const mock = mocksJson.find(({ variation }) => variation === id);
        mocks[id] = mock;
      }
    } catch {
      // no mocks.json, that's fine
    }

    slices.push({ model, mocks });
  }

  return {
    name: library,
    slices,
  };
}
