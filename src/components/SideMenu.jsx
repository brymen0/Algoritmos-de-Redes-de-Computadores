import { Link, useLocation } from 'react-router-dom';
import { MenuIcon } from './Icons';
import './SideMenu.css'; 

function Sidebar() {
  const location = useLocation();

  const links = [
    { to: '/prim', label: 'Algoritmo Prim' },
    { to: '/dijkstra', label: 'Dijkstra' },
    { to: '/vector-distancia', label: 'Vector Distancia' },
    { to: '/estado-enlace', label: 'Estado del Enlace' },
    { to: '/hamming', label: 'Hamming' },
    { to: '/crc', label: 'CRC' }
  ];

  return (
    <div className="sidebar-container">
      <div className='menu-icon'>
        <MenuIcon/>
      </div>

      <ul className='sidebar'>
        {links.map(link => (
          <li key={link.to}>
            <Link to={link.to} className={location.pathname === link.to ? 'active' : ''}>
              {link.label}
            </Link>
          </li>
        ))
        }
      </ul>
    </div>
  );
}

export default Sidebar;
