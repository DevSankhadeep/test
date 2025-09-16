import Customerlayout from "../../Layout/Customerlayout";
import TransactionTable from "../../shared/TransactionTable";
const CustomerTransaction=()=>{
    //get userInfo from sessionstorage
    const userInfo=JSON.parse(sessionStorage.getItem('userInfo'));
    return(
        <Customerlayout>
            <TransactionTable query={{accountNo:userInfo?.accountNo,branch:userInfo?.branch}}/>
        </Customerlayout>
    )
}
export default CustomerTransaction;