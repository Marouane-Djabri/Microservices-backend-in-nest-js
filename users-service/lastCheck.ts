import { PrismaClient } from "@prisma/client";

const prisma  = new PrismaClient();

const createNewProf = async () => {
    const newProf = await prisma.user.create({
        data: {
            email: "newprof1@example.com",
            password: "secret",
            role: "PROF"
        }
    }) ; 
    const prof = await prisma.prof.create({
        data: {
            userId: newProf.id,
    
    }     }) ; 
    console.log("New Prof created:", prof);
}  ; 
createNewProf ()

