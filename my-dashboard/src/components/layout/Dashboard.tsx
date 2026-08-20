import { useEffect, useState, type DragEvent, type KeyboardEvent } from "react"
import "./Dashboard.css"
import Clock from "../../widgets/Clock/Clock"
import Weather from "../../widgets/Weather/Weather"
import Todo from "../../widgets/Todo/Todo"
import Notes from "../../widgets/Notes/Notes"
import Spotify from "../../widgets/Spotify/Spotify"
import Shortcuts from "../../widgets/Shortcuts/Shortcuts"
import Cat from "../../widgets/Cat/Cat"
import News from "../../widgets/News/News"

const widgets = {
    weather: { label: "Weather", Component: Weather },
    spotify: { label: "Spotify", Component: Spotify },
    news: { label: "News", Component: News },
    todo: { label: "Todo", Component: Todo },
    shortcuts: { label: "Shortcuts", Component: Shortcuts },
    cat: { label: "Cat", Component: Cat },
} as const

type WidgetId = keyof typeof widgets

const defaultWidgetOrder: WidgetId[] = [
    "weather",
    "spotify",
    "news",
    "todo",
    "shortcuts",
    "cat",
]

const widgetOrderStorageKey = "dashboard-widget-order"

function isWidgetId(id: unknown): id is WidgetId {
    return typeof id === "string" && defaultWidgetOrder.includes(id as WidgetId)
}

function getInitialWidgetOrder(): WidgetId[] {
    try {
        const savedOrder: unknown = JSON.parse(
            localStorage.getItem(widgetOrderStorageKey) ?? "[]",
        )

        if (!Array.isArray(savedOrder)) return defaultWidgetOrder

        const validSavedOrder = savedOrder.filter(
            (id): id is WidgetId => isWidgetId(id),
        )

        return [
            ...new Set(validSavedOrder),
            ...defaultWidgetOrder.filter(id => !validSavedOrder.includes(id)),
        ]
    } catch {
        return defaultWidgetOrder
    }
}

function Dashboard() {
    const [widgetOrder, setWidgetOrder] = useState<WidgetId[]>(getInitialWidgetOrder)
    const [draggedWidget, setDraggedWidget] = useState<WidgetId | null>(null)
    const [dropTarget, setDropTarget] = useState<WidgetId | null>(null)

    useEffect(() => {
        localStorage.setItem(widgetOrderStorageKey, JSON.stringify(widgetOrder))
    }, [widgetOrder])

    function moveWidget(widgetId: WidgetId, targetId: WidgetId) {
        if (widgetId === targetId) return

        setWidgetOrder(currentOrder => {
            const nextOrder = [...currentOrder]
            const currentIndex = nextOrder.indexOf(widgetId)
            const targetIndex = nextOrder.indexOf(targetId)

            nextOrder[currentIndex] = targetId
            nextOrder[targetIndex] = widgetId

            return nextOrder
        })
    }

    function moveWidgetWithKeyboard(
        event: KeyboardEvent<HTMLButtonElement>,
        widgetId: WidgetId,
    ) {
        const columnCount = 3
        const direction = {
            ArrowLeft: -1,
            ArrowRight: 1,
            ArrowUp: -columnCount,
            ArrowDown: columnCount,
        }[event.key]

        if (direction === undefined) return

        event.preventDefault()

        setWidgetOrder(currentOrder => {
            const currentIndex = currentOrder.indexOf(widgetId)
            const targetIndex = Math.max(
                0,
                Math.min(currentOrder.length - 1, currentIndex + direction),
            )

            if (currentIndex === targetIndex) return currentOrder

            const nextOrder = [...currentOrder]
            const targetWidget = nextOrder[targetIndex]

            nextOrder[currentIndex] = targetWidget
            nextOrder[targetIndex] = widgetId

            return nextOrder
        })
    }

    function handleDragStart(event: DragEvent<HTMLDivElement>, widgetId: WidgetId) {
        const target = event.target as HTMLElement
        const isInteractiveElement = target.closest(
            "a, button, input, textarea, select, [contenteditable='true']",
        )

        if (isInteractiveElement && !target.closest(".widget-drag-handle")) {
            event.preventDefault()
            return
        }

        event.dataTransfer.effectAllowed = "move"
        event.dataTransfer.setData("text/plain", widgetId)
        setDraggedWidget(widgetId)
    }

    function handleDrop(event: DragEvent<HTMLDivElement>, targetId: WidgetId) {
        event.preventDefault()

        const widgetId = event.dataTransfer.getData("text/plain")
        if (isWidgetId(widgetId)) moveWidget(widgetId, targetId)

        setDraggedWidget(null)
        setDropTarget(null)
    }

    return (
        <main className="dashboard">
            <Clock />
            {widgetOrder.map(widgetId => {
                const { label, Component } = widgets[widgetId]

                return (
                    <div
                        key={widgetId}
                        className={`draggable-widget${draggedWidget === widgetId ? " is-dragging" : ""}${dropTarget === widgetId && draggedWidget !== widgetId ? " is-drop-target" : ""}`}
                        draggable
                        onDragStart={event => handleDragStart(event, widgetId)}
                        onDragEnter={() => setDropTarget(widgetId)}
                        onDragOver={event => {
                            event.preventDefault()
                            event.dataTransfer.dropEffect = "move"
                        }}
                        onDrop={event => handleDrop(event, widgetId)}
                        onDragEnd={() => {
                            setDraggedWidget(null)
                            setDropTarget(null)
                        }}
                    >
                        <button
                            type="button"
                            className="widget-drag-handle"
                            aria-label={`Move ${label} widget. Use the arrow keys or drag.`}
                            title={`Drag to move ${label}`}
                            onKeyDown={event => moveWidgetWithKeyboard(event, widgetId)}
                        >
                            &#8942;&#8942;
                        </button>
                        <Component />
                    </div>
                )
            })}
            <Notes />
        </main>
    )
}

export default Dashboard
