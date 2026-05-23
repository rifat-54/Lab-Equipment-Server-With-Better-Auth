import { RequestHandler ,Request,Response} from "express"
import { prisma } from "../../lib/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const register:RequestHandler=async(req,res)=>{
    const payload=req.body
    const hasPassword=await bcrypt.hash(payload.password,10)


  const user=  await prisma.user.create({
        data:{...payload,
            password:hasPassword
        }
    })

    res.send({
        message:"Registered Successfully",
        data:user
    })
}


const loginUser=async(req:Request,res:Response)=>{

    const{email,password}=req.body
    const user=await prisma.user.findUnique({
        where:{
            email
        }
    })

    if(!user){
        return res.send({
            message:"User not found ! please register first"
        })
    }

    const matchPass=await bcrypt.compare(password,user?.password)

    if(!matchPass){
        return res.send({message:"password incorrect!"})
    }
    const tokensecret=process.env.TOKENSECRET as string
    const token=jwt.sign({id:user.id,role:user.role},tokensecret,{expiresIn:"7d"})

    console.log(token)

    res.send({
        message:"Login Successfully",
        token
    })


}

export const userController={
    register,
    loginUser
}