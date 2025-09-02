import express from "express"
import authRoutes from "./routes/auth.route.js"
import movieRoutes from "./routes/movie.route.js"
import tvRoutes from "./routes/tv.route.js"
import searchRoutes from "./routes/search.route.js"
import path from "path"
import { ENV_VARS } from "./config/envVars.js"
import { connectDB } from "./config/db.js"
import cookieParser from "cookie-parser"
import protectRoute from "./middlewares/protectRoute.js"
const app = express ()


const __dirname = path.resolve()

app.use(express.json())
app.use(cookieParser())



app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/movie",protectRoute, movieRoutes)
app.use("/api/v1/tv",protectRoute, tvRoutes)
app.use("/api/v1/search",protectRoute, searchRoutes)

connectDB()
const port = ENV_VARS.PORT
if(ENV_VARS.NODE_DEV ==="production"){
    app.use(express.static(path.join(__dirname, "/frontend/dist")))
    app.get("*", (req,res)=>{
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}
app.listen(port,()=>{
    console.log(`server started at ${port} `)
})

