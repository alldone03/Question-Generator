export default function CourseRecommendation() {
    const courses = [
        {
            id: 1,
            title: "Basic Electrical Safety",
            level: "Beginner",
            desc: "Belajar dasar keselamatan listrik.",
        },
        {
            id: 2,
            title: "Automation PLC Fundamentals",
            level: "Intermediate",
            desc: "Pahami dasar PLC dan aplikasi otomatisasi.",
        },
        {
            id: 3,
            title: "Industrial Control System",
            level: "Advanced",
            desc: "Pelajari sistem kontrol industri modern.",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 px-6 py-10">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
                Rekomendasi Course Untuk Kamu
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((c) => (
                    <div
                        key={c.id}
                        className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
                    >
                        <h2 className="text-lg font-semibold text-gray-900">
                            {c.title}
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Level: {c.level}
                        </p>

                        <p className="text-gray-700 mt-3">
                            {c.desc}
                        </p>

                        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700">
                            Mulai Belajar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}