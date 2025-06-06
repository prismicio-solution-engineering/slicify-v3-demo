import { createSliceMachineManager } from "@slicemachine/manager";
/**
 * - `npm install -d @slicemachine/manager`
 * - Configure sub repositories in the `SUB_REPOSITORIES` array.
 * - `npx tsx fetch.ts`
 */

// The init command does it there: https://github.com/prismicio/slice-machine/blob/main/packages/init/src/SliceMachineInitProcess.ts#L1362-L1377, a similar strategy can also be used with slices.

// Methods to look into
// manager.customTypes.fetchRemoteCustomTypes()
// manager.customTypes.createCustomType()

// manager.slices.fetchRemoteSlices()
// manager.slices.createSlice()

// Repositories we want to replicate the models from the main repository to.
const SOURCE_REPOSITORY = "slicify-v3-template"

const manager = createSliceMachineManager();


async function main() {
    const start = performance.now();

    // Ensure that we're logged in before doing anything.
    if (!manager.user.checkIsLoggedIn()) {
        throw new Error("You are not logged in. Please log in first with `npx prismic-cli login` and try again.");
    }

    await manager.plugins.initPlugins();

    // const remoteTypes = await manager.customTypes.fetchRemoteCustomTypes();

    // let pulledTypes = 0;

    // console.log(`Pulling existing types... (0/${remoteTypes.length})`)

    // await Promise.all(
    //     remoteTypes.map(async (model) => {
    //         manager.customTypes.createCustomType({ model }),
    //         pulledTypes++;
    //         console.log(`Pulling existing types... (${pulledTypes}/${remoteTypes.length})`)
    //     }),
    // );

    // Fetch remote slices
    const remoteSlices = await manager.slices.fetchRemoteSlices();

    console.log(remoteSlices)

    let pulledSlices = 0;

    // console.log(`Pulling existing slices... (0/${remoteSlices.length})`)

    // await Promise.all(
    //     remoteSlices.map(async (model) => {
    //         manager.slices.createSlice({ model }),
    //         pulledSlices++;
    //         console.log(`Pulling existing types... (${pulledSlices}/${remoteSlices.length})`)
    //     }),
    // );
}

main();
