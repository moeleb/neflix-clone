import { fetchFromTMDB } from "../services/tmdb.service.js"



const getTrendingMovie =  async(req,res)=>{
    try{
        const data = await fetchFromTMDB("https://api.themoviedb.org/3/trending/movie/day?language=en-US")
        const randomMovie = data.results[Math.floor(Math.random()* data.results?.length)]

        res.json({success: true, content : randomMovie})

    }catch(error){
        console.log(error)
        res.status(500).json({success:false,message: error.message})
    }
}


const getMovieTrailers = async (req,res)=>{
    const {id} = req.params
    try{
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`) 
        res.json({success: true, trailers : data.results})
    }
    catch(error){
        console.log(error)
        if(error.message.includes("404")){
            res.status(404).json(null)        
        }
    }
}

const getMovieDetails = async (req,res) => {
    const {id} = req.params 
    try{
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}?language=en-US`);
        res.json({success: true, content : data})
    }
    catch(error){
        console.log(error)
        if(error.message.includes("404")){
            res.status(404).json(null)        
        }
    }
}
const getSimilarMovies = async (req,res) => {
    const {id} = req.params 
    try{
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`);
        res.json({success: true, similar : data.results})
    }
    catch(error){
        console.log(error)
        if(error.message.includes("404")){
            res.status(404).json(null)        
        }
    }
}


const getMoviesByCategory = async(req,res) =>{
    const {category} = req.params
    try{
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`);
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
    getTrendingMovie,
    getMovieTrailers,
    getMovieDetails,
    getSimilarMovies,
    getMoviesByCategory
}