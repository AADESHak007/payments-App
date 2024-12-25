"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2pTransfer(to:string ,amount:number){
    const session = await  getServerSession(authOptions) ;
    const fromUser = session.user?.id 

    if(!fromUser){
        return {msg: "Error while sending money ...Please try logging in"}
    }

    const toUser = await prisma.user.findFirst({
        where:{
            number:to
        }
    })
    if(!toUser){
        return {msg: `User with phone no. ${to}... Not Found`}
    }

    await prisma.$transaction(async (txn)=>{

        await txn.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(fromUser)} FOR UPDATE` ;

         const fromBalance = await txn.balance.findFirst({
            where:{
                userId: Number(fromUser)
            }
         })
         if(!fromBalance){
            return {msg:"error while transfering funds..."}
         }
         if(fromBalance.amount < amount) {
            return  {msg:"Insufficient Balance..."}
         }
         await txn.balance.update({
            where : {userId: Number(fromUser)},
            data : {amount: {decrement:amount}}
         })

         await txn.balance.update({
            where : {userId: Number(toUser.id)},
            data : {amount: {increment:amount}}
         })
        
         await txn.p2pTransfer.create({
             data:{
                 fromUserId: Number(fromUser),
                 toUserId: Number(toUser.id),
                 amount,
                 timestamp: new Date()
             }
         })
    })
}