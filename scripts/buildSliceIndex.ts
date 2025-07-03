import path from "path";
import fsp from "fs/promises";
import { createSliceMachineManager } from "@slicemachine/manager";

const writeIndex = async () => {
  const manager = createSliceMachineManager();
  await manager.plugins.initPlugins();

  const { models } = await manager.slices.readAllSlices();

  const indexPath = path.join(__dirname, "../artifacts/sliceIndex.json");
  await fsp.mkdir(path.dirname(indexPath), { recursive: true });
  await fsp.writeFile(indexPath, JSON.stringify(models));

  console.info(`Built index in ${Math.round(performance.now())}ms`);
};

writeIndex();