


import { fetchFromTMDB } from "../services/tmdb.service.js"



const getTrendingTv =  async(req,res)=>{
    try{
        const data = await fetchFromTMDB("https://api.themoviedb.org/3/trending/tv/day?language=en-US")
        const randomMovie = data.results[Math.floor(Math.random()* data.results?.length)]

        res.json({success: true, content : randomMovie})

    }catch(error){
        console.log(error)
        res.status(500).json({success:false,message: error.message})
    }
}


const getTvTrailers = async (req,res)=>{
    const {id} = req.params
    try{
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`) 
        res.json({success: true, trailers : data.results})
    }
    catch(error){
        console.log(error)
        if(error.message.includes("404")){
            res.status(404).json(null)        
        }
    }
}

const getTvDetails = async (req,res) => {
    const {id} = req.params 
    try{
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}?language=en-US`);
        res.json({success: true, content : data})
    }
    catch(error){
        console.log(error)
        if(error.message.includes("404")){
            res.status(404).json(null)        
        }
    }
}
const getSimilarTvs = async (req,res) => {
    const {id} = req.params 
    try{
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`);
        res.json({success: true, similar : data.results})
    }
    catch(error){
        console.log(error)
        if(error.message.includes("404")){
            res.status(404).json(null)        
        }
    }
}


const getTvsByCategory = async(req,res) =>{
    const {category} = req.params
    try{
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${category}?language=en-US&page=1`);
        res.json({success: true, content : data.results})
    }
    catch(error){
        console.log(error)
        if(error.message.includes("404")){
            res.status(404).json(null)        
        }
    }
}



export {
    getTrendingTv,
    getTvTrailers,
    getTvDetails,
    getSimilarTvs,
    getTvsByCategory
}