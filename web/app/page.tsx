"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Zap,
  RefreshCw,
  Layers,
  Database,
  Timer,
  CheckCircle2,
  Eye,
  Target,
  RotateCcw,
  ShieldCheck,
  HeartHandshake,
  Compass,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import {
  getProducts,
  getRecommendations,
  sendEvent,
  Product,
  RecommendationResponse,
  TEST_PERSONAS,
} from "@/lib/api";

export default function StorefrontHome() {
  const [currentUserId, setCurrentUserId] = useState("0");
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  const persona = TEST_PERSONAS.find((p) => p.id === currentUserId) || TEST_PERSONAS[0];

  const loadData = async (userId: string, disableCache: boolean = false) => {
    setLoading(true);
    try {
      const [recs, prods] = await Promise.all([
        getRecommendations(userId, disableCache).catch(() => null),
        getProducts().catch(() => []),
      ]);
      setRecommendations(recs);
      setTrendingProducts(prods.slice(0, 8));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("current_user_id") || "0";
    setCurrentUserId(saved);
    loadData(saved, true);

    const handleSwitch = (e: any) => {
      const newId = e.detail;
      setCurrentUserId(newId);
      loadData(newId, true);
    };

    window.addEventListener("user_switched", handleSwitch);
    return () => window.removeEventListener("user_switched", handleSwitch);
  }, []);

  const handleSimulateClicks = async (targetCategory: string, itemIds: number[]) => {
    setSimulating(true);
    for (const itemId of itemIds) {
      await sendEvent(currentUserId, itemId, "product_click", { simulation: true });
    }
    setTimeout(async () => {
      await loadData(currentUserId, true);
      setSimulating(false);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Showcase Card */}
      <section className="datta-card relative p-8 sm:p-12 overflow-hidden bg-white dark:bg-[#2b2c2f] border border-slate-200/80 dark:border-slate-800">
        <div className="h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r from-[#1dc4e9] via-[#04a9f5] to-[#a389d4]"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400 text-xs font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>Two-Tower Deep Neural Candidate Retrieval Engine</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-800 dark:text-white leading-tight">
              Personalized Recommendations, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1dc4e9] via-[#04a9f5] to-[#a389d4]">
                Delivered in Real-Time.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Every view, click, and purchase streams into Kafka, materializes into Feast online features, and executes sub-15ms ANN inference against 500 vector-indexed catalog products.
            </p>

            {/* Quick Persona Selector Chips */}
            <div className="pt-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Active Test Persona:
              </div>
              <div className="flex flex-wrap gap-2">
                {TEST_PERSONAS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setCurrentUserId(p.id);
                      localStorage.setItem("current_user_id", p.id);
                      loadData(p.id, true);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm ${
                      currentUserId === p.id
                        ? "bg-gradient-to-r from-[#1dc4e9] to-[#a389d4] text-white shadow-cyan-500/20"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <span>{p.avatar}</span>
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Telemetry Snapshot Card */}
          <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Serving Telemetry</span>
              <span className="flex items-center gap-1 text-emerald-600 font-mono text-[10px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                ACTIVE
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between p-2 rounded-xl bg-white dark:bg-[#2b2c2f] border border-slate-100 dark:border-slate-700 shadow-sm">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-cyan-500" />
                  Vector Store:
                </span>
                <span className="font-bold text-slate-800 dark:text-white">Milvus / ANN (64d)</span>
              </div>

              <div className="flex justify-between p-2 rounded-xl bg-white dark:bg-[#2b2c2f] border border-slate-100 dark:border-slate-700 shadow-sm">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Timer className="w-3.5 h-3.5 text-purple-500" />
                  P95 Latency:
                </span>
                <span className="font-bold text-emerald-600 font-mono">
                  {recommendations ? `${recommendations.latency_ms} ms` : "12.4 ms"}
                </span>
              </div>

              <div className="flex justify-between p-2 rounded-xl bg-white dark:bg-[#2b2c2f] border border-slate-100 dark:border-slate-700 shadow-sm">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                  Active Model:
                </span>
                <span className="font-bold text-cyan-600 font-mono">
                  {recommendations?.model_version || "two_tower_v2"}
                </span>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Go to Admin & MLOps Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works & Benefits Section */}
      <section
        id="how-it-works"
        className="datta-card relative p-8 sm:p-10 bg-white dark:bg-[#2b2c2f] border border-slate-200/80 dark:border-slate-800 space-y-8 overflow-hidden scroll-mt-20"
      >
        <div className="h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r from-[#1dc4e9] via-[#04a9f5] to-[#a389d4]"></div>

        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>How It Works</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Real-Time AI Recommendations, Explained Simply
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Most online stores show static lists or update their suggestions once a day. 
            <strong> RecommendationOS</strong> learns your taste as you click and delivers fresh, personalized recommendations within 
            <span className="font-semibold text-cyan-600 dark:text-cyan-400"> 5 milliseconds</span>.
          </p>
        </div>

        {/* 4 Step Visual Flow */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            The 4-Step Process: From Click to Recommendation
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-3 hover:border-cyan-500/50 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                    STEP 01
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">
                  You Browse &amp; Interact
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  As you view items, click products, or make purchases, the site naturally observes your preferences without asking you to fill out surveys.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero effort required</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-3 hover:border-violet-500/50 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                    STEP 02
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">
                  Instant Neural Understanding
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  In under 5ms, our Two-Tower neural network translates your actions into an instant taste profile reflecting your current shopping mood.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] font-semibold text-violet-600 dark:text-violet-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Sub-5ms calculation</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-3 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                    STEP 03
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">
                  Precision Product Matching
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Vector search scans 500 catalog items to surface the highest scoring matches, balancing personal taste, popularity, and catalog freshness.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Filtered &amp; deduplicated</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-3 hover:border-amber-500/50 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                    STEP 04
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">
                  Live In-Session Adaptation
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Changed your interest? As you click new items, streaming online learning updates recommendations instantly on the fly.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Immediate session update</span>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="space-y-4 pt-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Key Benefits for You as a User
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/70 flex items-start space-x-3.5">
              <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex-shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-white mb-1">
                  Find What You Love Faster
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  No more endless page flipping. Discover relevant products immediately on arrival.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/70 flex items-start space-x-3.5">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-white mb-1">
                  Zero Lag Shopping
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Under 5 millisecond inference means instant recommendations with zero delay or lag.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/70 flex items-start space-x-3.5">
              <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex-shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-white mb-1">
                  Great for First-Time Guests
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  No account history? Intelligent cold-start curation immediately shows trending essentials.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/70 flex items-start space-x-3.5">
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-white mb-1">
                  Diverse, Balanced Choices
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Fairness algorithms avoid repetitive items, giving you fresh discoveries every session.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/70 flex items-start space-x-3.5">
              <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex-shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-white mb-1">
                  Transparent Explanations
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  See why each item was selected with clear scoring tags and similarity rationale.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/70 flex items-start space-x-3.5">
              <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex-shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-white mb-1">
                  Adapts As Your Intent Shifts
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Swapping from tech gadgets to smart office supplies? The feed dynamically shifts with you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended For You Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                Recommended For You
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-[#1dc4e9] to-[#a389d4] text-white shadow-sm">
                AI Personalized
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Top candidates scored via PyTorch Two-Tower embedding similarity + diversity re-ranking for {persona.name}.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => loadData(currentUserId, true)}
              disabled={loading}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-[#2b2c2f] border border-slate-200 dark:border-slate-700 hover:border-cyan-500 text-slate-700 dark:text-slate-200 shadow-sm transition-all flex items-center space-x-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Inference</span>
            </button>
            <Link
              href="/recommendations"
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#1dc4e9] to-[#a389d4] hover:opacity-95 text-white shadow-md shadow-cyan-500/20 transition-all flex items-center space-x-1"
            >
              <span>Inspect Scoring</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Neural Strategy Banner */}
        {recommendations && (
          <div className="datta-card p-4 bg-white dark:bg-[#2b2c2f] border-l-4 border-l-[#1dc4e9] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-200">Serving Strategy:</span>
              <span className="px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 font-mono font-semibold">
                {recommendations.strategy}
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500">{recommendations.explanation}</span>
            </div>
            <span className="text-xs font-mono text-emerald-600 font-bold">
              Latency: {recommendations.latency_ms} ms
            </span>
          </div>
        )}

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="datta-card p-4 bg-white dark:bg-[#2b2c2f] border border-slate-200/80 dark:border-slate-800 animate-pulse space-y-3">
                <div className="h-44 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 pt-2"></div>
              </div>
            ))}
          </div>
        ) : recommendations?.detailed_recommendations?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.detailed_recommendations.map((item) => (
              <ProductCard key={item.item_id} product={item} showScore={true} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-[#2b2c2f] rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No recommendations returned yet or connecting to ML serving engine.
            </p>
            <button
              onClick={() => loadData(currentUserId, true)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#1dc4e9] to-[#a389d4] text-white shadow-sm hover:opacity-90 transition-all"
            >
              Retry Connection
            </button>
          </div>
        )}
      </section>

      {/* Catalog Trending Section */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
              Catalog Highlights
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Top indexed products across all 500 catalog items with instant interaction tracking.
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center space-x-1"
          >
            <span>Explore All 500 Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="datta-card p-4 bg-white dark:bg-[#2b2c2f] border border-slate-200/80 dark:border-slate-800 animate-pulse space-y-3">
                <div className="h-44 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 pt-2"></div>
              </div>
            ))}
          </div>
        ) : trendingProducts.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trendingProducts.map((p) => (
              <ProductCard key={p.id || p.item_id_numeric} product={p} showScore={false} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-[#2b2c2f] rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Unable to reach product catalog at backend.
            </p>
            <button
              onClick={() => loadData(currentUserId, true)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#1dc4e9] to-[#a389d4] text-white shadow-sm hover:opacity-90 transition-all"
            >
              Retry Loading Catalog
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
