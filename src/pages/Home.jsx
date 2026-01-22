import React from 'react'
import './Home.css'
import Footerr from '../components/Footer'
import Heroo from '../components/Hero'
import Cardd from '../components/Card'
import Profile from '../components/Profile'



const Home = () => {
  return (
    <div>
    
        <section>
          <Heroo/>
        </section>
        <section>
           <div>
                  <Cardd/>
                </div>
        </section>
    
<section>
    <Footerr/>
</section>
        
    </div>
    
  )
}

export default Home
