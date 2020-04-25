import React, { Component } from 'react';
import logo from '../assets/logo.png';
import { NavLink } from "react-router-dom";

class TopNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <nav className="stroke help-container page-header__nav">
        <a href="/" className="page-header__logo">
          <img className="at-image" alt="" src={logo}/>
        </a>
        <ul className="at-flex at-full-width at-tab-wrapper" role="tablist">
          <li className="at-tab">
            <NavLink exact to="/help/ingests" activeClassName="at-tab__link--active" className="at-inline-flex at-interactive at-tab__link">Ingests</NavLink>
          </li>
          <li className="at-tab">
            <NavLink exact to="/help/stream" activeClassName="at-tab__link--active" className="at-inline-flex at-interactive at-tab__link">How to Stream</NavLink>
          </li>
        </ul>
      </nav>
    )
  }
}

export default TopNav;