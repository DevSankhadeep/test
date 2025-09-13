import customerlayout from "../Layout/Customerlayout";
import Dashboard from "../../shared/Dashboard";
import useSWR from "swr";
import {fetchData} from "../../modules/modules";
const CustomerDashboard=()=>{
    // get userinfo from sessionstorage
  const userinfo=JSON.parse(sessionStorage.getItem("userInfo"));
  const{data:trData,error:trError}=useSWR(`/api/transactions/summary?accountNo=${userinfo?.accountNo}`,
    fetchData,
    {
    revalidateOnFocus:false,revalidateOnReconnect:false,refreshInterval:120000,
    });
    return(
        <customerlayout>
            <Dashboard data={trData && trData} />
        </customerlayout>
    )
}
export default CustomerDashboard ;