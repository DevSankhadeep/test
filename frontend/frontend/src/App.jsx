import { lazy, Suspense } from "react"
import Guard from "../components/Guard"
import Loader from "../components/Loader"
import { BrowserRouter, Routes, Route } from "react-router-dom"

const Homepage = lazy(() => import("../components/Home"))
const Dashboard = lazy(() => import("../components/Admin"))
const NewEmployee = lazy(() => import("../components/Admin/NewEmployee"))
const PageNotFound = lazy(() => import("../components/PageNotFound"))
const Branding = lazy(() => import("../components/Admin/Branding"))
const Branch = lazy(() => import("../components/Admin/Branch"))
const Currency = lazy(() => import("../components/Admin/Currency"))
const EmployeeDashboard = lazy(() => import("../components/Employee"))
const NewAccount = lazy(() => import("../components/Employee/NewAccount"))


function App() {

  return (
    <div>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Homepage />} />

            {/* {Start Admin Related Routes} */}
            <Route path="/admin/" element={<Guard endpoint={"/api/verify-token"} role={"admin"} />}>
              <Route index element={<Dashboard />} />
              <Route path="branding" element={<Branding />} />
              <Route path="branch" element={<Branch />} />
              <Route path="currency" element={<Currency />} />
              <Route path="new-employee" element={<NewEmployee />} />
              <Route path="*" element={<PageNotFound />} />
            </Route>
            {/* {End Admin Related Routes} */}

            {/* {Start Employee Related Routes} */}
            <Route path="/employee/" element={<Guard endpoint={"/api/verify-token"} role={"employee"} />}>
              <Route index element={<EmployeeDashboard />} />
              <Route path="new-account" element={<NewAccount />} />
              <Route path="*" element={<PageNotFound />} />
            </Route>
            {/* {End Employee Related Routes} */}




            <Route path="/*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  )
}

export default App
