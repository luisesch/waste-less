import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';

class Footer extends Component {
    render() {
    
        return (

<div className="Foot">
<footer className="page-footer font-small light-green pt-2">
<div className="container text-center text-md-left">

   <div className="row text-center text-md-left mt-2 pb-2">

    <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mt-2 pr-5">
      <h6 className="text-uppercase mb-2 font-weight-bold">About</h6>
      <p>This website has been created by Janine and Luise as the second project of their part-time web-development
        bootcamp at ironhack in Berlin.</p>
    </div>

    {/* <hr className="w-100 clearfix d-md-none"/> */}

    {/* <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mt-2">
      <h6 className="text-uppercase mb-2 font-weight-bold">Go to</h6>
      <p>
      <Link to={'/'}> Dashboard</Link>
      </p>
      <p>
      <Link to={'/league'}> League </Link>
      </p>
      <p>
      <Link to={'/profile'}> Your profile</Link>
      </p>
    </div> */}

    {/* <hr className="w-100 clearfix d-md-none"/> */}

    <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mt-2">
      <h6 className="text-uppercase mb-2 font-weight-bold">Contact</h6>
      <p>Ironhack, Berlin</p>
      <p>waste-less.ironhack@gmail.com</p>
    </div>

  </div>

  {/* <hr/> */}

  <div className="row d-flex align-items-center">


    <div className="col-md-7 col-lg-8">

      <p className="text-center text-md-left">© 2018 Copyright:
        <strong>  Luise & Janine – Ironhackers</strong>
      </p>

    </div>

    <div className="col-md-5 col-lg-4 ml-lg-0">

      <div className="text-center text-md-right">
        <ul className="list-unstyled list-inline">
          <li className="list-inline-item">
            <a className="btn-floating btn-sm rgba-white-slight mx-1">
              <i className="fab fa-facebook-f"></i>
            </a>
          </li>
          <li className="list-inline-item">
            <a className="btn-floating btn-sm rgba-white-slight mx-1">
              <i className="fab fa-twitter"></i>
            </a>
          </li>
          <li className="list-inline-item">
            <a className="btn-floating btn-sm rgba-white-slight mx-1">
              <i className="fab fa-google-plus-g"></i>
            </a>
          </li>
          <li className="list-inline-item">
            <a className="btn-floating btn-sm rgba-white-slight mx-1">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </li>
        </ul>
    
      </div>
    </div>
  </div> 
</div>

      </footer>
      </div>
        );
    }
}


export default Footer;