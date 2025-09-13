import Adminlayout from "../Layout/Adminlayout";
import Dashboard from "../shared/Dashboard";
import useSWR from "swr";
import {fetchData} from "../../modules/modules";

const AdminDashboard=()=> {
  // get userinfo from sessionstorage
  const userinfo=JSON.parse(sessionStorage.getItem("userInfo"));
  const{data:trData,error:trError}=useSWR(`/api/transactions/summary?branch=${userinfo?.branch}`,
    fetchData,
    {
    revalidateOnFocus:false,revalidateOnReconnect:false,refreshInterval:120000,
    });
  return (
        <Adminlayout>
         <Dashboard data={trData && trData} />   
        </Adminlayout>
    
  )
}
export default AdminDashboard;