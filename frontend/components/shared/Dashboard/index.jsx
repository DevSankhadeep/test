import{Card,Button,Divider} from "antd";
import{
     DollarOutlined,MinusOutlined,PlusOutlined,BarChartOutlined

} from "@ant-design/icons";
const Dashboard=({data})=>{
    return(
        <div>
        <div className="grid md:grid-cols-4 gap-6">
        <Card className="shadow">
        <div className="flex justify-around items-center">
        <div className="flex items-center flex-col gap-2">
        <Button type="primary" shape="circle" icon={<BarChartOutlined/>} size="large" className="bg-rose-600"/>
       <h1 className="text-xl font-semibold mt-2">Transactions</h1>
       </div>
       <Divider type="vertical" className="h-24"/>
       <div>
       <h1 className="text-3xl font-bold text-rose">{data?.totalTransaction} T</h1>
       <p className="text-lg mt-1 text-Zinc-400">{Math.floor((data?.totalTransaction)+(data?.totalTransaction*50)/100)}</p>
       </div>
       </div>
        </Card>
        <Card className="shadow">
            <div className="flex justify-around items-center">
        <div className="flex items-center flex-col gap-2">
        <Button type="primary" shape="circle" icon={<PlusOutlined/>} size="large" className="bg-green-600"/>
       <h1 className="text-xl font-semibold text-gap">credits</h1>
       </div>
       <Divider type="vertical" className="h-24"/>
       <div>
       <h1 className="text-3xl font-bold text-green">{data.totalcredit} T</h1>
       <p className="text-lg mt-1 text-Zinc-400">{Math.floor((data.totalcredit)+(data.totalcredit*50)/100)}</p>
       </div>
       </div>
       </Card>
       <Card className="shadow">
            <div className="flex justify-around items-center">
        <div className="flex items-center flex-col gap-2">
        <Button type="primary" shape="circle" icon={<MinusOutlined/>} size="large" className="bg-orange-600"/>
       <h1 className="text-xl font-semibold mt-2">Debits</h1>
       </div>
       <Divider type="vertical" className="h-24"/>
       <div>
       <h1 className="text-3xl font-bold text-orange">{data.totalDebit} T</h1>
       <p className="text-lg mt-1 text-Zinc-400">{Math.floor((data.totalDebit)+(data.totalDebit*50)/100)}</p>
       </div>
       </div>
       </Card>
       <Card className="shadow">
            <div className="flex justify-around items-center">
        <div className="flex items-center flex-col gap-2">
        <Button type="primary" shape="circle" icon={<DollarOutlined/>} size="large" className="bg-blue-600"/>
         <h1 className="text-xl font-semibold mt-2">Balance</h1>
         </div>
       <Divider type="vertical" className="h-24"/>
       <div>
       <h1 className="text-3xl font-bold text-blue">{data.balance} T</h1>
       <p className="text-lg mt-1 text-Zinc-400">{Math.floor((data.balance)+(data.balance*50)/100)}</p>
       </div>
       </div>
       </Card>
       </div>
       </div>
    )
}
export default Dashboard;