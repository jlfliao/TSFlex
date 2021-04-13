import React from 'react';

const Navbar = () => {
  return (
    <div>
      <nav className='navbar'>
        <span>
          <b>Welcome</b>
        </span>
        <span>
          <span>
            <a href='https://tsflex.herokuapp.com/' className='navlink'>
              Home
            </a>
          </span>
          <span>
            <a href='https://www.tensorflow.org/js/models' className='navlink'>
              Models
            </a>
          </span>
          {/* <span>
            <a href='https://www.tensorflow.org/js/models' className='navlink'>
            About (Coming Soon)
            </a>
          </span> */}
        </span>
      </nav>
    </div>
  );
};

export default Navbar;
