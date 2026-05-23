import { Router } from "express";
import { logControler } from "./log.controller";
import auth from "../../middleware/auth";
import { Role } from "../../generated/prisma/enums";


const logRouter=Router()

logRouter.post("/",auth([Role.Admin,Role.Student]),logControler.createUsageLog)
logRouter.get("/",logControler.getUsageLog)
logRouter.patch("/:id",logControler.updateUsageLog)

export default logRouter;
