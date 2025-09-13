import Dashboard from "../shared/Dashboard";
import Employeelayout from "../Layout/Employeelayout";
import useSWR from "swr";
import {fetchData} from "../../modules/modules";

const EmployeeDashboard=()=> {
  // get userinfo from sessionstorage
  const userinfo=JSON.parse(sessionStorage.getItem("userInfo"));
  const{data:trData,error:trError}=useSWR(`/api/transactions/summary?branch=${userinfo?.branch}`,
    fetchData,
    {
    revalidateOnFocus:false,revalidateOnReconnect:false,refreshInterval:120000,
    });
  return (
        <Employeelayout>
            <Dashboard data={trData && trData} />
        </Employeelayout>
  )
}
export default EmployeeDashboard;