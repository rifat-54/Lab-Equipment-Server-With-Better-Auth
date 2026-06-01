import { Router } from "express";
import userRouter from "../modules/user/user.route";
import equipmentRouter from "../modules/equipment/equipment.route";
import logRouter from "../modules/usage-log/log.route";
import { auth } from "../lib/auth";


const routes=Router()

async function createAdmin() {
    await auth.api.createUser({
        body:{
            name:"admin",
            email:"admin@gmail.com",
            password:"12345678",
            role:"admin"
        }
    })
}

// createAdmin()

routes.use("/user",userRouter)
routes.use("/equipment",equipmentRouter)
routes.use("/usagelog",logRouter)
 
export default routes; 