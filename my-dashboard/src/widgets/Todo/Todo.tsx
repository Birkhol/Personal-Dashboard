import { useEffect, useState } from "react"
import "./Todo.css"

type TodoItem = {
    id: number
    text: string
    completed: boolean
}

function Todo() {
    const [todoList, setTodoList] = useState<TodoItem[]>(() => {
        const savedTodos = localStorage.getItem("todos")

        if (savedTodos === null) {
            return []
        }

        return JSON.parse(savedTodos)
    })

    const [newTask, setNewTask] = useState("")

    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todoList))
    }, [todoList])

    function addTask(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault()

        if (newTask.trim() === "") {
            return
        }

        const newTodo = {
            id: Date.now(),
            text: newTask,
            completed: false
        }

        setTodoList([...todoList, newTodo])
        setNewTask("")
    }

    function toggleTodo(id: number) {
        setTodoList(
            todoList.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        )
    }

    function deleteTodo(id: number) {
        setTodoList(todoList.filter(todo => todo.id !== id))
    }

    return (
        <section className="widget todo">
            <h2>Todo</h2>
            <div className="widget-content">
                <ul>
                    {todoList.map(todo =>
                        <li key={todo.id}> <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
                        <span id="todoText" className={todo.completed ? "completed" : ""}>
                            {todo.text}
                        </span>
                        <button type="button" id="deleteButton" onClick={() => deleteTodo(todo.id)}>
                            &#128465;
                        </button>
                        </li>
                    )}
                </ul>
                <form onSubmit={addTask} autoComplete="off">
                    <input type="text" value={newTask} name="todoAdd" id="todoAdd" onChange={event => setNewTask(event.target.value)}></input>
                    <input type="submit" value="Add" id="addTaskButton"></input>
                </form>
            </div>
        </section>
    )
}

export default Todo