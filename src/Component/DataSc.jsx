import React from 'react'
import { Link } from 'react-router-dom'
import './Style/DataSc.css'

const TestPage = () => {
  return (
    <div className='page-container'>
      <div className='test-box'>
        
        {/* Left Image Section */}
        <div className='t'>
          <img className='tt' src='./Images/test-bg.jpg' alt="Courses" />
        </div>

        {/* Right Content Section */}
        <div className='list'>
          
          <a href='https://www.indiabix.com/computer-science/computer-fundamentals/'>
            <p className='test-para'>All Courses</p>
          </a>

          <Link to='/category'>
            <p className='test-para'>Machine Learning</p>
          </Link>

          <Link to='/category'>
            <p className='test-para'>PowerBI</p>
          </Link>

          <Link to='/category'>
            <p className='test-para'>Database Management</p>
          </Link>

          <Link to='/category'>
            <p className='test-para'>Data Visualization</p>
          </Link>
          
        </div>

      </div>
    </div>
  )
}

export default TestPage