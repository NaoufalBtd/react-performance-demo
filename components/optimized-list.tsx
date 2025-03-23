"use client"

import { useState, useEffect, memo, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Repeat } from "lucide-react"

interface Item {
  id: number
  name: string
  description: string
  category: string
  price: number
}

interface OptimizedListProps {
  items: Item[]
  onRender: () => void
}

export function OptimizedList({ items, onRender }: OptimizedListProps) {
  const prevItemsLength = useRef(items.length)

  useEffect(() => {
    // Only trigger render count when something actually changes
    if (prevItemsLength.current !== items.length) {
      onRender()
      prevItemsLength.current = items.length
    }
  }, [items, onRender])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <MemoizedItem key={item.id} item={item} />
      ))}
    </div>
  )
}

interface OptimizedItemProps {
  item: Item
}

function OptimizedItemComponent({ item }: OptimizedItemProps) {
  const [renderCount, setRenderCount] = useState(1)
  const hasRendered = useRef(false)

  // Only increment render count on first render and when props change
  useEffect(() => {
    if (hasRendered.current) {
      setRenderCount((prev) => prev + 1)
    } else {
      hasRendered.current = true
    }
  }, [item])

  return (
    <Card className="overflow-hidden transition-all duration-300 animate-highlight">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
          <Badge variant="outline" className="ml-2">
            ${item.price}
          </Badge>
        </div>
        <div className="flex justify-between items-center mt-4">
          <Badge variant="secondary">{item.category}</Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Repeat className="h-3 w-3 mr-1" />
            <span>Renders: {renderCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Memoize the item component to prevent unnecessary re-renders
const MemoizedItem = memo(OptimizedItemComponent)

