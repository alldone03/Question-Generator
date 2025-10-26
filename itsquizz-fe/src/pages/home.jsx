import { useEffect } from "react";
import { Link } from "react-router-dom";



export default function Home() {


  const course = [
    {
      title: "Pengelolaan Gedung dan Ruang Terbuka Hijau",
      description: "Pelajari cara mengelola fasilitas secara efisien dan ramah lingkungan.",
      progress: 0,
      icon: "shield",
      colorFrom: "blue-500",
      colorTo: "blue-600",
    },
    {
      title: "Perancangan dan Pengelolaan Layanan Sarpras",
      description: "Strategi pengelolaan sarana dan prasarana untuk operasional yang unggul.",
      progress: 10,
      icon: "users",
      colorFrom: "green-500",
      colorTo: "green-600",
    },
    {
      title: "Pengelolaan Program Smart Eco Campus",
      description: "Memimpin transformasi menuju kampus digital yang hijau dan cerdas.",
      progress: 20,
      icon: "trending-up",
      colorFrom: "purple-500",
      colorTo: "purple-600",
    }
  ]
  useEffect(() => {
    // Ganti icon Feather


    // Ambil elemen circle
    const circle = document.querySelector(".progress-ring__circle");
    if (!circle) return;

    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference - (70 / 100) * circumference;

    // Tambahkan animasi ke lesson-card
    const lessonCards = document.querySelectorAll(".lesson-card");
    lessonCards.forEach((card) => {
      card.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
    });
  }, []);


  return (
    <>
      <div>
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <i data-feather="book-open" className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">ITS Quizz</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <i data-feather="bell" className="text-gray-500 hover:text-indigo-600 cursor-pointer" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <i data-feather="user" className="text-indigo-600" />
              </div>
            </div>
          </div>
        </header>
        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* User Progress */}
          <section className="mb-10">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-xl font-semibold text-gray-800">Selamat Datang, ITS!</h2>
                </div>
                {/* <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <circle cx={18} cy={18} r={16} fill="none" stroke="#e6e6e6" strokeWidth={2} />
                      <circle className="progress-ring__circle" cx={18} cy={18} r={16} fill="none" stroke="#4f46e5" strokeWidth={2} strokeDasharray="100 100" strokeDashoffset={30} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-800">70%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Progress Pelatihan</p>
                    <p className="font-semibold text-gray-800">14/20 Latihan</p>
                  </div>
                </div> */}
              </div>
            </div>
          </section>
          {/* Daily Goal */}
          {/* <section className="mb-10">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-xl font-semibold">Tujuan Hari Ini</h2>
                  <p>Selesaikan 3 pelajaran untuk mendapatkan 50 XP</p>
                </div>
                <button className="px-6 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-opacity-90 transition">Mulai
                  Pembelajaran</button>
              </div>
              <div className="mt-6 w-full bg-white bg-opacity-20 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '33%' }} />
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span>1/3 Pelajaran</span>
                <span>50 XP</span>
              </div>
            </div>

          </section> */}
          {/* Courses */}
          <section className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Kursusmu</h2>
              <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Lihat Semua</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {course.map((item, index) => (
                <Link to={"/lesson"}
                  key={index}
                  state={{ title: item.title, description: item.description }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden transition duration-300 lesson-card hover:transform hover:scale-105 hover:shadow-lg"
                >
                  <div
                    className={`h-32 bg-gradient-to-r from-${item.colorFrom} to-${item.colorTo} flex items-center justify-center`}
                  >
                    <i data-feather={item.icon} className="text-white w-10 h-10" />
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