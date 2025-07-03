import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

async function runSliceAnalysis() {
    try {
        console.log('🚀 Starting slice analysis on server startup...');

        // Ensure artifacts directory exists
        const artifactsDir = path.join(process.cwd(), 'artifacts');
        await fs.mkdir(artifactsDir, { recursive: true });

        // Run buildSliceIndex.ts first
        console.log('📦 Building slice index...');
        await execAsync('npx tsx scripts/buildSliceIndex.ts', { cwd: process.cwd() });

        // Then run countSlices.ts
        console.log('🔢 Counting slice usage...');
        await execAsync('npx tsx scripts/countSlices.ts', { cwd: process.cwd() });

        console.log('✅ Slice analysis completed successfully');
    } catch (error) {
        console.error('❌ Error running slice analysis:', error);
        // Don't throw error to prevent server startup failure
        console.log('⚠️  Server will start without slice data. Use the refresh button to try again.');
    }
}

// Run the analysis
runSliceAnalysis();