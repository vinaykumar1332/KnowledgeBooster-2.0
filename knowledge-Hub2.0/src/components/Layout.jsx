// src/components/Layout.jsx
import Navbar from './navbar/Navbar';    // ← points to your new navbar folder     // ← you can create this later

export default function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-column">
            {/* Top Navbar */}
            <Navbar />

            {/* Main Content Area - This is where your pages will appear */}
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}