import { Request,Response,NextFunction } from "express"
import { Role } from "../generated/prisma/enums"
import jwt,{JwtPayload} from "jsonwebtoken"


declare global{
    namespace Express{
        interface Request{
            user:JwtPayload
        }
    }
}

// const auth=(roles?:Role[])=>{
//     return async(req:Request,res:Response,next:NextFunction)=>{
//         const token=req.headers.authorization?.split(" ")[1]
//         if(!token){
//             res.send("please provide token")
//         }

//         try {
//             const decoded=jwt.verify(token as string,"secrettoken",{
                
//             })
//         } catch (error) {
               
//         }

//     }
// }


const auth=(roles?:Role[])=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
        const token=await req.headers.authorization?.split(" ")[1]

        console.log("token from auth -> ",token)
        const tokensecret=process.env.TOKENSECRET as string

        if(!token){
            res.send("please provide token")
        }

        try {
            const decoded=jwt.verify(token as string,tokensecret)

            if(!decoded){
                return res.send({
                    message:"Unauthorized Access!"
                })
            }

            console.log("decodec",decoded)

            req.user=decoded as JwtPayload

            if(roles && !roles.includes(req.user.role)){
                return res.send({
                    message:"Forbidden Access"
                })
            }
            next()
        } catch (error) {
            
        }
    }
}

export default auth