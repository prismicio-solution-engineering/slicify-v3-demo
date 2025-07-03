"use client";

import {
  ArrowPathIcon,
  ArrowTrendingUpIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  Square3Stack3DIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";
import React, { useState, useEffect, useMemo } from "react";
import sm from "@/slicemachine.config.json";

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

interface SliceLibrary {
  library: string;
  slices: Slice[];
}

interface SliceData {
  libraries: SliceLibrary[];
  sliceCounts: Record<string, any>;
  lastUpdated: string;
}

export default function SliceDashboardPage() {
  // State for slice data
  const [data, setData] = useState<SliceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLibrary, setSelectedLibrary] = useState("all");
  const [sortBy, setSortBy] = useState("usage");
  const [expandedSlices, setExpandedSlices] = useState(new Set<string>());

  const fetchSliceData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/slices");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch slice data");
      }

      const sliceData = await response.json();
      setData(sliceData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const refreshSliceData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use POST to trigger script execution
      const response = await fetch("/api/slices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to refresh slice data");
      }

      const sliceData = await response.json();
      setData(sliceData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial slice data
  useEffect(() => {
    fetchSliceData();
  }, []);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!data) return { totalSlices: 0, totalUsages: 0, totalVariations: 0 };

    const totalSlices = data.libraries.reduce(
      (sum, lib) => sum + lib.slices.length,
      0
    );
    const totalUsages = data.libraries.reduce(
      (sum, lib) =>
        sum + lib.slices.reduce((sliceSum, slice) => sliceSum + slice.count, 0),
      0
    );
    const totalVariations = data.libraries.reduce(
      (sum, lib) =>
        sum +
        lib.slices.reduce(
          (sliceSum, slice) => sliceSum + slice.variations.length,
          0
        ),
      0
    );

    return { totalSlices, totalUsages, totalVariations };
  }, [data]);

  // Filter and sort slices
  const filteredData = useMemo(() => {
    if (!data) return [];

    let libraries = data.libraries;

    // Filter by library
    if (selectedLibrary !== "all") {
      libraries = libraries.filter((lib) => lib.library === selectedLibrary);
    }

    // Filter by search term
    if (searchTerm) {
      libraries = libraries
        .map((lib) => ({
          ...lib,
          slices: lib.slices.filter(
            (slice) =>
              slice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              slice.id.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter((lib) => lib.slices.length > 0);
    }

    // Sort slices within each library
    libraries = libraries.map((lib) => ({
      ...lib,
      slices: [...lib.slices].sort((a, b) => {
        switch (sortBy) {
          case "usage":
            return b.count - a.count;
          case "name":
            return a.name.localeCompare(b.name);
          case "variations":
            return b.variations.length - a.variations.length;
          default:
            return 0;
        }
      }),
    }));

    return libraries;
  }, [data, searchTerm, selectedLibrary, sortBy]);

  const toggleSliceExpansion = (sliceId: string) => {
    const newExpanded = new Set(expandedSlices);
    if (newExpanded.has(sliceId)) {
      newExpanded.delete(sliceId);
    } else {
      newExpanded.add(sliceId);
    }
    setExpandedSlices(newExpanded);
  };

  const getUsageColor = (count: number) => {
    if (count === 0) return "text-gray-400 bg-gray-100";
    if (count < 5) return "text-yellow-700 bg-yellow-100";
    if (count < 20) return "text-blue-700 bg-blue-100";
    return "text-green-700 bg-green-100";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-8 w-8 animate-spin mx-auto text-vibrant-blue mb-4" />
          <p className="text-gray-600">Loading slice data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center">
        <div className="text-center max-w-md">
          <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-dark-gray mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchSliceData}
            className="inline-flex items-center px-4 py-2 bg-vibrant-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-dark-gray mb-2">
                Slice Usage Dashboard
              </h1>
              <p className="text-gray-600">
                Analyze and monitor your Prismic slice usage across your website
              </p>
            </div>
            <button
              onClick={refreshSliceData}
              disabled={loading}
              className={`inline-flex items-center px-4 py-2 bg-vibrant-blue text-white rounded-lg hover:bg-blue-700 transition-colors ${
                loading ? "animate-spin" : ""
              }`}
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
          {data?.lastUpdated && (
            <p className="text-sm text-light-gray0 mt-2">
              Last updated: {new Date(data.lastUpdated).toLocaleString()}
            </p>
          )}
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Square3Stack3DIcon className="h-8 w-8 text-vibrant-blue mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Slices
                </p>
                <p className="text-2xl font-bold text-dark-gray">
                  {summaryStats.totalSlices}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <SquaresPlusIcon className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Variations
                </p>
                <p className="text-2xl font-bold text-dark-gray">
                  {summaryStats.totalVariations}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <ArrowTrendingUpIcon className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold text-dark-gray">
                  {summaryStats.totalUsages}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search slices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Library Filter */}
            <div className="lg:w-48">
              <select
                value={selectedLibrary}
                onChange={(e) => setSelectedLibrary(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Libraries</option>
                {data?.libraries.map((lib) => (
                  <option key={lib.library} value={lib.library}>
                    {lib.library}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="usage">Sort by Usage</option>
                <option value="name">Sort by Name</option>
                <option value="variations">Sort by Variations</option>
              </select>
            </div>
          </div>
        </div>

        {/* Slice Libraries */}
        <div className="space-y-8">
          {filteredData.map((library) => (
            <div
              key={library.library}
              className="bg-white rounded-lg shadow-sm border"
            >
              {/* Library Header */}
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Square3Stack3DIcon className="h-6 w-6 text-vibrant-blue mr-3" />
                    <h2 className="text-xl font-semibold text-dark-gray">
                      {library.library}
                    </h2>
                    <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {library.slices.length} slices
                    </span>
                  </div>
                  <div className="text-sm text-light-gray0">
                    Total usage:{" "}
                    {library.slices.reduce(
                      (sum, slice) => sum + slice.count,
                      0
                    )}
                  </div>
                </div>
              </div>

              {/* Slices */}
              <div className="divide-y divide-gray-200">
                {library.slices.map((slice) => (
                  <div key={slice.id} className="p-6">
                    {/* Slice Header */}
                    <div
                      className="flex items-center justify-between cursor-pointer hover:bg-light-gray -m-2 p-2 rounded"
                      onClick={() => toggleSliceExpansion(slice.id)}
                    >
                      <div className="flex items-center">
                        {expandedSlices.has(slice.id) ? (
                          <ChevronDownIcon className="h-5 w-5 text-gray-400 mr-2" />
                        ) : (
                          <ChevronRightIcon className="h-5 w-5 text-gray-400 mr-2" />
                        )}
                        <div>
                          <h3 className="text-lg font-medium text-dark-gray">
                            {slice.name}
                          </h3>
                          <p className="text-sm text-light-gray0 font-mono">
                            {slice.id}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getUsageColor(
                              slice.count
                            )}`}
                          >
                            {slice.count} uses
                          </div>
                          <p className="text-xs text-light-gray0 mt-1">
                            {slice.variations.length} variations
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Variations */}
                    {expandedSlices.has(slice.id) && (
                      <div className="mt-4 ml-7 space-y-3">
                        {slice.variations.map((variation) => (
                          <div
                            key={variation.id}
                            className="flex items-center justify-between p-3 bg-light-gray rounded-lg"
                          >
                            <div>
                              <h4 className="text-sm font-medium text-dark-gray">
                                {variation.name}
                              </h4>
                              <p className="text-xs text-light-gray0 font-mono">
                                {variation.id}
                              </p>
                            </div>
                            <div
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getUsageColor(
                                variation.count
                              )}`}
                            >
                              {variation.count} uses
                            </div>
                          </div>
                        ))}

                        {/* Usage Details */}
                        {data?.sliceCounts[slice.id] && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <h5 className="text-sm font-medium text-dark-gray mb-2">
                              Usage Details
                            </h5>
                            <div className="space-y-2">
                              {Object.entries(
                                data.sliceCounts[slice.id].variations
                              ).map(
                                ([variationId, variationData]: [
                                  string,
                                  any
                                ]) => (
                                  <div key={variationId} className="text-sm">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-medium text-gray-700">
                                        {slice.variations.find(
                                          (v) => v.id === variationId
                                        )?.name || variationId}
                                      </span>
                                      <span className="text-light-gray0">
                                        {variationData.count} uses
                                      </span>
                                    </div>
                                    {variationData.usages &&
                                      variationData.usages.length > 0 && (
                                        <div className="ml-4 space-y-1">
                                          {variationData.usages.map(
                                            (usage: any, index: number) => (
                                              console.log(usage),
                                              (
                                                <div
                                                  key={index}
                                                  className="text-xs text-gray-600"
                                                >
                                                  <span className="font-mono bg-gray-100 px-1 rounded">
                                                    {usage.type}
                                                  </span>
                                                  {usage.uid && (
                                                    <>
                                                      :{" "}
                                                      <a
                                                        className="font-medium"
                                                        href={`https://${sm.repositoryName}.prismic.io/builder/pages/${usage.id}`}
                                                        target="_blank"
                                                      >
                                                        {usage.uid}
                                                      </a>
                                                    </>
                                                  )}
                                                </div>
                                              )
                                            )
                                          )}
                                        </div>
                                      )}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-dark-gray">
              No slices found
            </h3>
            <p className="mt-1 text-sm text-light-gray0">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
