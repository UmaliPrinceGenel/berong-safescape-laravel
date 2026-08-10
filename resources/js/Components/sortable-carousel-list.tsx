"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Trash2, GripVertical, ImageIcon } from "lucide-react"
import type { CarouselImage } from "@/lib/mock-data"
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

// Sortable Carousel Item Component
function SortableCarouselItem({
    image,
    onDelete
}: {
    image: CarouselImage
    onDelete: (id: string | number) => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: image.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        ...(isDragging ? { zIndex: 50, position: 'relative' as const } : {}),
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`p-4 sm:p-5 border-2 rounded-2xl bg-white dark:bg-slate-900/70 backdrop-blur-sm transition-shadow transition-colors duration-200 flex flex-col sm:flex-row items-start sm:items-center gap-3 ${
                isDragging 
                    ? 'border-red-400 dark:border-red-500 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] opacity-95 ring-4 ring-red-100 dark:ring-red-900/30' 
                    : 'border-slate-200 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600'
            }`}
        >
            <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                <button
                    {...attributes}
                    {...listeners}
                    className={`touch-none cursor-grab active:cursor-grabbing p-2 rounded-xl transition-colors flex items-center justify-center shrink-0 ${
                        isDragging 
                            ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-900/50 shadow-inner' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 shadow-2xs'
                    }`}
                    aria-label="Drag to reorder"
                >
                    <GripVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>

                {image.url && (
                    <div className="h-12 w-20 sm:h-14 sm:w-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                        <img src={image.url} alt={image.altText || image.title} className="h-full w-full object-cover" />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0 w-full">
                <h4 className="font-black text-sm sm:text-base text-slate-800 dark:text-white leading-snug break-words [word-break:break-word]">
                    {image.title}
                </h4>
            </div>

            <button
                type="button"
                onClick={() => onDelete(image.id)}
                className={`shrink-0 flex items-center justify-center font-extrabold h-9 w-9 sm:h-10 sm:w-10 rounded-xl text-sm transition-all ml-auto ${
                    isDragging 
                        ? 'bg-red-200 text-red-500' 
                        : 'bg-[#d60000] text-white shadow-[0_3px_0_#991b1b] hover:-translate-y-0.5 hover:shadow-[0_5px_0_#991b1b] active:translate-y-1 active:shadow-none'
                }`}
                aria-label="Delete image"
                disabled={isDragging}
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    )
}

// Main Sortable Carousel List Component
export function SortableCarouselList({
    images,
    onReorder,
    onDelete,
}: {
    images: CarouselImage[]
    onReorder: (newOrder: CarouselImage[]) => Promise<void>
    onDelete: (id: string | number) => void
}) {
    const [localImages, setLocalImages] = useState(images)

    // Update local state when prop changes
    useEffect(() => {
        setLocalImages(images)
    }, [images])

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

        const oldIndex = localImages.findIndex((img) => img.id === active.id)
        const newIndex = localImages.findIndex((img) => img.id === over.id)

        const newOrder = arrayMove(localImages, oldIndex, newIndex)

        // Optimistic update
        setLocalImages(newOrder)

        try {
            await onReorder(newOrder)
        } catch (error) {
            // Revert on error
            setLocalImages(images)
        }
    }

    return (
        <Card className="rounded-[1.5rem] sm:rounded-[2rem] border-[3px] border-slate-200 dark:border-slate-700 shadow-[0_8px_0_#cbd5e1] dark:shadow-[0_8px_0_#0f172a] overflow-hidden bg-slate-50 dark:bg-slate-800/50 backdrop-blur-md transition-all mb-6">
            <CardHeader className="px-4 sm:px-6 pt-5 sm:pt-6 pb-2">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-sm shrink-0">
                            <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6 text-[#d60000]" strokeWidth={2.5} />
                        </div>
                        <div className="min-w-0">
                            <CardTitle className="text-lg sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight truncate">
                                Current Carousel Images
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5 line-clamp-1">
                                {images.length} images in carousel • Drag to reorder
                            </CardDescription>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-5 sm:pb-6 pt-3 sm:pt-4">
                {localImages.length === 0 ? (
                    <div className="text-center py-10 px-4 bg-white/60 dark:bg-slate-900/40 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <ImageIcon className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">No carousel images uploaded yet</p>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={localImages.map((img) => img.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-3 sm:space-y-4">
                                {localImages.map((image) => (
                                    <SortableCarouselItem
                                        key={image.id}
                                        image={image}
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
