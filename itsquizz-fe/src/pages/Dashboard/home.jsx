import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";



export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/course");
      const json = await res.json();

      setCourses(json || []);

    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const data = localStorage.getItem("user");

    if (!data) {
      navigate("/login");
      return;
    }

    const parsed = JSON.parse(data);
    setUser(parsed);

    fetchCourses();
  }, []);



  if (loading) return <p>Loading...</p>;



  const handleLogout = async () => {
    try {
      // Panggil API logout di Flask
      await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include", // wajib untuk hapus session
      });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      console.log("Gagal logout ke server");
    }

    // Hapus user dari localStorage
    localStorage.removeItem("user");

    // Arahkan ke login
    navigate("/login");
  };

  return (
    <>
      <div>
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-800">ITS Quizz</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <i data-feather="bell" className="text-gray-500 hover:text-indigo-600 cursor-pointer" />
                {/* <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" /> */}

                <div className="flex flex-col items-end text-sm">
                  <div>{user.email}</div>
                  <div>{user.jabatan}</div>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </div>
              <div onClick={handleLogout} className="hover:transform hover:scale-105 hover:shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>

              </div>
            </div>
          </div>
        </header>
        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* User Progress */}
          <section className="mb-10">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row items-center justify-between ">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-xl font-semibold text-gray-800">Selamat Datang, {user.email}!</h2>
                </div>

              </div>
            </div>
          </section>

          {/* Courses */}
          <section className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Kursusmu</h2>
              {/* <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Lihat Semua</a> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {courses.map((item, index) => (
                <Link to={"/course"}
                  key={index}
                  state={{ title: item.course_name, course_id: item.id }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden transition duration-300 lesson-card hover:transform hover:scale-105 hover:shadow-lg"
                >
                  <div
                    className={`h-32 bg-blue-500 flex items-center justify-center`}
                  >
                    <img src="https://cdn-icons-png.flaticon.com/512/6342/6342791.png" alt="course" className="h-20 w-20 invert" />
                  </div>

                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">{item.course_name}</h3>
                    {/* <p className="text-gray-500 text-sm mb-4">{item.description}</p> */}

                    <div className="flex justify-between items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        {/* <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${item.progress}%` }}
                        /> */}
                      </div>
                      {/* <span className="ml-3 text-sm text-gray-500">{item.progress}%</span> */}
                    </div>
                  </div>
                </Link>
              ))}

            </div>
          </section>
          <section className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Puzzle</h2>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to={"/puzzleac"}
                className="bg-white rounded-xl shadow-sm overflow-hidden transition duration-300 lesson-card hover:transform hover:scale-105 hover:shadow-lg"
              >
                <div
                  className={`h-32 bg-blue-500 flex items-center justify-center`}
                >

                  <img src="https://cdn-icons-png.flaticon.com/512/4205/4205637.png" alt="puzzle" className="h-20 w-20 invert" />
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Puzzle Urutan Pemasangan AC</h3>
                  <div className="flex justify-between items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                    </div>
                  </div>
                </div>
              </Link>


            </div>
          </section>

        </main>
        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg md:hidden">
          <div className="flex justify-around">
            <a href="#" className="p-4 text-indigo-600">
              <i data-feather="home" />
            </a>
            <a href="#" className="p-4 text-gray-500">
              <i data-feather="book" />
            </a>
            <a href="#" className="p-4 text-gray-500">
              <i data-feather="award" />
            </a>
            <a href="#" className="p-4 text-gray-500">
              <i data-feather="user" />
            </a>
          </div>
        </nav>
      </div>
    </>
  )
}