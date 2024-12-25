import { Card } from "@repo/ui/card"

export const ReceivedTransfer = ({ data }: {
    data: {
        amount: number,
        timestamp: Date,
        fromUser: {
            number: string
        }
    }[]
}) => {

    return (
        <div>
            <Card title="Received Transfers">
                <div className="pt-2">
                    {data.map((t,ind) => <div key={ind} className="flex justify-between">
                        <div>
                            <div className="text-sm">
                                Received INR
                            </div>
                            <div className="text-slate-600 text-xs">
                                {t.timestamp.toDateString()}
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            + Rs {t.amount / 100}
                        </div>

                    </div>)}
                </div>
            </Card>

        </div>
    )
}