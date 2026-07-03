import "./Dashboard.css"
import Clock from "../../widgets/Clock/Clock"
import Weather from "../../widgets/Weather/Weather"
import Todo from "../../widgets/Todo/Todo"
import Notes from "../../widgets/Notes/Notes"
import Spotify from "../../widgets/Spotify/Spotify"
import Shortcuts from "../../widgets/Shortcuts/Shortcuts"

function Dashboard() {
    return (
        <main className="dashboard">
            <Clock />
            <Weather />
            <Spotify />
            <Todo />
            <Shortcuts />
            <Notes />
        </main>
    )
}

export default Dashboard