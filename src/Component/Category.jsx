import React from 'react'
import { Link, useParams } from 'react-router-dom'
import './Style/Category.css'

const Category = () => {

  const { stream } = useParams();
  const course = "React";

  return (
    <div className='category-page'>

      <div className='header-content'>
        <h1>{stream} Test Mode</h1>
        <p>Select your difficulty level to begin</p>
      </div>

      <div className='boxc'>

        <div className="level-card easy">
          <Link 
            to={`/Exam?stream=${stream}&level=easy&course=${course}`}
            className='boxc-l'>
            <span>Easy</span>
          </Link>
        </div>

        <div className="level-card medium">
          <Link 
            to={`/Exam?stream=${stream}&level=medium&course=${course}`}
            className='boxc-l2'>
            <span>Medium</span>
          </Link>
        </div>

        <div className="level-card hard">
          <Link 
            to={`/Exam?stream=${stream}&level=hard&course=${course}`}
            className='boxc-l3'>
            <span>Hard</span>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Category;