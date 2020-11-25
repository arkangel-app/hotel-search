import React, { Component } from "react";
import {
  Route,
  NavLink,
  Link,
  HashRouter,
  BrowserRouter
} from "react-router-dom";
import Home from "./Home";
import Stuff from "./Stuff";
import Contact from "./Contact";
import logo from './images/logo.png';
import arrow from './images/arrow.png';
import restClient from './network/restClient';
import GoogleMaps  from './map';
import Finder  from './finder';
//import Navbar from 'react-bootstrap/Navbar'
//import {Nav, NavDropdown} from 'react-bootstrap'

class Main extends Component {

  constructor(props) {
  super(props);
    this.state = {
      loading: false,
      error:undefined,
      areas:[],
      brands:[],
      countries:[],
      categories:[]
    }
  }

  componentDidMount(){
        this.loadAll();
  }

    loadAll = () =>{
        restClient.getAreas().then(response=>{
          this.setState({areas:response.data.areas})
        });

        restClient.getBrands().then(response=>{
          this.setState({brands:response.data.brands})
        });

        restClient.getCategories().then(response=>{
            this.setState({categories:response.data.categories})
        });

         restClient.getCountries().then(response=>{
             this.setState({countries:response.data.countries})
         });
    }

  render() {
    const ScrollToTop = () => {
      window.scrollTo(0, 0);
      return null;
    };
    return (
      <BrowserRouter>
        <div>
    <nav className="navbar navbar-expand-lg" id="nav">
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
      <span className="navbar-toggler-icon"></span>
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse flex-grow-0 justify-content-end" id="navbarTogglerDemo02">
      <ul className="navbar-nav">
         <li className="nav-item active">
         <Link className="nav-link homeMenu" to="/">Home
                 <img className="img-arrow home-ico" alt="arrow" src={arrow}/>
         </Link>
        </li>
        <li className="nav-item">
        <div className="dropdown">
          <a className="nav-link" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Brand <span className="menuIcon">
                  <img className="img-arrow" alt="arrow" src={arrow}/>
                </span>
          </a>
           <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          {this.state.brands.map(brand=>
            <Link to={{pathname:'/finder', state:{nav:`brand-${brand.id_brand}`,filtro:{brand:brand.id_brand}}}}
              key={`marca-${brand.id_brand}`} id={`brand-${brand.id_brand}`} className="dropdown-item">{brand.name}</Link>
          )}
          </div>
        </div>
        </li>
        <li className="nav-item">
        <div className="dropdown">
          <a className="nav-link" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Area <span className="menuIcon">
                  <img className="img-arrow" alt="arrow" src={arrow}/>
                </span>
          </a>
           <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          {this.state.areas.map(area=>
          <Link to={{pathname:'/finder', state:{nav:`area-${area.id_area}`,filtro:{area:area.id_area}}}}
            key={`marca-${area.id_area}`} id={`area-${area.id_area}`} className="dropdown-item">{area.name}</Link>
          )}
          </div>
        </div>
        </li>
        <li className="nav-item">
          <div className="dropdown">
            <a className="nav-link" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Category <span className="menuIcon">
                    <img className="img-arrow" alt="arrow" src={arrow}/>
                  </span>
            </a>
             <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {this.state.categories.map(category=>
            <Link to={{pathname:'/finder', state:{nav:`category-${category.id_category}`,filtro:{category:category.id_category}}}}
            key={`category-${category.id_category}`} id={`category-${category.id_category}`} className="dropdown-item">{category.name}</Link>
            )}
            </div>
          </div>
         </li>
        <li className="nav-item">
          <div className="dropdown">
            <a className="nav-link" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Resorts <span className="menuIcon">
                    <img className="img-arrow" alt="arrow" src={arrow}/>
                  </span>
            </a>
             <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {this.state.categories.map(category=>
            <Link to={{pathname:'/finder', state:{nav:`category-${category.id_category}`,filtro:{category:category.id_category}}}}
            key={`category-${category.id_category}`} id={`category-${category.id_category}`} className="dropdown-item">{category.name}</Link>
            )}
            </div>
          </div>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to={{pathname:'/finder', state:{nav:`allhotel`,filtro:{}}}} >All Hotels
              <img className="img-arrow home-ico" alt="arrow" src={arrow}/>
            </Link>
          
        </li>
       
        <li className="nav-item">
         <a className="navbar-brand" href="/"><img className="brand-logo" alt="logo" src={logo}/></a>
        </li>
      </ul>
    </div>
  </nav>

          <div className="content">
            <Route component={ScrollToTop} />
            <Route exact path="/" component={Home}/>
            {/* <Route exact path="/mapas" component={GoogleMaps}/> */}
            <Route exact path="/finder" component={Finder}/>
          </div>
        </div>
        </BrowserRouter>
    );
  }
}

export default Main;
