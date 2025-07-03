import * as PrismicClient from "@prismicio/client";
import models from "@/artifacts/sliceIndex.json";
import path from "path";
import fsp from "fs/promises";

interface InputSlice {
    libraryID: string;
    model: {
        name: string;
        id: string;
        variations: Array<{
            name: string;
            id: string;
        }>;
    };
}

interface SliceUsage {
    id: string;
    uid?: string;
    type: string;
}

interface SliceCounts {
    total: number;
    variations: Record<string, number>;
    usages: SliceUsage[];
}

interface SliceVariation {
    name: string;
    id: string;
    count: number;
}

interface Slice {
    name: string;
    id: string;
    count: number;
    variations: SliceVariation[];
}

interface OutputSliceLibrary {
    library: string;
    slices: Slice[];
}

interface SampleDataItem {
    id: string;
    uid?: string;
    type: string;
    data: {
        slices?: Array<{ slice_type: string; variation: string }>;
        slices1?: Array<{ slice_type: string; variation: string }>;
        slices2?: Array<{ slice_type: string; variation: string }>;
    };
}

interface TransformResult {
    libraries: OutputSliceLibrary[];
    sliceCounts: Record<
        string,
        {
            total: number;
            variations: Record<
                string,
                {
                    count: number;
                    usages: SliceUsage[];
                }
            >;
        }
    >;
}

// Initialize Prismic client
const prismic = PrismicClient.createClient("slicify-v3-template"
    // Add access token if your Prismic repository requires it
    // ,{accessToken: process.env.NEXT_PUBLIC_PRISMIC_REPO_TOKEN}
);

const writeReport = async (
    libraries: OutputSliceLibrary[],
    sliceCounts: Record<
        string,
        {
            total: number;
            variations: Record<
                string,
                {
                    count: number;
                    usages: SliceUsage[];
                }
            >;
        }
    >
) => {
    console.info('\n🚀 Starting Slice Usage Report Generation...\n');
    console.info('═'.repeat(80));

    for (const library of libraries) {
        console.info(`\n📚 LIBRARY: ${library.library}`);
        console.info('─'.repeat(50));

        for (const slice of library.slices) {
            const indexedSlice = {
                name: slice.name,
                id: slice.id,
                library: library.library,
                count: slice.count
            }

            console.info(`\n📦 Slice: ${indexedSlice.name} (${indexedSlice.id})`);
            console.info(`   📊 Total Usage: ${indexedSlice.count} times`);
            console.info('   ' + '·'.repeat(40));

            // Process variations for each slice
            for (const variation of slice.variations) {
                const indexedVariation = {
                    name: `${variation.name}`,
                    id: variation.id,
                    count: variation.count,
                    usages:
                        sliceCounts[slice.id]?.variations[variation.id]?.usages || [],
                    library: library.library
                };

                console.info(`\n   🎨 Variation: ${indexedVariation.name} (${indexedVariation.id})`);
                console.info(`      📈 Count: ${indexedVariation.count} times`);

                if (indexedVariation.usages.length > 0) {
                    console.info('      📍 Used on:');
                    
                    // Group usages by page to avoid duplicates and show count per page
                    const pageUsageMap = new Map<string, { type: string, id: string, uid?: string, count: number }>();
                    
                    indexedVariation.usages.forEach((usage) => {
                        const pageKey = `${usage.type}_${usage.id}`;
                        if (pageUsageMap.has(pageKey)) {
                            pageUsageMap.get(pageKey)!.count++;
                        } else {
                            pageUsageMap.set(pageKey, {
                                type: usage.type,
                                id: usage.id,
                                uid: usage.uid,
                                count: 1
                            });
                        }
                    });

                    // Sort by type and UID for better readability
                    const sortedPages = Array.from(pageUsageMap.values()).sort((a, b) => {
                        if (a.type !== b.type) return a.type.localeCompare(b.type);
                        return (a.uid || a.id).localeCompare(b.uid || b.id);
                    });

                    sortedPages.forEach((pageUsage) => {
                        const pageIdentifier = pageUsage.uid ? `${pageUsage.uid}` : `ID:${pageUsage.id}`;
                        const countText = pageUsage.count > 1 ? ` (${pageUsage.count}x)` : '';
                        console.info(`         ➤ ${pageUsage.type}: ${pageIdentifier}${countText}`);
                    });
                } else {
                    console.info('      📍 No pages found using this variation');
                }
            }

            // Add spacing between slices
            console.info('');
        }

        console.info('─'.repeat(50));
        console.info(`✅ Completed processing library: ${library.library}`);
    }

    console.info('\n═'.repeat(80));
    console.info(`🎯 Report generated in ${Math.round(performance.now())}ms`);
    
    // Save detailed usage report to JSON
    const usageReportPath = path.join(__dirname, "../artifacts/sliceUsageDetails.json");
    await fsp.mkdir(path.dirname(usageReportPath), { recursive: true });
    await fsp.writeFile(usageReportPath, JSON.stringify(sliceCounts, null, 2));
    console.info(`💾 Detailed usage data saved to: ${usageReportPath}`);
    
    // Generate summary statistics
    const totalSlices = Object.keys(sliceCounts).length;
    const totalUsages = Object.values(sliceCounts).reduce((sum, slice) => sum + slice.total, 0);
    const totalVariations = Object.values(sliceCounts).reduce((sum, slice) => 
        sum + Object.keys(slice.variations).length, 0
    );
    
    console.info('\n📈 SUMMARY STATISTICS');
    console.info('─'.repeat(30));
    console.info(`🔢 Total Slices: ${totalSlices}`);
    console.info(`🎨 Total Variations: ${totalVariations}`);
    console.info(`📄 Total Usage Instances: ${totalUsages}`);
    console.info('═'.repeat(80));
};

// Function to count occurrences of slices in sample data
const countSliceOccurrences = (sampleData: SampleDataItem[]) => {
    const sliceCounts: Record<
        string,
        {
            total: number;
            variations: Record<
                string,
                {
                    count: number;
                    usages: SliceUsage[];
                }
            >;
        }
    > = {};

    sampleData.forEach((item) => {
        ["slices", "slices1", "slices2"].forEach((sliceArrayKey) => {
            const sliceArray =
                item.data[sliceArrayKey as keyof typeof item.data] || [];

            sliceArray.forEach((slice) => {
                if (!sliceCounts[slice.slice_type]) {
                    sliceCounts[slice.slice_type] = {
                        total: 0,
                        variations: {}
                    };
                }

                // Increment total count for this slice type
                sliceCounts[slice.slice_type].total++;

                // Handle variation
                if (!sliceCounts[slice.slice_type].variations[slice.variation]) {
                    sliceCounts[slice.slice_type].variations[slice.variation] = {
                        count: 0,
                        usages: []
                    };
                }

                sliceCounts[slice.slice_type].variations[slice.variation].count++;
                sliceCounts[slice.slice_type].variations[slice.variation].usages.push({
                    id: item.id,
                    uid: item.uid || undefined,
                    type: item.type
                });
            });
        });
    });

    return sliceCounts;
};

// Function to transform input slices into the desired output format
// and count occurrences of slices in sample data
const transformSlices = (
    inputSlices: InputSlice[],
    sampleData: SampleDataItem[]
): TransformResult => {
    const librariesMap = new Map<string, OutputSliceLibrary>();
    const sliceCounts = countSliceOccurrences(sampleData);

    inputSlices.forEach((slice) => {
        const libraryName =
            slice.libraryID.split("/").pop()!.charAt(0).toUpperCase() +
            slice.libraryID.split("/").pop()!.slice(1);

        if (!librariesMap.has(libraryName)) {
            librariesMap.set(libraryName, {
                library: libraryName,
                slices: []
            });
        }

        const library = librariesMap.get(libraryName)!;
        const sliceCount = sliceCounts[slice.model.id]?.total || 0;

        library.slices.push({
            name: slice.model.name,
            id: slice.model.id,
            count: sliceCount,
            variations: slice.model.variations.map((variation) => ({
                name: variation.name,
                id: variation.id,
                count: sliceCounts[slice.model.id]?.variations[variation.id]?.count || 0
            }))
        });
    });

    return {
        libraries: Array.from(librariesMap.values()),
        sliceCounts
    };
};

// Main function to perform the transformation and write the report
const performSync = async () => {
    const prismicData = await prismic.dangerouslyGetAll();

    const { libraries, sliceCounts } = transformSlices(
        models as unknown as InputSlice[],
        Object.values(prismicData as SampleDataItem[])
    );

    writeReport(libraries, sliceCounts);
};

performSync()
    .then(() => {
        console.log("Slice counts and libraries transformed successfully.");
    })
    .catch((error) => {
        console.error("Error during transformation:", error);
    });