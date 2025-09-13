import Employeelayout from "../../Layout/Employeelayout";
import NewTransaction from "../../shared/NewTransaction";
import TransactionTable from "../../shared/TransactionTable";
//get user info from  sessionstorage
const userInfo=JSON.parse(sessionStorage.getItem('userInfo'));

const EmpTransaction=()=>{
    return(
        <Employeelayout>
            <NewTransaction/>
            <TransactionTable query={{branch:userInfo?.branch}}/>
        </Employeelayout>
    )
}
export default EmpTransaction;