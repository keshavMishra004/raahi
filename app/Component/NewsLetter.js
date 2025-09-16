import React from 'react'
import '../css/newsLetter.css'

function NewsLetter() {
  return (
    <section className='newsletter'>
        <h3>Subscribe to our newsletter</h3>
        <p>Get latest deals and updates which keeps you ahead.</p>
        <div className='newsletter-form'>
            <input type='email' placeholder='Enter your email' />
            <button>Subscribe Now</button>
        </div>
    </section>
  )
}

export default NewsLetter