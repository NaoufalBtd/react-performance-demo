"use client"

import { useState, useCallback, useMemo } from "react"
import { Search, Zap, AlertTriangle, RefreshCcw } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { NaiveList } from "@/components/naive-list"
import { OptimizedList } from "@/components/optimized-list"
import { StatsPanel } from "@/components/stats-panel"

// Generate a large list of items
const generateItems = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    description: `This is item number ${i}`,
    category: i % 5 === 0 ? "Featured" : i % 3 === 0 ? "Popular" : "Standard",
    price: Math.floor(Math.random() * 100) + 10,
  }))
}

export function PerformanceDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOptimized, setIsOptimized] = useState(false)
  const [renderCounts, setRenderCounts] = useState({ naive: 0, optimized: 0 })
  const [items] = useState(() => generateItems(500))
  const [lastRenderTime, setLastRenderTime] = useState(0)
  const [renderTimes, setRenderTimes] = useState<number[]>([])

  // Reset render counts
  const resetCounts = () => {
    setRenderCounts({ naive: 0, optimized: 0 })
    setRenderTimes([])
  }

  // Track render counts
  const incrementRenderCount = useCallback((type: "naive" | "optimized") => {
    setRenderCounts((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }))

    const now = performance.now()
    if (lastRenderTime > 0) {
      setRenderTimes((prev) => [...prev, now - lastRenderTime])
    }
    setLastRenderTime(now)
  }, []) // Remove lastRenderTime from dependencies

  // Filter items based on search term
  const filteredItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [items, searchTerm])

  return (
    <div className="container mx-auto py-6 space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">React Performance Demo</h1>
          <p className="text-muted-foreground">Visualize the impact of component optimization on render performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={resetCounts}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Reset Counters
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Control Panel</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <Switch id="optimization-mode" checked={isOptimized} onCheckedChange={setIsOptimized} />
                  <Label htmlFor="optimization-mode" className="font-medium">
                    {isOptimized ? (
                      <span className="flex items-center text-green-500">
                        <Zap className="mr-1 h-4 w-4" /> Optimized
                      </span>
                    ) : (
                      <span className="flex items-center text-amber-500">
                        <AlertTriangle className="mr-1 h-4 w-4" /> Naive
                      </span>
                    )}
                  </Label>
                </div>
              </div>
            </div>
            <CardDescription>Type in the search box to filter items and observe re-render behavior</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search items..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <div className="flex flex-col w-full space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Filtered Results:</span>
                <span className="font-medium">{filteredItems.length} items</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Mode:</span>
                <Badge variant={isOptimized ? "success" : "destructive"}>{isOptimized ? "Optimized" : "Naive"}</Badge>
              </div>
            </div>
          </CardFooter>
        </Card>

        <StatsPanel
          naiveRenderCount={renderCounts.naive}
          optimizedRenderCount={renderCounts.optimized}
          renderTimes={renderTimes}
          isOptimized={isOptimized}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item List</CardTitle>
          <CardDescription>
            Each item shows its render count. Watch how they update as you type in the search box.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <div className="h-[500px] overflow-y-auto p-4">
            {isOptimized ? (
              <OptimizedList items={filteredItems} onRender={() => incrementRenderCount("optimized")} />
            ) : (
              <NaiveList items={filteredItems} searchTerm={searchTerm} onRender={() => incrementRenderCount("naive")} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

