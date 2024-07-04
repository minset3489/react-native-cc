import { useState,useEffect } from "react"

const useAppwrite = (fn) => {

const [data, setData] = useState([])
const [isLoading, setIsLoading] = useState(true)

const fetchData = async ()=> {
    setIsLoading(true)
    try{
    response = await fn()
    setData(response)

    }catch(error){
    Alert.alert('Error', error.message)
    }finally{

    }
}

useEffect(()=>{
    fetchData();
},[])

const refetch = () => fetchData()

return {data, isLoading, refetch}

}

export default useAppwrite