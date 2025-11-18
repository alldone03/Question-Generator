import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";



export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate('/login');
    } else {
      const { email } = JSON.parse(user);
      setUser(email);
    }
  });


  const course = [
    {
      title: "Pengelolaan Gedung dan Ruang Terbuka Hijau",
      description: "Pelajari cara mengelola fasilitas secara efisien dan ramah lingkungan.",
      progress: 0,
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
      ,
      colorFrom: "blue-500",
      colorTo: "blue-600",

    },
    // {
    //   title: "Perancangan dan Pengelolaan Layanan Sarpras",
    //   description: "Strategi pengelolaan sarana dan prasarana untuk operasional yang unggul.",
    //   progress: 10,
    //   icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
    //     <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
    //   </svg>,
    //   colorFrom: "cyan-500",
    //   colorTo: "cyan-600",
    // },

  ]
  useEffect(() => {

    const circle = document.querySelector(".progress-ring__circle");
    if (!circle) return;

    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference - (70 / 100) * circumference;


    const lessonCards = document.querySelectorAll(".lesson-card");
    lessonCards.forEach((card) => {
      card.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
    });
  }, []);


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
                  <div>{user}</div>
                  <div>Teknisi</div>
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
                  <h2 className="text-xl font-semibold text-gray-800">Selamat Datang, {user}!</h2>
                </div>

              </div>
            </div>
          </section>

          {/* Courses */}
          <section className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Kursusmu</h2>
              <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Lihat Semua</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {course.map((item, index) => (
                <Link to={"/course"}
                  key={index}
                  state={{ title: item.title, description: item.description }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden transition duration-300 lesson-card hover:transform hover:scale-105 hover:shadow-lg"
                >
                  <div
                    className={`h-32 bg-${item.colorFrom} flex items-center justify-center`}
                  >
                    {item.icon}
                  </div>

                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm mb-4">{item.description}</p>

                    <div className="flex justify-between items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="ml-3 text-sm text-gray-500">{item.progress}%</span>
                    </div>
                  </div>
                </Link>
              ))}

            </div>
          </section>
          {/* Daily Challenge */}
          {/* <section className="mb-10">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-xl font-semibold text-gray-800">Tantangan Harian</h2>
                  <p className="text-gray-500">Selesaikan tantangan hari ini untuk mendapatkan XP bonus.</p>
                </div>
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center">
                  <i data-feather="award" className="mr-2 w-4 h-4" />
                  Mulai Tantangan
                </button>
              </div>
            </div>
          </section> */}
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