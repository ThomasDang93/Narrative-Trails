import './App.css';
import React, { Component} from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MintLetterBox from './components/MintLetterBox';
import MintStamp from './components/MintStamp';
import Home from './components/Home';
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
export default class App extends Component {
  static displayName = App.name;
  

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }
  
  render () {
    return (
      <BrowserRouter>  
        <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
          <Container>
            <NavbarBrand tag={Link} to="/">Narrative Trails</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/plant-letter-box">Plant Letter Box</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/make-a-stamp-and-hunt">Make a Stamp and Hunt</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/keep-on-hunting">Keep On Hunting</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/my-collection">My Collection</NavLink>
                </NavItem>
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
      <div>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Routes>
            <Route path="/" element={Home} /> 
            <Route path='/plant-letter-box' element={MintLetterBox} /> 
            <Route path='/make-a-stamp-and-hunt' element={MintStamp} />
        </Routes>
      </Web3ReactProvider>
      </div>
      </BrowserRouter>
    );
  }
}

const getLibrary = (provider) => {
    return new Web3Provider(provider);
}
