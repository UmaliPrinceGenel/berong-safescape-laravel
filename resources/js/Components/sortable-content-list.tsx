"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Trash2, GripVertical } from "lucide-react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Generic item interface - must have id and title at minimum
interface SortableItem {
    id: string | number
    title: string
    [key: string]: any
}

// Sortable Item Component
function SortableContentItem<T extends SortableItem>({
    item,
    renderContent,
    onDelete,
}: {
    item: T
    renderContent: (item: T) => React.ReactNode
    onDelete: (id: string | number) => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        ...(isDragging ? { zIndex: 50, position: 'relative' as const } : {}),
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`p-4 sm:p-5 border-2 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900/70 backdrop-blur-sm transition-shadow transition-colors duration-200 flex items-start justify-between gap-3 ${
                isDragging 
                    ? 'border-red-400 dark:border-red-500 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] opacity-95 ring-4 ring-red-100 dark:ring-red-900/30' 
                    : 'border-slate-200 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600'
            }`}
        >
            <div className="flex items-start gap-2.5 sm:gap-3 flex-1 min-w-0">
                <button
                    {...attributes}
                    {...listeners}
                    className={`touch-none cursor-grab active:cursor-grabbing p-1.5 sm:p-2 rounded-xl transition-colors flex items-center justify-center shrink-0 mt-0.5 ${
                        isDragging 
                            ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-900/50 shadow-inner' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 shadow-2xs'
                    }`}
                    aria-label="Drag to reorder"
                >
                    <GripVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>

                <div className="flex-1 min-w-0">
                    {renderContent(item)}
                </div>
            </div>

            <button
                type="button"
                onClick={() => onDelete(item.id)}
                className={`shrink-0 flex items-center justify-center font-extrabold h-9 w-9 sm:h-10 sm:w-10 rounded-xl text-sm transition-all ${
                    isDragging 
                        ? 'bg-red-200 text-red-500' 
                        : 'bg-[#d60000] text-white shadow-[0_3px_0_#991b1b] hover:-translate-y-0.5 hover:shadow-[0_5px_0_#991b1b] active:translate-y-1 active:shadow-none'
                }`}
                aria-label="Delete item"
                disabled={isDragging}
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    )
}

// Main Sortable Content List Component
export function SortableContentList<T extends SortableItem>({
    items,
    title,
    description,
    onReorder,
    onDelete,
    renderContent,
}: {
    items: T[]
    title: string
    description: string
    onReorder: (newOrder: T[]) => Promise<void>
    onDelete: (id: string | number) => void
    renderContent: (item: T) => React.ReactNode
}) {
    const [localItems, setLocalItems] = useState(items)

    // Update local state when prop changes
    useEffect(() => {
        setLocalItems(items)
    }, [items])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 150,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        if (!over || active.id === over.id) {
            return
        }

        const oldIndex = localItems.findIndex((item) => item.id === active.id)
        const newIndex = localItems.findIndex((item) => item.id === over.id)

        const newOrder = arrayMove(localItems, oldIndex, newIndex)

        // Optimistic update
        setLocalItems(newOrder)

        try {
            await onReorder(newOrder)
        } catch (error) {
            // Revert on error
            setLocalItems(items)
        }
    }

    return (
        <Card className="rounded-[1.5rem] sm:rounded-[2rem] border-[3px] border-slate-200 dark:border-slate-700 shadow-[0_8px_0_#cbd5e1] dark:shadow-[0_8px_0_#0f172a] overflow-hidden bg-slate-50 dark:bg-slate-800/50 backdrop-blur-md transition-all mb-6">
            <CardHeader className="p-5 sm:p-6 pb-3 sm:pb-4">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-sm shrink-0">
                            <GripVertical className="h-5 w-5 sm:h-6 sm:w-6 text-[#d60000]" strokeWidth={2.5} />
                        </div>
                        <div className="min-w-0">
                            <CardTitle className="text-lg sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight truncate">
                                {title}
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5 line-clamp-1">
                                {description}
                            </CardDescription>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                {localItems.length === 0 ? (
                    <div className="text-center py-10 px-4 bg-white/60 dark:bg-slate-900/40 rounded-xl sm:rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">No items in collection yet</p>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={localItems.map((item) => item.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-3 sm:space-y-4">
                                {localItems.map((item) => (
                                    <SortableContentItem
                                        key={item.id}
                                        item={item}
                                        renderContent={renderContent}
                                        onDelete={onDelete}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </CardContent>
        </Card>
    )
}
