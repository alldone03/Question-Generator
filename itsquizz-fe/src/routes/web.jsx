import Course from "../pages/course"
import Home from "../pages/home"
import Lesson from "../pages/lesson"
import LoginPage from "../pages/login"
import Quiz from "../pages/quiz"
import RegisterPage from "../pages/register"
import ResultPage from "../pages/resultPage"
import ProtectedRoute from "../middleware/ProtectedRoute"
import GuestRoute from "../middleware/GuestRoute"



const routes = [

    {
        path: "/login",
        element:
            <GuestRoute>
                <LoginPage />
            </GuestRoute>,
        name: "login",
    },
    {
        path: "/register",
        element: <RegisterPage />,
        name: "register",
    },
    {
        path: "/",
        element:
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>,
        name: "home",
    },

    {
        path: "/lesson",
        element:
            <ProtectedRoute>
                <Lesson />
            </ProtectedRoute>,
        name: "lesson",
    }
    , {
        path: "/quiz",
        element: <Quiz />,
        name: "quiz",
    }
    , {
        path: "/course",
        element: <ProtectedRoute>
            <Course />
        </ProtectedRoute>,
        name: "course",
    }
    , {
        path: "/result",
        element: <ProtectedRoute>
            <ResultPage />
        </ProtectedRoute>,
        name: "result",
    }
]

export default routes