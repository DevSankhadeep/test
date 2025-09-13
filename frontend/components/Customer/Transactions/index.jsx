import customerlayout from "../../Layout/Customerlayout";
import TransactionTable from "../../shared/TransactionTable";
const CustomerTransaction=()=>{
    //get userInfo from sessionstorage
    const userInfo=JSON.parse(sessionStorage.getItem('userInfo'));
    return(
        <customerlayout>
            <TransactionTable query={{accountNo:userInfo?.accountNo,branch:userInfo?.branch}}/>
        </customerlayout>
    )
}
export default CustomerTransaction;