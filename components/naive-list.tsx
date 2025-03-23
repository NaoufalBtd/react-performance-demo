"use client"

import { useState, useEffect, useRef } from "react"
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

interface NaiveListProps {
  items: Item[]
  searchTerm: string
  onRender: () => void
}

// Fix the NaiveList component to avoid unnecessary renders
export function NaiveList({ items, searchTerm, onRender }: NaiveListProps) {
  // Only call onRender when items or searchTerm changes
  const prevItemsLength = useRef(items.length)
  const prevSearchTerm = useRef(searchTerm)

  useEffect(() => {
    // Only trigger render count when something actually changes
    if (prevItemsLength.current !== items.length || prevSearchTerm.current !== searchTerm) {
      onRender()
      prevItemsLength.current = items.length
      prevSearchTerm.current = searchTerm
    }
  }, [searchTerm, items, onRender])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <NaiveItem key={item.id} item={item} />
      ))}
    </div>
  )
}

interface NaiveItemProps {
  item: Item
}

// Fix the infinite loop in NaiveItem by adding a ref to track renders instead of state
function NaiveItem({ item }: NaiveItemProps) {
  const [renderCount, setRenderCount] = useState(1)
  const hasRendered = useRef(false)

  // Only increment render count on first render and when props change
  useEffect(() => {
    if (hasRendered.current) {
      setRenderCount((prev) => prev + 1)
    } else {
      hasRendered.current = true
    }
  }, [item]) // Only run when item changes

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

