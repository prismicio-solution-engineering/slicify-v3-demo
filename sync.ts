/**
 * - `npm install -d @slicemachine/manager`
 * - Configure sub repositories in the `SUB_REPOSITORIES` array.
 * - `npx tsx sync.ts`
 */

import { createSliceMachineManager } from "@slicemachine/manager";

// Repositories we want to replicate the models from the main repository to.
const SUB_REPOSITORIES = [
  // "slicify-v3-adriana",
  // "slicify-v3-alexm",
  // "slicify-v3-andrea",
  // "slicify-v3-brenda",
  // "slicify-v3-lea",
  // "slicify-v3-maya",
  // "slicify-v3-michael",
  "slicify-v3-nathan",
  // "slicify-v3-nathanael",
  // "slicify-v3-noor",
  // "slicify-v3-samira",
  // "slicify-v3-sarah",
  // "slicify-v3-thomas",
]

const manager = createSliceMachineManager();

async function main() {
  const start = performance.now();

  // Ensure that we're logged in before doing anything.
  if (!manager.user.checkIsLoggedIn()) {
    throw new Error("You are not logged in. Please log in first with `npx prismic-cli login` and try again.");
  }

  await manager.plugins.initPlugins();

  const { models: slices } = await manager.slices.readAllSlices();
  const { models: customtypes } = await manager.customTypes.readAllCustomTypes();

  console.log(
    "Syncing %o slices and %o custom types to %o sub-repositories",
    slices.length,
    customtypes.length,
    SUB_REPOSITORIES.length
  );

  for (let i = 0; i < SUB_REPOSITORIES.length; i++) {
    const sub = SUB_REPOSITORIES[i];
    let progress = 0;

    const logProgress = (progressed?: boolean) => {
      if (progressed) {
        progress++;
        // Clean up last progress line
        process.stdout.moveCursor(0, -1);
        process.stdout.clearLine(1);
      }

      console.log(
        "Syncing %o... %o% (%o/%o)",
        sub,
        Math.floor(progress / (slices.length + customtypes.length) * 100),
        i + 1,
        SUB_REPOSITORIES.length
      );
    }

    logProgress();

    // We "trick" the manager into thinking that we're in a sub-repository by
    // setting the environment to the sub-repository name.
    await manager.project.updateEnvironment({ environment: sub });

    await manager.screenshots.initS3ACL();

    await Promise.all(slices.map(async (slice) => {
      await manager.slices.pushSlice({ libraryID: slice.libraryID, sliceID: slice.model.id });
      logProgress(true);
    }))

    await Promise.all(customtypes.map(async (customtype) => {
      await manager.customTypes.pushCustomType({ id: customtype.model.id });
      logProgress(true);
    }))
  }

  // Reuse the default environment (main repository)
  await manager.project.updateEnvironment({ environment: undefined });

  console.log("Synced in %os", Math.round((performance.now() - start) / 1000));
}

main();
