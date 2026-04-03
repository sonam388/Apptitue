import './Style/Register.css'
import React, { Component } from 'react'
export default class Signup extends Component {
  render() {
    return (
      <div className='logbox'>
     
                      <h1 className='logohead'>Sign Up</h1>
            <div className='input-section'>
                Full name<br></br>
                
                <input className='logo-inpt' type="text" placeholder="enter the name"></input>
                <hr></hr><br></br>
                Email <br></br>
                <input className='logo-inpt' type="text" placeholder="enter the email"></input>
                <hr></hr><br></br>
                Username<br></br>
                <input className='logo-inpt' type="text" placeholder="enter the usename"></input>
                <hr></hr><br></br>
                Password<br></br>
                <input className='logo-inpt' type="password" placeholder="enter the password"></input>
                <hr></hr><br></br>
                Repeat Password<br></br>
                <input className='logo-inpt' type="password" placeholder="enter the repeat password"></input>
                <hr></hr><br></br>
                <div className="checkbox"><input className="check" type="checkbox"></input>I agree to the Term & Primacy</div>
                <button className="button">Sign Up</button>
                <button className="button2">Sign in--</button>
        </div>
        </div>
  
      
    )
  }
}
