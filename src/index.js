import 'babel-polyfill';
import 'core-js/es/map';
import 'core-js/es/set';

import React from "react";
import ReactDOM from "react-dom";
import Main from "./Main";

import 'sanitize.css';
import "./index.css";
import "antd/dist/antd.css";

class App extends React.Component {
  constructor() {
  super();
  this.state={
    loaded:false
  };
}
  render() {
  return (
    <div>
      <Main/>
    </div>
  )
  }

}

const DashApp = async () => {
  if (typeof window.IntersectionObserver === 'undefined') {
    await import('intersection-observer')
  }
  return ReactDOM.render(
      <App/>
  , document.getElementById('root'));
};
DashApp();
