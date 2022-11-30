import {useState,useEffect} from 'react'
import axios from 'axios'

const useAxiosFetch = (dataUrl) => {
  const [ data, setData ] = useState([])
  const [ fetchError, setFetchError ] = useState(null)
  const [ isLoading, setIsLoading ] = useState(false)
    
  useEffect(() => {

    let isMounted=true
    /* Create a variable that will hold the cancel token source */
    const source= axios.CancelToken.source()

    const fetchData = async (url) => {
        setIsLoading(true)
        try{
            /* 
            Inside the axios request config, pass the token of the created sourcevariable as the value of the cancelToken key/property.
                let config = { cancelToken: source.token}
                axios.get(endpointUrl, config).then((res) => {})
                or
                axios.get(endpointUrl, { cancelToken: source.token}).then((res) => {}) 
            */
            const response = await axios.get(url,{
                cancelToken:source.token
            })
            if(isMounted){
                setData(response.data)
                setFetchError(null)
            }
        }catch(err){
                setFetchError(err.message)
                setData([])
        }finally{
            isMounted && setTimeout(() => setIsLoading(false),2000)
        }
    }
    fetchData(dataUrl)

    const cleanUp = () => {
        isMounted=false
        /* 
                Trigger the cancel request by calling source.cancel() where and when 
                (in a react component this can be on the componentWillUnmount lifecycle method or 
                on the click of a button) you need to cancel the request. 
         */
        source.cancel()
    }
    return cleanUp
  },[dataUrl])
  
  
  return {data,fetchError,isLoading}
}

export default useAxiosFetch