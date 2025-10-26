



export default function Course() {


  const modulPelatihan = [
    {
      title: "Pengembangan/Penambahan Sarana dan Prasarana",
      modulePelatihan: [{
        title: "Pengenalan Sarana dan Prasarana",
        duration: "15 min",
        xp: "20 XP",
        status: "completed",

      }, {
        title: "Perencanaan Sarana dan Prasarana",
        duration: "20 min",
        xp: "25 XP",
        status: "completed",
      }, {
        title: "Pengembangan/Penambahan Sarana dan Prasarana",
        duration: "25 min",
        xp: "30 XP",
        status: "current",

      },
      {
        title: "Pemeliharaan Sarana dan Prasarana",
        duration: "30 min",
        xp: "35 XP",
        status: "locked",
      }

      ]
    }


  ];


  return (
    <>
      <div>
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <a href="index.html" className="text-gray-500 hover:text-indigo-600">
                <i data-feather="arrow-left" />
              </a>
              <h1 className="text-xl font-bold text-gray-800 ml-2">Pengelolaan Gedung dan Ruang Terbuka Hijau</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <i data-feather="star" className="text-yellow-400 mr-1" />
                <span className="font-medium">45%</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <i data-feather="user" className="text-indigo-600" />
              </div>
            </div>
          </div>
        </header>
        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Course Progress */}
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Progres Pelatihan</h2>
                <span className="text-sm text-gray-500">3/7 Modul Selesai</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>
          </section>
          {/* Current Lesson */}
          {/* <section className="mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-sm font-medium">Pelajaran Saat Ini</span>
                  <h2 className="text-xl font-semibold mt-1">Pengelolaan Usulan Pengadaan Sarana Dan Prasarana </h2>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <i data-feather="shield" className="w-6 h-6" />
                </div>
              </div>
              <p className="mb-6">Pelajari cara mengelola sarana dan prasarana</p>
              <button className="w-full py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-opacity-90 transition flex items-center justify-center">
                <i data-feather="play" className="mr-2" />
                Lanjutkan Pelatihan
              </button>
            </div>
          </section> */}
          {/* Modules */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Modul Pelatihan</h2>
            <div className="space-y-3">
              {/* Module 1 (Completed) */}
              {
                
              }
              <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <i data-feather="check" className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Pengenalan Sarana dan Prasarana</h3>
                    <p className="text-sm text-gray-500">15 min • 20 XP</p>
                  </div>
                </div>
                <i data-feather="chevron-right" className="text-gray-400" />
              </div>
              {/* Module 2 (Completed) */}
              <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <i data-feather="check" className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">	Perencanaan Sarana dan Prasarana</h3>
                    <p className="text-sm text-gray-500">20 min • 25 XP</p>
                  </div>
                </div>
                <i data-feather="chevron-right" className="text-gray-400" />
              </div>
              {/* Module 3 (Current) */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-sm p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-medium">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Pengembangan/Penambahan Sarana dan Prasarana</h3>
                    <p className="text-sm text-gray-500">25 min • 30 XP</p>
                  </div>
                </div>
                <i data-feather="chevron-right" className="text-blue-400" />
              </div>
              {/* Module 4 (Locked) */}
              <div className="bg-gray-50 rounded-lg shadow-sm p-4 flex items-center justify-between opacity-75">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    <i data-feather="lock" className="text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">Pemeliharaan Sarana dan Prasarana</h3>
                    <p className="text-sm text-gray-400">Selesaikan Pelatihan Sebelumnya untuk Membuka</p>
                  </div>
                </div>
                <i data-feather="chevron-right" className="text-gray-400" />
              </div>
            </div>
          </section>
          {/* Quiz Preview */}
          {/* <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quizz Latihan</h2>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-800">Contoh Pertanyaan</h3>
              </div>
              <p className="mb-6">pemeliharaan sarana dan prasarana harus dilakukan secara...</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                <div className="option-card bg-gray-50 p-4 rounded-lg border border-gray-200 transition cursor-pointer">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 mr-3" />
                    <span>Insidental dan saat ada laporan kerusakan</span>
                  </div>
                </div>
                <div className="option-card bg-gray-50 p-4 rounded-lg border border-gray-200 transition cursor-pointer">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 mr-3" />
                    <span>Tahunan dan saat anggaran tersedia</span>
                  </div>
                </div>
                <div className="option-card bg-gray-50 p-4 rounded-lg border border-gray-200 transition cursor-pointer">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 mr-3" />
                    <span>Teratur, sistematis, dan terus menerus</span>
                  </div>
                </div>
                <div className="option-card bg-gray-50 p-4 rounded-lg border border-gray-200 transition cursor-pointer">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 mr-3" />
                    <span>Saat ada waktu luang dari teknisi</span>
                  </div>
                </div>
              </div>
              <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                Mulai Latihan Quizz
              </button>
            </div>
          </section> */}
        </main>
        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg md:hidden">
          <div className="flex justify-around">
            <a href="index.html" className="p-4 text-gray-500">
              <i data-feather="home" />
            </a>
            <a href="#" className="p-4 text-blue-600">
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