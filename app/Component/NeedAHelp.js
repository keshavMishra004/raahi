import React from 'react'
import '../css/needAHelp.css'

function NeedAHelp() {
  return (
    <section className='need-a-help'>
        <div className='help-container'>
            <div className='help-head'>
                <h3 className='help-h3'>
                    Need Help?
                </h3>
                <p className='help-p'>
                    From Udaan flights to exclusive charter flights and pilgrimage helicopters. RAAHI makes every flight option discoverable, bookable, and efficient.
                </p>
            </div>
            <form className='help-form'>
                <input type="text" placeholder="Full Name" />
                <input type="email" placeholder="Email" />
                <input type="tel" placeholder="Phone no." />
                <select defaultValue="none">
                  <option value="none" disabled>Select your type of Query</option>
                  <option value="charter">Charter</option>
                  <option value="air-ambulance">Air Ambulance</option>
                  <option value="pilgrimage">Pilgrimage</option>
                  <option value="aerial">Aerial Activities</option>
                  <option value="other">Other</option>
                </select>
                <textarea placeholder="Type your query..." rows={4}></textarea>
                <div className='agree-contact'>
                  <input type="checkbox" id="agree" />
                  <label htmlFor="agree">
                    I agree to be contacted regarding my query.
                  </label>
                </div>
                <button type="submit" className="help-submit-btn">Send Query</button>
                <p className='help-ending'>
                  We usually reply within a few hours. Your info is safe with us.
                </p>
            </form>
        </div>
    </section>
  )
}

export default NeedAHelp