import React from 'react';
import './Style/Test.css';
import { Link } from 'react-router-dom';

const TestPage = () => {
  const categories = [
    { 
      id: 1, 
      title: 'Full Course', 
      desc: 'Complete Computer Fundamentals', 
      path: 'https://www.indiabix.com/computer-science/computer-fundamentals/', 
      external: true,
      color: '#FF6B6B' // Red Accent
    },
    { 
      id: 2, 
      title: 'HTML / CSS', 
      desc: 'Master the Web Layouts', 
      path: '/category', 
      external: false,
      color: '#4ECDC4' // Teal Accent
    },
    { 
      id: 3, 
      title: 'JavaScript', 
      desc: 'Logic & Functionality', 
      path: '/category', 
      external: false,
      color: '#FFE66D' // Yellow Accent
    },
    { 
      id: 4, 
      title: 'React.JS', 
      desc: 'Modern Frontend Library', 
      path: '/category', 
      external: false,
      color: '#1A535C' // Dark Blue Accent
    },
    { 
      id: 5, 
      title: 'MongoDB / Node', 
      desc: 'Backend & Database', 
      path: '/category', 
      external: false,
      color: '#95E1D3' // Mint Accent
    },
  ];

  return (
    <div className='modern-container'>
      <div className='overlay'></div>
      
      <div className='modern-content'>
        <div className='header-section'>
          <h1>Skill Assessment</h1>
          <p>Choose a category to start your quiz</p>
        </div>

        <div className='modern-grid'>
          {categories.map((item, index) => {
            const Tag = item.external ? 'a' : Link;
            const props = item.external 
              ? { href: item.path, target: "_blank", rel: "noopener noreferrer" } 
              : { to: item.path };

            return (
              <Tag {...props} className='modern-card' key={item.id} style={{'--accent-color': item.color, animationDelay: `${index * 0.1}s`}}>
                <div className='card-icon'>{item.title.charAt(0)}</div>
                <div className='card-info'>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                <div className='card-arrow'>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </Tag>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TestPage;