import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ isRoomPage, currentUser }) => {
    return (
       <div className="navbar">
           <div className="logo"><span>Live</span>IDE</div>
           {isRoomPage ? (
             <div className="user" style={{ fontSize: "30px", fontFamily: "monospace" }}>
               <h1>Welcome {currentUser}!</h1>
             </div>
           ) : (
            <div className="authentication">
              <Link className="navButton" to="/login">Login</Link>
              <Link className="navButton" to="/signup">Sign Up</Link>
            </div>
           )}
       </div>
    );
}

export default Navbar;