import { Button, Card, Form, Input, Table, Image, Popconfirm, Select } from "antd"
import Adminlayout from "../../Layout/Adminlayout"
import { DeleteOutlined, EditOutlined, EyeInvisibleOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons"
import { http, trimData, fetchData, uploadFile } from "../../../modules/modules"
import swal from "sweetalert"
import { useEffect, useState } from "react"
import useSWR from "swr"


const { Item } = Form

export default function NewEmployee() {

  // staes collection 
  const [empForm] = Form.useForm();
  const [loading, setLoading] = useState(false)
  const [photo, setPhoto] = useState(null)
  const [allEmployee, setAllEmployee] = useState([])
  const [finalEmployee, setFinalEmployee] = useState([])
  const [allBranch, setAllBranch] = useState([])
  const [edit, setEdit] = useState(null)
  const [number, setNumber] = useState(0)


  // get branch data 
  const { data: branches, error: bError } = useSWR(
    "/api/branch",
    fetchData,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 1200000
    }
  )

  useEffect(() => {
    if (branches) {
      let filter = branches && branches?.data.map((item) => (
        {
          label: item.branchName,
          value: item.branchName,
          key: item.key,
        }
      ))
      setAllBranch(filter)
    }
    if (bError) {
      console.error("Error fetching branches:", bError);
    }
  }, [branches, bError])


  // get all employee data
  useEffect(() => {
    const fetcher = async () => {
      try {
        const httpRequest = http();
        const { data } = await httpRequest.get("/api/users");
        setAllEmployee(data.data);
        setFinalEmployee(data.data);

      } catch {
        swal("Warning", "Uanble to fetch data", "warning")
      }

    }
    fetcher()
  }, [number])

  // create new employee 
  const onFinish = async (values) => {
    try {
      setLoading(true)
      let finalObj = trimData(values)
      finalObj.profile = photo ? photo : "bankimages/dummy.png"
      finalObj.key = finalObj.email
      finalObj.userType = "employee"
      const httpRequest = http()
      await httpRequest.post(`/api/users`, finalObj)
      const obj = {
        email: finalObj.email,
        password: finalObj.password
      }
      await httpRequest.post(`/api/send-email`, obj)
      swal("Success", "Employee Created", "success")
      empForm.resetFields()
      setPhoto(null)
      setNumber(number + 1)
    } catch (err) {
      if (err?.response?.data?.error?.code === 11000) {
        empForm.setFields([
          {
            name: "email",
            errors: ["Email Already Exists !"]
          }
        ])
      } else {
        swal("Warning", "Try again later", "warning")
      };
    } finally {
      setLoading(false)
    }

  }

  // Update is Active 
  const updateIsActive = async (id, isActive) => {
    try {
      const obj = {
        isActive: !isActive
      }
      const httpRequest = http()
      await httpRequest.put(`/api/users/${id}`, obj)
      swal("Success", "Record Update Successfully", "success")
      setNumber(number + 1)
    } catch {
      swal("Warning", "Unable to update isActive !", "warning")
    }
  }

  // update employee

  const onEditUser = async (obj) => {
    setEdit(obj);
    empForm.setFieldsValue(obj)
  }

  const onUpdate = async (values) => {
    try {
      setLoading(true)
      let finalObj = trimData(values)
      if (photo) {
        finalObj.profile = photo
      }
      const httpRequest = http()
      await httpRequest.put(`/api/users/${edit._id}`, finalObj)
      swal("Success", "Employee Record Update Successfully", "success")
      empForm.resetFields()
      setEdit(null)
      setNumber(number + 1)
    } catch {
      swal("Warning", "Unable to update employee !", "warning")
    } finally {
      setLoading(false)
    }
  }

  // delete employee
  const onDeleteUser = async (id) => {
    try {
      const httpRequest = http()
      await httpRequest.delete(`/api/users/${id}`)
      swal("Success", "Employee Record Delete Successfully", "success")
      setNumber(number + 1)
    } catch {
      swal("Warning", "Unable to delete employee !", "warning")
    }
  }

  // handle upload
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const folderName = "employeePhoto";
    try {
      const result = await uploadFile(file, folderName);
      setPhoto(result.filePath);
      swal("Success", "Image uploaded successfully", "success");
    } catch {
      swal("Failed", "Unable to upload", "warning");
    }
  };


  // Search Code 
  const onSearch = (e) => {
    let value = e.target.value.trim().toLowerCase()
    let filter = finalEmployee && finalEmployee.filter(emp => {
      if (emp?.fullname?.toLowerCase().indexOf(value) != -1) {
        return emp
      } else if (emp?.userType?.toLowerCase().indexOf(value) != -1) {
        return emp
      } else if (emp?.email?.toLowerCase().indexOf(value) != -1) {
        return emp
      } else if (emp?.branch?.toLowerCase().indexOf(value) != -1) {
        return emp
      } else if (emp?.mobile?.toLowerCase().indexOf(value) != -1) {
        return emp
      } else if (emp?.address?.toLowerCase().indexOf(value) != -1) {
        return emp
      }
    })
    setAllEmployee(filter)
  }

  // columns for table 
  const columns = [
    {
      title: "Profile",
      key: "profile",
      render: (src, obj) => (
        <Image src={`${import.meta.env.VITE_BASEURL}/${obj.profile}`} className="rounded-full" width={40} height={40} />
      )
    },
    {
      title: "User Type",
      dataIndex: "userType",
      key: "userType",
      render: (text) => {
        if (text === "admin") {
          return <span className="text-indigo-500 capitalize">{text}</span>
        } else if (text === "employee") {
          return <span className="text-green-500 capitalize">{text}</span>
        } else {
          return <span className="text-red-500 capitalize">{text}</span>
        }
      }
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch"
    },
    {
      title: "Fullname",
      dataIndex: "fullname",
      key: "fullname",
      render: (text) => <span className="capitalize">{text}</span>
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email"
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile"
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address"
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (_, obj) => (
        <div className="flex gap-1">
          <Popconfirm
            title="Are You Sure?"
            description="Once you update, you can also re-update !"
            onCancel={() => swal("Warning", "No Changes Occur", "warning")}
            onConfirm={() => updateIsActive(obj._id, obj.isActive)}
          >
            <Button type="text" className={`${obj.isActive ? "!bg-indigo-100 !text-indigo-500" : "!bg-pink-100 !text-pink-500"}`}
              icon={obj.isActive ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            />
          </Popconfirm>

          <Popconfirm
            title="Are You Sure?"
            description="Once you update, you can also re-update !"
            onCancel={() => swal("Warning", "No Changes Occur", "warning")}
            onConfirm={() => onEditUser(obj)}
          >
            <Button type="text" className="!bg-green-100 !text-green-500" icon={<EditOutlined />} />
          </Popconfirm>

          <Popconfirm
            title="Are You Sure?"
            description="Once you deleted, you can't restore !"
            onCancel={() => swal("Info", "Your Data is Safe", "info")}
            onConfirm={() => onDeleteUser(obj._id)}
          >
            <Button type="text" className="!bg-rose-100 !text-rose-500" icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      )
    },

  ]

  return (
    <div>
      <Adminlayout>
        <div className="grid md:grid-cols-3 gap-3">
          <Card title='Add new employee'>
            <Form form={empForm} onFinish={edit ? onUpdate : onFinish} layout="vertical">
              <Item
                name="branch"
                label="Select Branch"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select Branch"
                  options={allBranch}
                />
              </Item>
              <Item label='Profile' name="xyz">
                <Input onChange={handleUpload} type="file" />
              </Item>

              <div className="grid md:grid-cols-2 gap-x-2">
                <Item label='Fullname' name="fullname" rules={[{ required: true }]}>
                  <Input />
                </Item>

                <Item label='Mobile' name="mobile" rules={[{ required: true }]}>
                  <Input type="number" />
                </Item>

                <Item label='Email' name="email" rules={[{ required: true }]}>
                  <Input />
                </Item>

                <Item label='Password' name="password" rules={[{ required: true }]}>
                  <Input disabled={edit ? true : false} />
                </Item>
              </div>

              <Item label='Address' name="address">
                <Input.TextArea />
              </Item>

              <Item>
                {
                  edit ?
                    <Button loading={loading} type="text" htmlType="submit" className="!bg-rose-500 !text-white !font-bold !w-full">
                      Update
                    </Button>
                    :
                    <Button loading={loading} type="text" htmlType="submit" className="!bg-blue-500 !text-white !font-bold !w-full">
                      Submit
                    </Button>
                }
              </Item>
            </Form>
          </Card>
          <Card
            style={{ overflowX: "auto" }}
            title="Employee list"
            extra={
              <div>
                <Input
                  placeholder="Search By All"
                  prefix={<SearchOutlined />}
                  onChange={onSearch}
                />
              </div>
            }
            className="md:col-span-2"
          >
            <Table scroll={{ x: "max-content" }} columns={columns} dataSource={allEmployee} />
          </Card>
        </div>
      </Adminlayout>
    </div>
  )
}
