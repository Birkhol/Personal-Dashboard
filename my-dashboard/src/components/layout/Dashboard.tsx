import "./Dashboard.css"
import Clock from "../../widgets/Clock/Clock"
import Weather from "../../widgets/Weather/Weather"
import Todo from "../../widgets/Todo/Todo"
import Notes from "../../widgets/Notes/Notes"

function Dashboard() {
    return (
        <main className="dashboard">
            <Clock />
            <Weather />
            <Todo />
            <Notes />
        </main>
    )
}

export default Dashboard