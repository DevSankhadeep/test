import { SearchOutlined } from "@ant-design/icons";
import{card, Form,Image,Input,Empty,Select,Button, message} from"antd";
import { useState } from "react";
import{http, trimData} from "../../../modules/modules";

const NewTransaction=()=>{
    //get userinfo from sessionstorage
    const userinfo=JSON.parse(sessionStorage.getItem("userInfo"))
    //form info
    const[transactionForm]=Form.useForm();
    const[messageApi,contextHolder]=message.useMessage();
    //state collection
    const[accountNo,setAccountNo]=useState(null);
    const[accountDetail,setAccountDetail]=useState(null);

    const onFinish=async(values)=>{
        try{
            const finalobj=trimData(values);
            let balance=0;
            if(finalobj.transactionType==="cr"){
                balance=Number(accountDetail.finalBalance)+Number(finalobj.transactionAmount)
            }
          else  if(finalobj.transactionType==="dr"){
                balance=Number(accountDetail.finalBalance)-Number(finalobj.transactionAmount)
            }
            finalobj.currentBalance=accountDetail.finalBalance;
            finalobj.customerId=accountDetail._id;
            finalobj.accountNo=accountDetail.accountNo;
            finalobj.branch=userInfo.branch;
            const httpReq=http();
            await httpReq.post(`/api/transaction`,finalobj);
            await httpReq.put(`/api/customers/${accountDetail._id}`,{finalBalance:balance});
            messageApi.success("Transaction created successfully!");
            transactionForm.resetFields();
            setAccountDetail(null);
        }catch(error){
            messageApi.error("unable to process transaction!")
        }
        
    }
    const searchByAccountNo=async()=>{
        try{
            const obj={accountNo,branch:userinfo?.branch}
            const httpReq=http();
            const {data}=await httpReq.post(`/api/find-by-account`,obj)
            if(data?.data){
                setAccountDetail(data?.data);
            }
            else{
                messageApi.warning("There is no record of this account no!");
                setAccountDetail(null);
            }
        }catch(error){
            messageApi.error("unable to find account details!")
        }
    }
    return(
        <div>
            {contextHolder}
            <card
                title="New Transaction"
                extra={
                    <Input 
                    onChange={(e)=>setAccountNo(e.target.value)}
                    Placeholder="Enter account number"
                    addonAfter={<SearchOutlined
                    onClick={searchByAccountNo}
                    style={{cursor:"pointer"}}/>}
                    />
                    }>
            
                   {
                    accountDetail?
                     <div >
                        <div className="flex items -center justify-start gap-2">
                            <Image src={`${import.meta.env.VITE_BASEURL}${accountDetail?.profile}`} width={120}className="rounded-full"/>
                            <Image src={`${import.meta.env.VITE_BASEURL}${accountDetail?.signature}`} width={120}className="rounded-full"/>
                        </div>
                       <div className="mt-5 grid md:grid-cols-3 gap-8">
                        <div className="mt-3 flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <b>Name:</b><b>{accountDetail?.fullname}</b>
                        </div>
                        <div className="flex justify-between items-center">
                                <b>Mobile:</b><b>{accountDetail?.mobile}</b>
                       </div>
                       <div className="flex justify-between items-center">
                                <b>Balance:</b>
                                <b>
                                    {
                                    accountDetail?.currency==="inr"?"R":"$"
                                    }
                                    {accountDetail?.finalBalance}
                                    </b>
                        </div>
                        <div className="flex justify-between items-center">
                                <b>DOB:</b><b>
                                    {accountDetail?.dob}
                                    </b>
                        </div>
                        <div className="flex justify-between items-center">
                                <b>Currency:</b><b>
                                    {accountDetail?.currency}
                                    </b>
                        </div>
                     </div>
                     <div></div>
                     <Form
                        form ={transactionForm}
                        onFinish={onFinish}
                        layout="vertical">
                            <div className=" grid md:grid-cols-2 gap-x-3">
                                <Form.Item label="Transaction Type" rules={[{required:true}]} name="transactionType">
                                    <select Placeholder="Transaction Type" className="w-full" options={[{value:"cr",label:"CR"},{value:"dr",label:"DR"}]}/>
                                </Form.Item>
                                <Form.Item label="Transaction Amount" rules={[{required:true}]} name="transactionAmount">
                                    <Input Placeholder="500.00" type="number"/>
                                </Form.Item>
                            </div>
                            <Form.Item label="Refrence" name="refrence">
                                    <Input.TextArea/>
                                </Form.Item>
                                <Form.Item >
                                    <Button htmlType="submit"type="text"className="!bg-blue-500!text-white!font-semibold!w-full">submit</Button>
                                </Form.Item>
                     </Form>
                </div>
             </div>
             :<Empty/>
                   }
        </card>
    </div>
    )
}
export default NewTransaction;