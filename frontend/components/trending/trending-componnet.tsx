"use client";
import React, { useEffect, useState } from "react";
import TrendingCard from "./trending-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import test from "./test.json";

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

export type News = {
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

async function getTrendingPosts(): Promise<News[]> {
  try {
    // const response = await fetch("http://localhost:5000/get", {
    //   cache: "no-store",
    // });
    // const data: Post[] = await response.json();
    // data.sort(
    //   (a, b) => b.media_attachments.length - a.media_attachments.length
    // );
    return test.map((post) => ({
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
      visibility: post.visibility as
        | "public"
        | "private"
        | "unlisted"
        | "direct",
    }));
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching posts:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    return [];
  }
}

export default function TrendingComponent() {
  const [posts, setPosts] = useState<News[]>([]);

  useEffect(() => {
    getTrendingPosts().then(setPosts);
  }, []);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(posts.length / itemsPerPage);

  return (
    <section id="trending" className="w-full py-16 bg-theme-background mt-8">
      <div className="container mx-auto">
        <h2 className="text-3xl font-mono uppercase tracking-wider text-white-black mb-12 border-l-4 border-colorTwo pl-4">
          TRENDING NEWS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {posts.slice(0, itemsPerPage).map((post) => (
            <TrendingCard key={post.id} post={post} />
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <Button variant="ghost" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="default">1</Button>
            <Button variant="ghost" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
