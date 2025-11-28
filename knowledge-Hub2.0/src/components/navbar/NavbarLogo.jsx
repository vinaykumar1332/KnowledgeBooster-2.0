// src/components/navbar/NavbarLogo.jsx
export default function NavbarLogo() {
    return (
        <div className="flex align-items-center gap-3">
            <i className="pi pi-book text-primary" style={{ fontSize: '2.2rem' }}></i>
            <span className="font-bold text-2xl text-primary hidden sm:inline">
                KnowledgeHub
            </span>
        </div>
    );
}