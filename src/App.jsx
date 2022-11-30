import React from 'react'
import Home from './Home'
import Newpost from './Newpost'
import Postpage from './Postpage'
import Editpost from './Editpost'
import About from './About'
import Missing from './Missing'
import Layout from './Layout'
import { Route, Routes, useNavigate } from 'react-router-dom'
import {  useState, useEffect } from 'react'
import {format} from 'date-fns'
import api from './api/posts'
import useWindowSize from './hooks/useWindowSize'
import useAxiosFetch from './hooks/useAxiosFetch'

function App() {
   const [posts,setPosts]=useState([])
   const [search,setSearch] = useState('')
   const [SearchResults,setSearchResults]=useState([])
   const [postTitle,setPostTitle] = useState('')
   const [postBody,setPostBody] = useState('')
   const [editTitle,setEditTitle] = useState('')
   const [editBody,setEditBody] = useState('')
   const navigate = useNavigate()
   /*  custom hook getting windowsize from usewindowsize hook */
   const {width} = useWindowSize()

   const { data,fetchError,isLoading } = useAxiosFetch('http://localhost:3500/post')

   useEffect (() => {
      
    setPosts(data)

   },[data])
   
   /* useEffect(() => {
    const fetchPosts = async () => {
      try{
        const response = await api.get('/post')
         setPosts(response.data )
      }catch(err){
          if(err.response){
            console.log(err.response.data)
            console.log(err.response.status)
            console.log(err.response.headers)
        }else{
          console.log(`Error:${err.message}`)
        }
    }
    }
    fetchPosts()
   },[]) */

   useEffect(() => {
       const filteredResults = posts.filter(
        post => ((post.body).toLowerCase()).includes(search.toLowerCase())
        || ((post.title).toLowerCase().includes(search.toLowerCase()))
       )
       setSearchResults(filteredResults.reverse())
   },[posts,search])
   
    const handleSubmit = async (e) => {
        e.preventDefault()
        const id= posts.length ? [posts.length - 1].id + 1 :1
        const datetime= format(new Date(),'MMMM dd, yyyy pp')
        const newPost= { id, title:postTitle, datetime, body:postBody }
        
        try{
          const response= await api.post('/post',newPost)
          const allPosts = [ ...posts,response.data ]  
            setPosts(allPosts)
            setPostTitle('')
            setPostBody('')
            navigate('/')
        }catch(err){
          console.log(`Error:${err.message}`)
        }
    }
   
    const handleEdit = async (id) => {
      const datetime= format(new Date(),'MMMM dd, yyyy pp')
      const updatedPost={id, title:editTitle, datetime, body:editBody}
      try{
        const response = await api.put(`/post/${id}`,updatedPost)
        setPosts(posts.map(post => post.id === id ? {...response.data}: post ))
        setEditTitle('')
        setEditBody('')
        navigate('/')
      }catch(err){
        console.log(`Error: ${err.message}`)
      }
    
    }


    const handleDelete = async (id) => {
      try{
          await api.delete(`/post/${id}`)
          const postsList= posts.filter(post => post.id !== id)
          setPosts(postsList)
          navigate('/')
        }catch(err){
          console.log(`Error:${err.message}`)
        }
    }
    return(
        
        <Routes>
            <Route path="/" element={<Layout 
               search={search}
               setSearch = {setSearch}
               width= {width}
            />} >
                <Route index element={
                    <Home 
                      posts={SearchResults}
                      fetchError={fetchError}
                      isLoading={isLoading}
                    />
                  } 
                />
                <Route path="post">
                    <Route index element={<Newpost 
                        handleSubmit={handleSubmit}
                        postTitle={postTitle}
                        setPostTitle={setPostTitle}
                        postBody={postBody}
                        setPostBody={setPostBody}    
                    />} />
                    <Route path="/post/edit/:id" element={<Editpost 
                      posts={posts}
                      handleEdit={handleEdit}
                      editTitle={editTitle}
                      editBody={editBody}
                      setEditTitle={setEditTitle}
                      setEditBody={setEditBody}
                    />} />
                    <Route path="/post/:id" element={<Postpage posts={posts} handleDelete={handleDelete} />} />
                </Route>
                <Route path="about" element={<About />} />
                <Route path="*" element={ <Missing />} />
            </Route> 
        </Routes>
       
      
    )
}

export default App
