// app/api/slices/route.ts
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Function to run the slice analysis scripts
async function runSliceAnalysis() {
  try {
    console.log('🚀 Starting slice analysis...');

    // Run buildSliceIndex.ts first
    console.log('📦 Building slice index...');
    await execAsync('npx tsx scripts/buildSliceIndex.ts', { cwd: process.cwd() });

    // Then run countSlices.ts
    console.log('🔢 Counting slice usage...');
    await execAsync('npx tsx scripts/countSlices.ts', { cwd: process.cwd() });

    console.log('✅ Slice analysis completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Error running slice analysis:', error);
    throw error;
  }
}

export async function GET() {
  try {
    // Check if files exist
    const filePath = path.join(process.cwd(), 'artifacts/sliceUsageDetails.json');
    const sliceIndexPath = path.join(process.cwd(), 'artifacts/sliceIndex.json');

    const [sliceUsageExists, sliceIndexExists] = await Promise.all([
      fs.access(filePath).then(() => true).catch(() => false),
      fs.access(sliceIndexPath).then(() => true).catch(() => false)
    ]);

    // If files don't exist, run the analysis
    if (!sliceUsageExists || !sliceIndexExists) {
      console.log('📊 Slice data not found, running analysis...');
      await runSliceAnalysis();
    }

    // Read both files
    const [sliceUsageData, sliceIndexData] = await Promise.all([
      fs.readFile(filePath, 'utf-8').then(data => JSON.parse(data)),
      fs.readFile(sliceIndexPath, 'utf-8').then(data => JSON.parse(data))
    ]);

    // Transform the data to match the dashboard format
    const libraries = transformSliceData(sliceIndexData, sliceUsageData);

    return NextResponse.json({
      libraries,
      sliceCounts: sliceUsageData,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in slice API:', error);
    return NextResponse.json(
      { error: 'Failed to load slice data: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

// POST endpoint to trigger manual refresh
export async function POST() {
  try {
    console.log('🔄 Manual refresh triggered');
    await runSliceAnalysis();

    // After running analysis, return the updated data
    return GET();
  } catch (error) {
    console.error('Error during manual refresh:', error);
    return NextResponse.json(
      { error: 'Failed to refresh slice data: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

function transformSliceData(sliceIndex: any[], sliceUsage: any) {
  const librariesMap = new Map();

  sliceIndex.forEach((slice: any) => {
    const libraryName = slice.libraryID.split("/").pop()!.charAt(0).toUpperCase() +
      slice.libraryID.split("/").pop()!.slice(1);

    if (!librariesMap.has(libraryName)) {
      librariesMap.set(libraryName, {
        library: libraryName,
        slices: []
      });
    }

    const library = librariesMap.get(libraryName);
    const sliceCount = sliceUsage[slice.model.id]?.total || 0;

    library.slices.push({
      name: slice.model.name,
      id: slice.model.id,
      count: sliceCount,
      variations: slice.model.variations.map((variation: any) => ({
        name: variation.name,
        id: variation.id,
        count: sliceUsage[slice.model.id]?.variations[variation.id]?.count || 0
      }))
    });
  });

  return Array.from(librariesMap.values());
}