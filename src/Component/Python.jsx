import React from 'react'
import { Link } from 'react-router-dom'
import './Style/Test.css'

const Python = () => {
  return (
    <div className='test-box'>
      <div className='list'>

        <Link to="/category/PYTHON">
          <p className='test-para'>Core Python</p>
        </Link>
        <hr />

        <Link to="/category/PYTHON">
          <p className='test-para'>Django</p>
        </Link>
        <hr />

        <Link to="/category/PYTHON">
          <p className='test-para'>Numpy</p>
        </Link>

      </div>
    </div>
  )
}

export default Python;