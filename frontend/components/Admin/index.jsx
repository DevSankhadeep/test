import Adminlayout from "../Layout/Adminlayout";

export default function Dashboard() {
  return (
    <div>
        <Adminlayout>
            <h1 className="text-5xl font-bold text-red-500">
                Welcome to admin dashboard
            </h1>
        </Adminlayout>
    </div>
  )
}