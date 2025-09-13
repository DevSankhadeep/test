import Adminlayout from "../../Layout/Adminlayout";
import NewTransaction from "../../shared/NewTransaction";
import TransactionTable from "../../shared/TransactionTable";
const AdminTransaction  =()=>{
    //get user info from  sessionstorage
    const userInfo=JSON.parse(sessionStorage.getItem('userInfo'));
return(
    <Adminlayout>
        <NewTransaction/>
        <TransactionTable query={{branch:userInfo?.branch}}/>
        </Adminlayout>
)
}
export default AdminTransaction;