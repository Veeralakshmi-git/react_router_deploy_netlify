import React from 'react'
import Feed from './Feed'
const Home = ({posts, fetchError, isLoading}) => {
  return (
    <main className='Home'>
      {/* {posts.length ? (<Feed posts={posts} />) :
      (<p style={{marginTop:"2rem"}}>No Posts To Display</p>)
      } */}

      {isLoading && <p className='statusMsg'>Loading posts...</p>}
      {fetchError && <p className='statusMsg' style={{color:'red'}}>{fetchError}</p>}
      {!isLoading && !fetchError && (posts.length ? <Feed posts={posts} />
       : <p className='statusMsg'>No POSTS TO DISPLAY</p>)}
    </main>
  )
}

export default Home