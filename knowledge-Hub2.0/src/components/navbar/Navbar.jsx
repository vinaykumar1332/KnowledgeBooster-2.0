// src/components/navbar/Navbar.jsx
import './navbar.css';
import NavbarLogo from './NavbarLogo.jsx';
import NavLinks from './NavLinks.jsx';
import NavActions from './NavActions.jsx';

export default function Navbar() {
    return (
        <nav className="navbar-container surface-card">
            <div className="navbar-content">
                <NavbarLogo />
                <NavLinks />
                <NavActions />
            </div>
        </nav>
    );
}