// src/pages/Home/home.jsx
import React from "react";
import "./home.css";

function HomePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="max-w-5xl mx-auto text-center pt-28 pb-20 px-6">
                <h1 className="text-5xl font-bold text-gray-800 mb-6">
                    Welcome to <span className="text-blue-600">KnowledgeHub</span>
                </h1>

                <p className="text-xl text-gray-600 mb-8">
                    KnowledgeHub is your personal digital workspace to store, organize,
                    and access learning materials, documents, and resources — all in one place.
                </p>

                <p className="text-lg text-gray-500">
                    Built for students, professionals, and lifelong learners who want
                    a clean, focused, and reliable way to manage knowledge.
                </p>
            </div>

            {/* Features Section */}
            <div className="bg-white py-20">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
                    <div className="p-6 shadow rounded-xl bg-gray-50">
                        <h2 className="text-2xl font-bold mb-3">Centralized Knowledge</h2>
                        <p className="text-gray-600">
                            Save notes, PDFs, reports, and documents from Google Drive
                            and access them anytime with instant preview.
                        </p>
                    </div>

                    <div className="p-6 shadow rounded-xl bg-gray-50">
                        <h2 className="text-2xl font-bold mb-3">Simple & Clean UI</h2>
                        <p className="text-gray-600">
                            A distraction-free interface designed to help you focus on
                            learning, not managing files.
                        </p>
                    </div>

                    <div className="p-6 shadow rounded-xl bg-gray-50">
                        <h2 className="text-2xl font-bold mb-3">Smart Organization</h2>
                        <p className="text-gray-600">
                            Categorize content by purpose, search instantly, and find
                            what you need in seconds.
                        </p>
                    </div>
                </div>
            </div>

            {/* Who is it for */}
            <div className="bg-gray-50 py-20">
                <div className="max-w-5xl mx-auto text-center px-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                        Who is KnowledgeHub for?
                    </h2>

                    <p className="text-gray-600 text-lg mb-4">
                        🎓 Students managing notes, assignments, and projects
                    </p>
                    <p className="text-gray-600 text-lg mb-4">
                        💼 Professionals organizing reports, case studies, and research
                    </p>
                    <p className="text-gray-600 text-lg">
                        📚 Anyone who wants a smarter way to store and revisit knowledge
                    </p>
                </div>
            </div>

            {/* Footer Message */}
            <div className="bg-white py-16">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                        Learn once. Store forever. Revisit anytime.
                    </h3>
                    <p className="text-gray-600">
                        KnowledgeHub helps you build a personal library of knowledge
                        that grows with you over time.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
