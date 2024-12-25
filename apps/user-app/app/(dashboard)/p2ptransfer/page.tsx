import { getServerSession } from "next-auth";
import { SendCard } from "../../../components/SendCard";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { SentTransfer } from "../../../components/SentTransfer";
import { ReceivedTransfer } from "../../../components/ReceivedTransfer";


async function getP2PTransfers(){
   const session = await getServerSession(authOptions) ;
   const sentTransfers = await prisma.p2pTransfer.findMany({
        where:{
           fromUserId:Number(session?.user?.id)  
        },
        select :{
            toUser :{
                select:{
                    number : true,
                }
            },
            amount :true,
            timestamp :true
        }
        

    })
    return sentTransfers ;

}
async function getreceivedTransfers(){
    const session = await getServerSession(authOptions) ;
    const TransfersReceived = await prisma.p2pTransfer.findMany({
        where: {
            toUserId: Number(session?.user?.id)
        },
        select :{
            fromUser :{
                select:{
                    number : true,
                }
            },
            amount :true,
            timestamp :true
        }
    })
    return TransfersReceived ;
}

 const  p2p = async ()=>{
    const data = await  getP2PTransfers() ;
    const received = await getreceivedTransfers() ;
    return (
       <>
        <div className="mx-auto">
            <SendCard />
        </div>
        <div className="w-[50%] flex flex-col gap-12 p-2">
            <SentTransfer data={data} />
            <ReceivedTransfer data={received} />
        </div>
       </>
    )
}
export default p2p ;