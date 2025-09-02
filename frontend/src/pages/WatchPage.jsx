import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useContentStore } from '../store/content'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ORIGINAL_IMG_BASE_URL, SMALL_IMG_BASE_URL } from '../components/utils/constants'
import WatchPageSkeleton from '../components/skeletons/WatchPageSkeleton'
const WatchPage = () => {
    const {id} = useParams()
    const [trailers, setTrailers] = useState([])
    const [currentTrailerIndex ,setCurrentTrailerIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [content, setContent] = useState({})
    const [similarContent, setSimilarContent] = useState([])
    const {contentType} = useContentStore()


    useEffect(()=>{
        const getTrailers = async () =>{
            try{
                const res = await axios.get(`/api/v1/${contentType}/${id}/trailers`)
                setTrailers(res.data.trailers)
            }
            catch(e){
                if(e.message.includes("404")){
                    setTrailers([])
                }
            }
        }
        getTrailers()
    },[contentType,id])

    useEffect(()=>{
        const getSimilarContent = async () =>{
            try{
                const res = await axios.get(`/api/v1/${contentType}/${id}/similar`)
                setSimilarContent(res.data.similar)
            }
            catch(e){
                if(e.message.includes("404")){
                    setSimilarContent([])
                }
            }
        }
        getSimilarContent()
    },[contentType,id])
    useEffect(()=>{
        const getContentDetails = async () =>{
            try{
                const res = await axios.get(`/api/v1/${contentType}/${id}/details`)
                setContent(res.data.content)
            }
            catch(e){
                if(e.message.includes("404")){
                    setContent([])
                }
            } finally {
                setLoading(false)
            }
        }
        getContentDetails()
    },[contentType,id])

    const handleNext = ()=>{
        if(currentTrailerIndex < trailers.length -1){
            setCurrentTrailerIndex(currentTrailerIndex+1)
        }
    }
    const handlePrev = ()=>{
        if(currentTrailerIndex>0){
            setCurrentTrailerIndex(currentTrailerIndex-1)

        }
    }
const formatReleaseDate = (dateString) => {
  if (!dateString) return "";
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

    const sliderRef = useRef(null)
        const scrollLeft = () => {
            if (sliderRef.current) {
            sliderRef.current.scrollBy({
                left: -sliderRef.current.offsetWidth,
                behavior: "smooth",
            });
            }
        };

        const scrollRight = () => {
            if (sliderRef.current) {
            sliderRef.current.scrollBy({
                left: sliderRef.current.offsetWidth,
                behavior: "smooth",
            });
            }
        };

        if(loading) return (
            <div className='min-h-screen bg-black p-10'>
                <WatchPageSkeleton/>
            </div>
        )
    
return (
  <div className="bg-black min-h-screen text-white">
    <div className="mx-auto container px-4 py-8 h-full">
      <Navbar />
      {trailers.length > 0 && (
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePrev}
            className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${
              currentTrailerIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentTrailerIndex === 0}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${
              currentTrailerIndex === trailers.length - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={currentTrailerIndex === trailers.length - 1}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      <div className="aspect-video mb-8 p-2 sm:px-10 md:px-32">
        {trailers.length > 0 ? (
        <iframe
        width="100%"
        height="100%"
        className="mx-auto overflow-hidden rounded-lg"
        src={`https://www.youtube.com/embed/${trailers[currentTrailerIndex].key}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        ></iframe>

        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-lg">
            🎥 No trailers available
          </div>
        )}
      </div>
      {/* Movie DEtails */}
<div className='flex flex-col md:flex-row items-center justify-between gap-20 max-w-6xl mx-auto'>
            <div className='mb-4 md:mb-0'>
                <h2 className='text-5xl font-bold text-balance'>{content?.title || content?.name}</h2>
                <p className='mt-2 text-lg'>
                {formatReleaseDate(content?.release_date || content?.first_air_date)} |{" "}
                {content?.adult ? (
                    <span className='text-red-600'>18+</span>
                ) : (
                    <span className='text-green-600'>PG-13</span>
                )}
                </p>
                <p className='mt-4 text-lg'>
                    {content?.overview}
                </p>
            </div>
            <img src={ORIGINAL_IMG_BASE_URL + content.poster_path} className='max-h--600px] rounded-md' alt="" />
            </div>
            {similarContent.length > 0 && (
            <div className='mt-12 max-w-5xl mx-auto relative'>
                <h3 className='text-3xl font-bold mb-4'>
                Similar Movies/Tv Show
                </h3>

                <div className='flex overflow-x-scroll scrollbar-hide gap-4 pb-4 group' ref={sliderRef}>
                {similarContent.map((content) => (
                    <Link key={content.id} to={`/watch/${content.id}`} className='w-52 flex-none'>
                    <img 
                        src={SMALL_IMG_BASE_URL + content.poster_path} 
                        alt="Poster path"
                        className='w-full h-auto rounded-md'
                    />
                    <h4 className='mt-2 text-lg font-semibold'>
                        {content.title || content.name}
                    </h4>
                    </Link>
                ))}
                    <ChevronRight
                    className='absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 text-white rounded-full'
                    onClick={scrollRight}
                    />
                    <ChevronLeft
                    className='absolute top-1/2 -translate-y-1/2 left-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 text-white rounded-full'
                    onClick={scrollLeft}
                    />


                </div>
            </div>
            )}
    </div>
  </div>
);

}

export default WatchPage