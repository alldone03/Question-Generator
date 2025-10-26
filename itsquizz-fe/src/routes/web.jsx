import Course from "../pages/course"
import Home from "../pages/home"
import Lesson from "../pages/lesson"
import Quiz from "../pages/quiz"
import ResultPage from "../pages/resultPage"



const routes = [
    {
        path: "/",
        element: <Home />,
        name: "home",
    },
    {
        path: "/lesson",
        element: <Lesson />,
        name: "lesson",
    }
    , {
        path: "/quiz",
        element: <Quiz />,
        name: "quiz",
    }
    , {
        path: "/course",
        element: <Course />,
        name: "course",
    }
    , {
        path: "/result",
        element: <ResultPage />,
        name: "result",
    }
]

export default routes