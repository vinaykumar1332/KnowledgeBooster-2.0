// src/pages/Home/home.jsx
import React from "react";

function HomePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="max-w-5xl mx-auto text-center pt-28 pb-20 px-6">
                <h1 className="text-5xl font-bold text-gray-800 mb-6">
                    Welcome to <span className="text-blue-600">KnowledgeHub</span>
                </h1>

                <p className="text-xl text-gray-600 mb-12">
                    Your intelligent productivity companion — Learn, Save, and Grow every day.
                </p>
            </div>

            {/* Features Section */}
            <div className="bg-white py-16">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
                    <div className="p-6 shadow rounded-xl bg-gray-50">
                        <h2 className="text-2xl font-bold mb-3">Smart Tools</h2>
                        <p className="text-gray-600">AI-powered features to help you boost productivity.</p>
                    </div>

                    <div className="p-6 shadow rounded-xl bg-gray-50">
                        <h2 className="text-2xl font-bold mb-3">Simple & Clean UI</h2>
                        <p className="text-gray-600">Designed to keep you focused and organized.</p>
                    </div>

                    <div className="p-6 shadow rounded-xl bg-gray-50">
                        <h2 className="text-2xl font-bold mb-3">Secure Access</h2>
                        <p className="text-gray-600">Protected authentication and safe user workspace.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
