import React from 'react'
import 
{ BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill}
 from 'react-icons/bs'

const Home = () => {
  return (
    <main className='main-container'>
        {/* <div className='main-title' >
        
        </div> */}
        
        <div className='main-cards'>
            <div className='card'>
                <div className='card-inner'>
                    <h3>patientinformation</h3>
                    <BsFillArchiveFill className='card_icon'/>
                    <label>Username</label>
                    <input placeholder='addinputhere'></input>
                    <label>Username</label>
                    <input placeholder='addinputhere'></input>
                    <label>Username</label>
                    <input placeholder='addinputhere'></input>
                    <label>Username</label>
                    <input placeholder='addinputhere'></input>
                  
                </div>
                <h1>300</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>history</h3>
                    <BsFillGrid3X3GapFill className='card_icon'/>
                </div>
                <h1>12</h1>
            </div>
           
           
        </div>

    </main>
  )
}

export default Home
