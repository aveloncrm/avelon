'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

interface KanbanItem {
  id: string
  title: string
  subtitle?: string
  value?: string
  metadata?: Record<string, any>
}

interface KanbanColumn {
  id: string
  title: string
  items: KanbanItem[]
  color?: string
}

interface KanbanBoardProps {
  columns: KanbanColumn[]
  onItemClick?: (item: KanbanItem, columnId: string) => void
  onChange?: (itemId: string, fromColumnId: string, toColumnId: string) => void
  renderCard?: (item: KanbanItem) => React.ReactNode
  className?: string
}

export function KanbanBoard({ columns, onItemClick, onChange, renderCard, className }: KanbanBoardProps) {
  const [draggedItem, setDraggedItem] = useState<{ item: KanbanItem; fromColumn: string } | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  const handleDragStart = (item: KanbanItem, columnId: string) => {
    setDraggedItem({ item, fromColumn: columnId })
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverColumn(null)
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    if (draggedItem && draggedItem.fromColumn !== columnId) {
      setDragOverColumn(columnId)
    }
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (toColumnId: string) => {
    if (draggedItem && draggedItem.fromColumn !== toColumnId) {
      onChange?.(draggedItem.item.id, draggedItem.fromColumn, toColumnId)
    }
    setDraggedItem(null)
    setDragOverColumn(null)
  }

  return (
    <div className={cn('flex gap-4 overflow-x-auto pb-4', className)}>
      {columns.map((column) => (
        <div
          key={column.id}
          className={cn(
            'flex-shrink-0 w-80 transition-all',
            dragOverColumn === column.id && draggedItem && draggedItem.fromColumn !== column.id
              ? 'scale-105 shadow-lg'
              : ''
          )}
          onDragOver={(e) => handleDragOver(e, column.id)}
          onDragLeave={handleDragLeave}
          onDrop={() => handleDrop(column.id)}
        >
          <Card
            className={cn(
              'transition-all',
              dragOverColumn === column.id && draggedItem && draggedItem.fromColumn !== column.id
                ? 'ring-2 ring-primary ring-offset-2'
                : ''
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  {column.title}
                </CardTitle>
                <Badge variant="secondary" className="ml-2">
                  {column.items.length}
                </Badge>
              </div>
              {column.color && (
                <div className={cn('h-1 w-full rounded-full mt-2', column.color)} />
              )}
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-3">
                  {column.items.map((item) => {
                    const isDragging = draggedItem?.item.id === item.id
                    return (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={() => handleDragStart(item, column.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => !isDragging && onItemClick?.(item, column.id)}
                        className={cn(
                          'cursor-move transition-all',
                          isDragging ? 'opacity-50 scale-95' : 'cursor-pointer'
                        )}
                      >
                        {renderCard ? (
                          renderCard(item)
                        ) : (
                          <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                              {item.subtitle && (
                                <p className="text-xs text-muted-foreground mb-2">
                                  {item.subtitle}
                                </p>
                              )}
                              {item.value && (
                                <p className="text-sm font-semibold">{item.value}</p>
                              )}
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )
                  })}
                  {column.items.length === 0 && (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      No items
                    </div>
                  )}
                  {dragOverColumn === column.id && draggedItem && draggedItem.fromColumn !== column.id && (
                    <div className="border-2 border-dashed border-primary rounded-lg p-4 text-center text-sm text-muted-foreground">
                      Drop here
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}

