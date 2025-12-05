// src/pages/LandingPage.jsx
import React from "react";
import "./Home/home.css"

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gray-50 landing-page">
            {/* Hero Section */}
            <div className="max-w-5xl mx-auto text-center pt-28 pb-20 px-6">
                <h1 className="text-5xl font-bold text-gray-800 mb-6">
                    Welcome to <span className="text-blue-600">KnowledgeHub</span>
                </h1>
                <p className="text-xl text-gray-600 mb-12">
                    Your intelligent productivity companion — Learn, Save, and Grow every day.
                </p>
                <div className="landing-page-svg">
                    <img src="./images/Common_image/Landing-page.svg"></img>
                </div>
                <div className="actions-btns">
                    <button className="btn-primary btn">   <a href="/login" className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg shadow hover:bg-blue-700">
                        Login
                    </a></button>
                    <button className="btn-secondary btn">
                        <a href="/signup" className="btn-text">
                            Sign UP
                        </a>
                    </button>
                </div>
            </div>
            {/* Features, etc. */}
        </div>
    );
}