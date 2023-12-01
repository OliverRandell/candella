import { Link, NavLink } from "react-router-dom";
import Logo from '../assets/logo.svg';

export const Header = () => {
    return (
      <header>
        <Link to="/" className="logo">
            <img src={Logo} alt="Candella Logo" />
            <span>Candella</span>
        </Link>
        <nav className="navigation">
            <NavLink to="/" className='link' end>Home</NavLink>
            <NavLink to="/about" className='link'>About</NavLink>
        </nav>
      </header>
    )
  }
  