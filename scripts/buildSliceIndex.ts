import path from "path";
import fsp from "fs/promises";
import prismicConfig from "../prismic.config.json";

// Build artifacts/sliceIndex.json by reading each slice's model.json directly
// from the libraries declared in prismic.config.json. This replaces the former
// @slicemachine/manager-based approach so the project no longer depends on
// Slice Machine.
const writeIndex = async () => {
  const start = performance.now();
  const libraries: string[] = prismicConfig.libraries ?? [];

  const models: { libraryID: string; model: unknown }[] = [];

  for (const library of libraries) {
    const libraryPath = path.join(__dirname, "..", library);

    let entries;
    try {
      entries = await fsp.readdir(libraryPath, { withFileTypes: true });
    } catch {
      console.warn(`Skipping missing slice library: ${library}`);
      continue;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const modelPath = path.join(libraryPath, entry.name, "model.json");
      try {
        const contents = await fsp.readFile(modelPath, "utf8");
        models.push({ libraryID: library, model: JSON.parse(contents) });
      } catch {
        // No model.json in this folder — not a slice, skip it.
      }
    }
  }

  const indexPath = path.join(__dirname, "../artifacts/sliceIndex.json");
  await fsp.mkdir(path.dirname(indexPath), { recursive: true });
  await fsp.writeFile(indexPath, JSON.stringify(models));

  console.info(
    `Built index of ${models.length} slices in ${Math.round(
      performance.now() - start
    )}ms`
  );
};

writeIndex();
