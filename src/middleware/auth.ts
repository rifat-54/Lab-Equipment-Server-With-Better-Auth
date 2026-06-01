import { Request,Response,NextFunction } from "express"
import { Role } from "../generated/prisma/enums"
import jwt,{JwtPayload} from "jsonwebtoken"

import {auth as betterAuth} from "../lib/auth"

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


const auth=(resource:"user" | "equipment",action:string)=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
        // const token=await req.headers.authorization?.split(" ")[1]

        // console.log("token from auth -> ",token)
        // const tokensecret=process.env.TOKENSECRET as string

        // if(!token){
        //     res.send("please provide token")
        // }

        try {
            // const decoded=jwt.verify(token as string,tokensecret)

            // if(!decoded){
            //     return res.send({
            //         message:"Unauthorized Access!"
            //     })
            // }

            // console.log("decodec",decoded)

            // req.user=decoded as JwtPayload

            // if(roles && !roles.includes(req.user.role)){
            //     return res.send({
            //         message:"Forbidden Access"
            //     })
            // }


     // =============== better auth==================


        const session=await betterAuth.api.getSession({
            headers:req.headers
        })

        if(!session){
          return  res.status(401).send({
                message:"Unauthorized!"
            })
        }

        const hasPermission=await betterAuth.api.userHasPermission({
            body:{
                userId:session?.user.id,
                role:session?.user.role || "user" as any,
                permissions:{[resource]:[action]}
            }
        })
        
        if(!hasPermission.success){
          return  res.status(401).send({
                message:`Forbidden: you don't have permission to ${action} ${resource}`
            })
        }

        console.log("session -> ",session,{hasPermission})
            next()
        } catch (error) {
            
        }



    }
}

export default auth