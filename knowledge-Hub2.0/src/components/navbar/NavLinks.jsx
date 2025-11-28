// src/components/navbar/NavLinks.jsx
const links = [
    { label: "Home", icon: "pi pi-home", href: "#" },
    { label: "Topics", icon: "pi pi-th-large", href: "#" },
    { label: "Articles", icon: "pi pi-file-edit", href: "#" },
    { label: "About", icon: "pi pi-info-circle", href: "#" },
    { label: "Contact", icon: "pi pi-envelope", href: "#" },
];

export default function NavLinks() {
    return (
        <div className="hidden md:flex gap-6">
            {links.map((link) => (
                <a
                    key={link.label}
                    href={link.href}
                    className="flex align-items-center gap-2 text-gray-700 hover:text-primary font-medium transition-colors"
                >
                    <i className={`${link.icon} text-lg`}></i>
                    <span>{link.label}</span>
                </a>
            ))}
        </div>
    );
}