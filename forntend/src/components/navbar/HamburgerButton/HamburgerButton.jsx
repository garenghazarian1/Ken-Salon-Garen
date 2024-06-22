//import styles from './HamburgerButton.module.css';

const HamburgerButton = ({ isOpen, toggle }) => {
  
    return (
      <button
        onClick={toggle}
        className="hamburger-btn lg:hidden fixed top-4 right-8 z-50 flex flex-col justify-center items-center w-12 h-12 rounded-md bg-transparent  border-2 border-transparent hover:border-green-200 "
        aria-label="Toggle menu"
      >
        <div className={`w-8 h-1 bg-green-100 mb-2 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-3.5' : ''}`}></div>
        <div className={`w-8 h-1 bg-green-200 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-0' : ''}`}></div>
        <div className={`w-8 h-1 bg-green-300 mt-2 transition-transform duration-300 ease-in-out ${isOpen ? '-rotate-45 -translate-y-3.5' : ''}`}></div>
      </button>
    );
  };
  
  export default HamburgerButton;
  