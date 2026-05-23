import app from "./app"
import { prisma } from "./lib/prisma";

const port=process.env.PORT || 5000

async function server(){

try {
    await prisma.$connect()

    app.listen(port,()=>{
        console.log(`server is running on port : ${port}`);
    })

} catch (e) {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)

}

}

server()