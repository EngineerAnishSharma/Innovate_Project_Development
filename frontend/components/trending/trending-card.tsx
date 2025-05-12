"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Twitter, DogIcon as Mastodon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { News } from "./trending-componnet" // Import News type if needed
import { useRouter } from "next/navigation"

type TrendingCardProps = {
  post?: News
  loading?: boolean
}

export default function TrendingCard({ post, loading }: TrendingCardProps) {
  const router = useRouter()

  if (loading) {
    return (
      <div className="bg-transparent border border-white/10 rounded-none overflow-hidden">
        {/* Image skeleton */}
        <div className="relative h-48 w-full bg-zinc-900/40">
          <Skeleton className="h-full w-full absolute inset-0 bg-zinc-800/40" />
        </div>

        <div className="p-6 space-y-4">
          {/* Title skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4 bg-zinc-800/60" />
            <Skeleton className="h-6 w-1/2 bg-zinc-800/60" />
          </div>

          {/* Description skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-zinc-800/40" />
            <Skeleton className="h-4 w-full bg-zinc-800/40" />
            <Skeleton className="h-4 w-2/3 bg-zinc-800/40" />
          </div>

          {/* Footer skeleton */}
          <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16 bg-zinc-800/60" />
              <Skeleton className="h-5 w-5 rounded-full bg-zinc-800/60" />
            </div>
            <Skeleton className="h-9 w-24 rounded-md bg-zinc-800/60" />
          </div>
        </div>
      </div>
    )
  }

  if (!post) return null

  return (
    <div className="bg-transparent border border-white/30 hover:border-colorTwo/70 transition-all duration-300 rounded-none overflow-hidden flex flex-col h-full">
      <div className="relative h-48 w-full">
        <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-mono font-semibold text-white-black mb-3 tracking-tight">{post.title}</h3>
        <p className="text-textlight text-sm mb-5 font-mono leading-relaxed flex-grow">
          {post.description.length > 100 ? `${post.description.substring(0, 100)}...` : post.description}
        </p>
        <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-auto">
          <div className="flex items-center">
            <span className="text-xs text-textlight mr-2 font-mono uppercase">SOURCE:</span>
            {post.source === "reddit" ? (
              <Twitter className="h-4 w-4 text-[#1DA1F2]" />
            ) : (
              <Mastodon className="h-4 w-4 text-[#563ACC]" />
            )}
            <span className="text-xs text-textlight ml-1 capitalize font-mono">{post.source}</span>
          </div>
          <Button
            onClick={() => {
              const queryParams = new URLSearchParams({
                title: post.title,
                image: post.image,
                description: post.description,
                source: post.source,
                fake: JSON.stringify(post.fake),
                tags: post.tags.join(","),
                account: JSON.stringify(post.account),
                created_at: post.created_at,
                url: post.url,
                visibility: post.visibility,
              })

              window.open(`/home/${post.id}?${queryParams.toString()}`)
            }}
            size="sm"
            className="bg-colorTwo text-white hover:bg-colorTwo/90"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  )
}

