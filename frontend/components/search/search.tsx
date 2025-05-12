"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { SearchIcon, ChevronLeft, ChevronRight } from "lucide-react";
import TrendingCard from "@/components/trending/trending-card";
import { Button } from "@/components/ui/button";

type SearchResult = {
  id: string;
  title: string;
  description: string;
  image: string;
  source: "reddit" | "mastodon";
  fake: string[];
  tags: string[];
  account: {
    acct: string;
    avatar: string;
    display_name: string;
    url: string;
    username: string;
  };
  created_at: string;
  url: string;
  visibility: "public" | "private" | "unlisted" | "direct";
};

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  type Post = {
    account: {
      acct: string;
      avatar: string;
      display_name: string;
      url: string;
      username: string;
    };
    content: string;
    created_at: string;
    fake: string[];
    id: string;
    media_attachments: { preview_url: string }[];
    tags: string[];
    url: string;
    visibility: "public" | "private" | "unlisted" | "direct";
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch("http://localhost:5000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword: searchTerm }),
      });
      const data = (await response.json()) as Post[];
      data.sort((a, b) => {
        if (
          a.media_attachments.length > 0 &&
          b.media_attachments.length === 0
        ) {
          return -1;
        }
        if (
          a.media_attachments.length === 0 &&
          b.media_attachments.length > 0
        ) {
          return 1;
        }
        return 0;
      });

      console.log(data);

      // Format the response to match the TrendingCard props
      const formattedPosts: SearchResult[] = data
        .slice(0, 30)
        .map((post: Post) => ({
          id: post.id,
          title: post.account.display_name,
          description: post.content.replace(/<[^>]+>/g, ""),
          image:
            post.media_attachments.length > 0
              ? post.media_attachments[0].preview_url
              : "/placeholder.svg?height=200&width=400",
          source: post.url.includes("reddit") ? "reddit" : "mastodon",
          fake: post.fake,
          tags: post.tags,
          account: post.account,
          created_at: post.created_at,
          url: post.url,
          visibility: post.visibility,
        }));

      setSearchResults(formattedPosts);
      setCurrentPage(1);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error searching:", error.message);
      } else {
        console.error("Unknown error:", error);
      }
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPageItems = (): SearchResult[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return searchResults.slice(startIndex, startIndex + itemsPerPage);
  };

  const goToPage = (page: number) => {
    setLoading(true);
    setCurrentPage(page);
    setTimeout(() => setLoading(false), 300);
  };

  const renderPageNumbers = (): JSX.Element[] => {
    const pages: JSX.Element[] = [];
    pages.push(
      <Button
        key="prev"
        variant="ghost"
        onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    );

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "ghost"}
          onClick={() => goToPage(i)}
        >
          {i}
        </Button>
      );
    }

    pages.push(
      <Button
        key="next"
        variant="ghost"
        onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    );

    return pages;
  };

  const currentItems = getCurrentPageItems();

  return (
    <section id="search" className="w-full py-16 bg-theme-background">
      <div className="container mx-auto">
        <h2 className="text-3xl font-mono uppercase tracking-wider text-white-black mb-12 border-l-4 border-colorTwo pl-4">
          SEARCH
        </h2>
        <motion.div
          className="max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for news articles..."
              className="flex-grow px-4 py-2 bg-white bg-opacity-10 text-white placeholder-gray-400 border border-white border-opacity-20 rounded-l-md focus:outline-none focus:ring-2 focus:ring-colorTwo"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-colorTwo text-white rounded-r-md hover:bg-opacity-90 transition-colors duration-200"
            >
              <SearchIcon size={20} />
            </button>
          </form>
        </motion.div>

        {searched && (
          <>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {Array.from({ length: itemsPerPage }).map((_, index) => (
                  <TrendingCard key={index} loading={true} />
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  {currentItems.map((result) => (
                    <TrendingCard key={result.id} post={result} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    {renderPageNumbers()}
                  </div>
                )}
              </>
            ) : (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white/5 border border-white/10 rounded-md p-8 max-w-xl mx-auto">
                  <h3 className="text-xl font-mono text-white mb-3">
                    No Fake News Found
                  </h3>
                  <p className="text-textlight font-mono">
                    We couldn't find any fake news matching your search
                    criteria. Try different keywords or check back later.
                  </p>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
