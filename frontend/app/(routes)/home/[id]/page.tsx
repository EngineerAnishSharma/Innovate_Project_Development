"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { AlertTriangle, BarChart3, ExternalLink, Hash, Heart, MessageSquare, Repeat, Share2, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import fakesites from "./fakesites.json"

// Define an interface for fake site records.
interface FakeSite {
  Domain: string
  "Site Rank": string
  "Year online": string
  Name: string
  "MBFC Fact": string
  "MBFC Bias": string
  "MBFC cred": string
  "Media Bias/Fact Check": string
  "Wiki Fake": string
  "Wiki RSP": string
  "Wiki DEPS": string
  Wikipedia: string
  Quality: string
  MisinfoMe: string
  Lang: string
  URL: string
}

// Ensure the imported JSON is typed.
const fakeSites: FakeSite[] = fakesites

export default function FakeNewsPage() {
  const { toast } = useToast()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [communityNote, setCommunityNote] = useState("")

  // Retrieve query parameters using Next.js's useSearchParams hook.
  const searchParams = useSearchParams()

  // Decode and assign parameters (with defaults if missing)
  const title = searchParams.get("title") ? decodeURIComponent(searchParams.get("title")!) : "Default Headline"
  const description = searchParams.get("description")
    ? decodeURIComponent(searchParams.get("description")!)
    : "No article content provided."
  const image = searchParams.get("image")
    ? decodeURIComponent(searchParams.get("image")!)
    : "/placeholder.svg?height=400&width=800"
  // const source = searchParams.get("source") ? decodeURIComponent(searchParams.get("source")!) : "reddit"
  const created_at = searchParams.get("created_at")
  const url = searchParams.get("url") ? decodeURIComponent(searchParams.get("url")!) : ""

  const fakeParam = searchParams.get("fake") ? decodeURIComponent(searchParams.get("fake")!) : "[]"
  const tagsParam = searchParams.get("tags") ? decodeURIComponent(searchParams.get("tags")!) : ""
  // Get the account parameter and decode it.
  const accountParam = searchParams.get("account") ? decodeURIComponent(searchParams.get("account")!) : null

  // Parse JSON for arrays/objects
  let fakeArray: string[] = []
  try {
    fakeArray = JSON.parse(fakeParam)
  } catch (error) {
    console.error("Error parsing fake array:", error)
  }

  const tagsArray = tagsParam ? tagsParam.split(",") : []

  // Define a fallback account object
  const accountFallback = {
    name: "Default Name",
    handle: "@default",
    followers: 0,
    joined: "N/A",
    verified: false,
    profileImage: "/placeholder.svg?height=50&width=50",
  }

  // Check if accountParam is a valid JSON string
  let accountParsed = null
  if (accountParam && accountParam.startsWith("{") && accountParam.endsWith("}")) {
    try {
      accountParsed = JSON.parse(accountParam)
    } catch (error) {
      console.error("Error parsing account JSON:", error)
    }
  }
  // const accountData = accountParsed && accountParsed.name ? accountParsed : accountFallback

  // Construct your fake news data object
  const fakeNewsData = {
    headline: title,
    publishDate: created_at,
    image,
    article: description,
    credibilityScore: 22,
    languageAnalysis: {
      emotionalLanguage: Math.floor(Math.random() * 100) + 1,
      factualClaims: Math.floor(Math.random() * 100) + 1,
      sourceCitations: Math.floor(Math.random() * 100) + 1,
      expertQuotes: Math.floor(Math.random() * 100) + 1,
      vaguePhrasing: Math.floor(Math.random() * 100) + 1,
    },
    hashtags: tagsArray,
    socialMetrics: {
      likes: Math.floor(Math.random() * 100) + 1,
      reposts: Math.floor(Math.random() * 100) + 1,
      comments: Math.floor(Math.random() * 100) + 1,
      reach: (Math.floor(Math.random() * 100) + 1).toString(),
    },
    account: {
      name: accountParsed?.display_name || accountFallback.name,
      handle: accountParsed?.username ? `@${accountParsed.username}` : accountFallback.handle,
      followers: accountFallback.followers,
      joined: accountFallback.joined,
      verified: accountFallback.verified,
      profileImage: accountParsed?.avatar || accountFallback.profileImage,
    },
    previousPosts: [] as string[],
  }

  const handleShareLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        toast({
          title: "Link copied!",
          description: "The link has been copied to your clipboard.",
          duration: 3000,
        })
      })
      .catch((err) => console.error("Failed to copy link: ", err))
  }

  const handleTwitterLogin = () => {
    setIsLoggedIn(true)
  }

  const handleSubmitNote = () => {
    if (communityNote.trim()) {
      alert("Thank you for contributing to fact checking!")
      setCommunityNote("")
    }
  }

  // Filter the fake sites based on the fakeArray (which should contain domain prefixes).
  const fakeDomains = fakeSites.filter((record) => {
    const prefix = record.Domain.split(".")[0]
    return fakeArray.includes(prefix)
  })

  // Use a fallback object if no matching domain is found.
  const fakeDomain =
    fakeDomains.length > 0
      ? fakeDomains[0]
      : {
          "MBFC Bias": "N/A",
          "MBFC cred": "N/A",
          "MBFC Fact": "N/A",
        }

  // Update labels based on MBFC values.
  if (fakeDomain["MBFC Bias"] === "FN") fakeDomain["MBFC Bias"] = "Fake News"
  if (fakeDomain["MBFC Bias"] === "CP") fakeDomain["MBFC Bias"] = "Conspiracy-Pseudoscience"
  if (fakeDomain["MBFC cred"] === "L") fakeDomain["MBFC cred"] = "Low Credibility"
  if (fakeDomain["MBFC cred"] === "M") fakeDomain["MBFC cred"] = "Medium Credibility"
  if (fakeDomain["MBFC cred"] === "H") fakeDomain["MBFC cred"] = "High Credibility"
  if (fakeDomain["MBFC Fact"] === "VH") fakeDomain["MBFC Fact"] = "Very High"
  if (fakeDomain["MBFC Fact"] === "H") fakeDomain["MBFC Fact"] = "High"
  if (fakeDomain["MBFC Fact"] === "MF") fakeDomain["MBFC Fact"] = "Mostly Factual"
  if (fakeDomain["MBFC Fact"] === "M") fakeDomain["MBFC Fact"] = "Mixed"
  if (fakeDomain["MBFC Fact"] === "L") fakeDomain["MBFC Fact"] = "Low"
  if (fakeDomain["MBFC Fact"] === "VL") fakeDomain["MBFC Fact"] = "Very Low"

  console.log(fakeDomain)

  // Determine credibility status based on score
  const isCredible = fakeNewsData.credibilityScore >= 50
  const credibilityStatus = "Likely Fake News"
  const credibilityColor =  "text-red-500"
  const credibilityBadgeColor =  "bg-red-600 hover:bg-red-700"

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 py-8 lg:px-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Badge variant="default" className={`flex items-center gap-1 ${credibilityBadgeColor}`}>
              <AlertTriangle className="h-3 w-3" />
              {credibilityStatus}
            </Badge>
            <span className="text-lg text-zinc-500 dark:text-zinc-400 font-medium">
              Credibility Score:{" "}
              <span className={`${credibilityColor} font-bold text-xl`}>{fakeNewsData.credibilityScore}%</span>
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareLink}
            className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Analysis
          </Button>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-3 text-zinc-900 dark:text-zinc-50">{fakeNewsData.headline}</h1>
              <p className="text-zinc-500 dark:text-zinc-400">
                {fakeNewsData.publishDate
                  ? new Date(fakeNewsData.publishDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Unknown Date"}
              </p>
            </div>

            <Card className="border-zinc-200 dark:border-zinc-800 bg-black">
              <CardHeader>
                <CardTitle className="text-zinc-50">Article Content</CardTitle>
                <CardDescription className="text-zinc-400">Original content being analyzed</CardDescription>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                {fakeNewsData.image && (
                  <div className="mb-6 rounded-lg overflow-hidden">
                    <Image
                      src={fakeNewsData.image || "/placeholder.svg"}
                      alt="Article image"
                      width={800}
                      height={400}
                      className="w-full object-cover"
                    />
                  </div>
                )}
                <p className="text-zinc-300 whitespace-pre-line">{fakeNewsData.article}</p>
              </CardContent>
            </Card>

            <Card className="border-zinc-200 dark:border-zinc-800 bg-emerald-900">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  MBFC Rating
                </CardTitle>
                <CardDescription className="text-zinc-200">
                  The following values represent MBFC values derived from iffy index
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white font-medium">Bias:</span>
                    <span className="text-emerald-300 font-semibold">{fakeDomain["MBFC Bias"]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white font-medium">Credibility:</span>
                    <span className="text-emerald-300 font-semibold">{fakeDomain["MBFC cred"]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white font-medium">Factual Reporting:</span>
                    <span className="text-emerald-300 font-semibold">{fakeDomain["MBFC Fact"]}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Account Info Card */}
            <Card className="border-zinc-200 dark:border-zinc-800 bg-black">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={fakeNewsData.account.profileImage} alt={fakeNewsData.account.name} />
                      <AvatarFallback>{fakeNewsData.account.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-zinc-50">{fakeNewsData.account.name}</h3>
                      <p className="text-sm text-zinc-400">{fakeNewsData.account.handle}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-zinc-700 hover:bg-zinc-800 text-zinc-400"
                    onClick={() => window.open(`${url}`, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-zinc-50 dark:bg-zinc-900 p-3 rounded-lg text-center">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Followers</p>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {fakeNewsData.account.followers?.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900 p-3 rounded-lg text-center">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Joined</p>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-50">{fakeNewsData.account.joined}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {fakeNewsData.previousPosts.map((post, index) => (
                    <div key={index} className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                      <p className="text-sm text-zinc-700 dark:text-zinc-300">{post}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hashtags Card */}
            <Card className="border-zinc-200 dark:border-zinc-800 bg-black">
              <CardHeader>
                <CardTitle className="text-zinc-50 flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Hashtags
                </CardTitle>
                <CardDescription className="text-zinc-400">Associated hashtags from the post</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {fakeNewsData.hashtags.map((hashtag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-emerald-900/20 hover:bg-emerald-900/30 text-emerald-400 border-emerald-500/20"
                    >
                      {hashtag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Metrics Card */}
            <Card className="border-zinc-200 dark:border-zinc-800 bg-black">
              <CardHeader>
                <CardTitle className="text-zinc-50">Social Metrics</CardTitle>
                <CardDescription className="text-zinc-400">Engagement statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-emerald-500" />
                    <div>
                      <p className="text-sm text-zinc-400">Likes</p>
                      <p className="font-semibold text-zinc-50">{fakeNewsData.socialMetrics.likes.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Repeat className="h-4 w-4 text-emerald-500" />
                    <div>
                      <p className="text-sm text-zinc-400">Reposts</p>
                      <p className="font-semibold text-zinc-50">
                        {fakeNewsData.socialMetrics.reposts.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-emerald-500" />
                    <div>
                      <p className="text-sm text-zinc-400">Comments</p>
                      <p className="font-semibold text-zinc-50">
                        {fakeNewsData.socialMetrics.comments.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-emerald-500" />
                    <div>
                      <p className="text-sm text-zinc-400">Reach</p>
                      <p className="font-semibold text-zinc-50">{fakeNewsData.socialMetrics.reach}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Notes Section */}
            <Card className="border-zinc-200 dark:border-zinc-800 bg-black">
              <CardHeader>
                <CardTitle className="text-zinc-50">Community Notes</CardTitle>
                <CardDescription className="text-zinc-400">Add context to this content</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoggedIn ? (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Add factual information..."
                      value={communityNote}
                      onChange={(e) => setCommunityNote(e.target.value)}
                      className="min-h-[100px] bg-zinc-900 border-zinc-700 text-zinc-200 placeholder:text-zinc-500"
                    />
                    <Button onClick={handleSubmitNote} className="w-full bg-emerald-600 hover:bg-emerald-700">
                      Submit Note
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <p className="mb-4 text-zinc-400">Login to add a community note</p>
                    <Button
                      onClick={handleTwitterLogin}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <LogIn className="h-4 w-4" />
                      Login
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            This analysis is provided as an educational tool.{" "}
            <Link href="#" className="ml-1 underline hover:text-zinc-900 dark:hover:text-zinc-200">
              Learn more about our methodology
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

