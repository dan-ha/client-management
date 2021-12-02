import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";

function Nav() {

  return (
    <nav id="nav" className="navbar navbar-expand navbar-dark bg-dark">
      <div className="navbar-nav">
        &nbsp;&nbsp;
        <NavLink exact to="/" className="nav-item nav-link">Zoznam klientov</NavLink>
      </div>
    </nav>
  )
}

export { Nav };