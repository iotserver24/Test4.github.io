import '../styles/header.css'
import{ RxMoon } from 'react-icons/rx'
import{ BsFillSunFill, BsSearch } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'
import useThemeContext from '../context/ThemeContext'
import { useEffect, useRef, useState } from 'react'
import { BiSolidUser } from 'react-icons/bi'
import { GiExitDoor, GiEntryDoor } from 'react-icons/gi'
import { IoIosSettings } from 'react-icons/io'
import { FaUserCog } from 'react-icons/fa'
import { BsBook } from 'react-icons/bs'

import useAuthContext from '../context/AuthContext'

const Header = () => {
    const { theme, toggleTheme } = useThemeContext();
    const [ activeNav, setActiveNav ] = useState();
    const [ query, setQuery ] = useState('');
    const [ isMenuOpen, setIsMenuOpen ] = useState(false);
    const [ prevScrollPos, setPrevScrollPos ] = useState(0);
    const [ profileOptionOpen, setProfileOptionOpen ] = useState(false);
    const { user, logoutUser } = useAuthContext();
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const profileSettingRef = useRef(null);
    const toggleRef = useRef(null);

    const handleNav = (nav) => {
        setActiveNav(nav)
        setIsMenuOpen(false);
        if(nav === 'profile') {
            setProfileOptionOpen(prev => !prev)
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            if (currentScrollPos > prevScrollPos) {
                setIsMenuOpen(false);
            } 
            setPrevScrollPos(currentScrollPos);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos]);

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(`/search/${query}`)
        setQuery('')
    }

    useEffect(() => {
        function handleClick(event) {
            if (toggleRef.current && toggleRef.current.contains(event.target)) {
                setIsMenuOpen(prevIsMenuOpen => !prevIsMenuOpen);
            } else if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, []);

    const handleToggleOptions = (event) => {
        event.stopPropagation();
        setProfileOptionOpen(prev => !prev);
    };
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if ( profileSettingRef.current && !profileSettingRef.current.contains(event.target)) {
                setProfileOptionOpen(false);
            }
        };
    
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <header id='header'>
            <nav className='navbar' >
                <div className='container container__navbar' >
                    <div className="navbar__home">
                        <div 
                            className={`hamburger ${isMenuOpen ? 'show' : ''}`} 
                            ref={toggleRef}
                        >
                            <span style={{
                                background: theme ?  'var(--primary)' : 'var(--primary-bg)'
                            }}></span>
                            <span style={{
                                background: theme ?  'var(--primary)' : 'var(--primary-bg)'
                            }}></span>
                            <span style={{
                                background: theme ?  'var(--primary)' : 'var(--primary-bg)'
                            }}></span>
                        </div>
                        <Link to='/'>
                            <h1 className={`logo ${theme ? 'light' : 'dark'}`}
                                onClick={() => handleNav('home')}
                            >
                                soma.
                            </h1>
                        </Link>
                        <ul style={{ 
                                background: theme ? 'var(--primary-bg)' : '#e4e4e4',
                                transition: 'var(--transition)'
                            }}
                            className={`navbar__menu ${isMenuOpen ? 'show' : ''}` }
                            ref={menuRef}
                        >
                            <li>
                                <Link to="/latest" 
                                    className={`
                                        ${theme ? 'light' : 'dark'} 
                                        ${activeNav === 'latest' ? 'active__nav' : ''}
                                    `}
                                    onClick={() => handleNav('latest')}
                                >
                                    Latest
                                </Link>
                            </li>
                            <li>
                                <Link to="/popular" 
                                    className={`
                                        ${theme ? 'light' : 'dark'}
                                        ${activeNav === 'popular' ? 'active__nav' : ''}
                                    `}
                                    onClick={() => handleNav('popular')}
                                >
                                    Popular
                                </Link>
                            </li>
                            <li>
                                <Link to="/new-season" 
                                    className={`
                                        ${theme ? 'light' : 'dark'}
                                        ${activeNav === 'new-season' ? 'active__nav' : ''}
                                    `}
                                    onClick={() => handleNav('new-season')}
                                >
                                    New Season
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className='navbar__search'>
                        <form onSubmit={handleSubmit}
                            className={`search__form ${theme ? 'border-light' : ''}`}
                        >
                            <input 
                                type="text"
                                placeholder='search anime' 
                                className={`${theme ? 'light' : ''}`}
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                            />
                            <button type='submit' className='button__submit'>
                                <BsSearch className={`search__icon ${theme ? 'light' : ''}`}/>
                            </button>
                           
                        </form>
                        <ul className='user__nav'>
                            <li
                                onClick={handleToggleOptions}
                            >
                                <div 
                                    className={`profile__user 
                                        ${theme ? 'light' : 'dark'}
                                        ${activeNav === 'profile' ? 'active__nav' : ''}
                                    `}
                                    onClick={() => handleNav('profile')}
                                >
                                    <span 
                                        className='user__name'
                                        onClick={handleToggleOptions}
                                    >
                                    {
                                        user ? 
                                        <img 
                                            src={user?.profile?.image} 
                                            alt={user?.profile?.nickname} 
                                        />
                                        : <FaUserCog />
                                    }
                                    </span>
                                    
                                    <div className='profile__options'
                                        style={{
                                            opacity: profileOptionOpen ? '1' : '0',
                                            pointerEvents: profileOptionOpen ? '' : 'none',
                                            bottom: user ? '-10.8rem' : '-8.5rem',
                                            left: user ? '-5.85rem' : '-5.4rem'
                                        }}
                                        ref={profileSettingRef}
                                    >   
                                        {
                                            user &&
                                            <Link 
                                                to='/profile'
                                                onClick={() => handleNav('profile')}
                                            >
                                                <BiSolidUser/> Profile
                                            </Link>              
                                        }
                                        {
                                            !user && 
                                            <Link 
                                                to='/login'

                                            >
                                                <GiEntryDoor/> Login
                                            </Link>
                                        }
                                        {
                                            !user && 
                                            <Link 
                                                to='/register'

                                            >
                                                <BsBook/> Register
                                            </Link>
                                        }
                                        <Link 
                                            onClick={toggleTheme}
                                        >
                                            {
                                                theme 
                                                ? <span><RxMoon /> Theme</span>
                                                : <span><BsFillSunFill /> Theme</span>
                                            }
                                        </Link>
                                        {
                                            user && 
                                            <Link 
                                                to='/edit-profile'
                                                onClick={() => handleNav('profile')}
                                            >
                                                <IoIosSettings/> Settings
                                            </Link>
                                        }
                                        {
                                            user &&
                                            <Link 
                                                to='/'
                                                onClick={e => logoutUser(e)}
                                            >
                                                <GiExitDoor/> Logout
                                            </Link>
                                        }
                                    </div>
                                </div>
                            </li>
                        </ul>
                        
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Header
