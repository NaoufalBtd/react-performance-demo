"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart4, Zap, AlertTriangle } from "lucide-react"

interface StatsPanelProps {
  naiveRenderCount: number
  optimizedRenderCount: number
  renderTimes: number[]
  isOptimized: boolean
}

export function StatsPanel({ naiveRenderCount, optimizedRenderCount, renderTimes, isOptimized }: StatsPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Calculate average render time
  const averageRenderTime =
    renderTimes.length > 0 ? renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length : 0

  // Draw the chart
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = canvas.height
    const barWidth = (width / 2) * 0.8
    const spacing = width * 0.2
    const maxBarHeight = height * 0.8

    // Calculate bar heights (proportional to render counts)
    const maxCount = Math.max(naiveRenderCount, optimizedRenderCount, 1)
    const naiveBarHeight = (naiveRenderCount / maxCount) * maxBarHeight
    const optimizedBarHeight = (optimizedRenderCount / maxCount) * maxBarHeight

    // Draw naive bar
    ctx.fillStyle = "#f59e0b"
    ctx.fillRect(spacing / 2, height - naiveBarHeight, barWidth, naiveBarHeight)

    // Draw optimized bar
    ctx.fillStyle = "#10b981"
    ctx.fillRect(barWidth + spacing, height - optimizedBarHeight, barWidth, optimizedBarHeight)

    // Draw labels
    ctx.fillStyle = "#71717a"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"

    ctx.fillText("Naive", spacing / 2 + barWidth / 2, height - 5)

    ctx.fillText("Optimized", barWidth + spacing + barWidth / 2, height - 5)

    // Draw counts
    ctx.fillStyle = "#ffffff"
    ctx.font = "14px sans-serif"

    if (naiveBarHeight > 20) {
      ctx.fillText(naiveRenderCount.toString(), spacing / 2 + barWidth / 2, height - naiveBarHeight + 20)
    } else {
      ctx.fillText(naiveRenderCount.toString(), spacing / 2 + barWidth / 2, height - naiveBarHeight - 10)
    }

    if (optimizedBarHeight > 20) {
      ctx.fillText(optimizedRenderCount.toString(), barWidth + spacing + barWidth / 2, height - optimizedBarHeight + 20)
    } else {
      ctx.fillText(optimizedRenderCount.toString(), barWidth + spacing + barWidth / 2, height - optimizedBarHeight - 10)
    }
  }, [naiveRenderCount, optimizedRenderCount])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart4 className="mr-2 h-5 w-5" />
          Performance Metrics
        </CardTitle>
        <CardDescription>Real-time statistics comparing render performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">Naive Renders:</span>
            </div>
            <span className="text-sm font-bold">{naiveRenderCount}</span>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center">
              <Zap className="mr-2 h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Optimized Renders:</span>
            </div>
            <span className="text-sm font-bold">{optimizedRenderCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Avg. Render Time:</span>
            <span className="text-sm font-bold">{averageRenderTime.toFixed(2)} ms</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Current Efficiency:</span>
            <span className={`text-sm font-bold ${isOptimized ? "text-green-500" : "text-amber-500"}`}>
              {isOptimized ? "High" : "Low"}
            </span>
          </div>
        </div>

        <div className="pt-4">
          <p className="text-sm font-medium mb-2">Render Count Comparison</p>
          <div className="bg-muted rounded-md p-2 h-48">
            <canvas ref={canvasRef} width={300} height={180} className="w-full h-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

