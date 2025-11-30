import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";




export default function Course() {

  const { state } = useLocation();
  const navigate = useNavigate();

  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  const courseId = state?.course_id;

  useEffect(() => {
    if (!courseId) return;

    fetchLevels();
  }, [courseId]);

  const fetchLevels = async () => {
    try {
      const res = await fetch(`http://localhost:5000/level/${courseId}`);
      const json = await res.json();
      setLevels(json || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;


  const modulPelatihan = levels.map((item, index) => {
    let status;
    if (index === 0) status = "completed";
    else if (index === 1) status = "current";
    else status = "locked";

    let duration;
    if (item.level_name === "Mudah") duration = "15 min";
    if (item.level_name === "Sedang") duration = "20 min";
    if (item.level_name === "Sulit") duration = "25 min";

    let xp;
    if (item.level_name === "Mudah") xp = "20 XP";
    if (item.level_name === "Sedang") xp = "25 XP";
    if (item.level_name === "Sulit") xp = "30 XP";

    return {
      title: `Level ${item.level_name} `,
      duration,
      xp,
      status,
    };
  });

  const handleIconModulePelatihan = (status) => {
    if (status == "locked") {
      return (<>
        <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>

        </div>
      </>);
    } else if (status == "current") {
      return (<>
        <div className=" w-10 h-10 rounded-full bg-green-200 flex items-center justify-center mr-4">

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </div>
      </>);
    } else if (status == "completed") {
      return (<>
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>

      </>);
    }
  }



    ;


  return (
    <>
      <div>
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div onClick={() => { navigate(-1) }} className="text-gray-500  hover:text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-800 ml-2">{state.title}</h1>
            </div>
            <div className="flex items-center space-x-4">
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
                <span className="text-sm text-gray-500">{modulPelatihan.filter(modul => modul.status === "completed").length}/{modulPelatihan.length} Modul Selesai</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: (modulPelatihan.filter(modul => modul.status === "completed").length / modulPelatihan.length) * 100 + "%" }} />
              </div>
            </div>
          </section>
          {/* Current Lesson */}
          {/* Modules */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Modul Pelatihan</h2>
            <div className="space-y-3">
              {/* Module 1 (Completed) */}
              {
                modulPelatihan.map((item, index) => (
                  <>
                    {<Link to={"/lesson"}
                      key={index}
                      state={{ title: item.title, description: item.description, level_id: levels[index]?.id }}
                      className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between hover:transform hover:scale-105 hover:shadow-lg">
                      <div className="flex items-center">
                        <div >
                          {handleIconModulePelatihan(item.status)}
                        </div>
                        <div className="flex flex-col items-start">
                          <h3 className="font-medium text-gray-800">{item.title}</h3>
                          <p className="text-sm text-gray-500">{item.duration} • {item.xp}</p>
                        </div>
                      </div>

                    </Link>}
                  </>
                ))
              }



            </div>
          </section>

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