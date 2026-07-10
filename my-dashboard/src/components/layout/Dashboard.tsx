import "./Dashboard.css"
import Clock from "../../widgets/Clock/Clock"
import Weather from "../../widgets/Weather/Weather"
import Todo from "../../widgets/Todo/Todo"
import Notes from "../../widgets/Notes/Notes"
import Spotify from "../../widgets/Spotify/Spotify"
import Shortcuts from "../../widgets/Shortcuts/Shortcuts"
import Cat from "../../widgets/Cat/Cat"
import News from "../../widgets/News/News"

function Dashboard() {
    return (
        <main className="dashboard">
            <Clock />
            <Weather />
            <Spotify />
            <News />
            <Todo />
            <Shortcuts />
            <Cat />
            <Notes />
        </main>
    )
}

export default Dashboard
