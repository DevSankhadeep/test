import { Button, Card, Form, Input, Table, Image, Popconfirm } from "antd"
import Adminlayout from "../../Layout/Adminlayout"
import { DeleteOutlined, EditOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons"
import { http, trimData } from "../../../modules/modules"
import swal from "sweetalert"
import { useEffect, useState } from "react"


const { Item } = Form

export default function Branch() {

    // staes collection 
    const [branchForm] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [allBranch, setAllBranch] = useState([])
    const [edit, setEdit] = useState(null)
    const [number, setNumber] = useState(0)

    // get all employee data

    useEffect(() => {
        const fetcher = async () => {
            try {
                const httpRequest = http();
                const { data } = await httpRequest.get("/api/branch");
                setAllBranch(data.data);

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
            finalObj.key = finalObj.branchName
            const httpRequest = http()
            await httpRequest.post(`/api/branch`, finalObj)
            swal("Success", "Branch Created", "success")
            branchForm.resetFields()
            setNumber(number + 1)
        } catch (err) {
            if (err?.response?.data?.error?.code === 11000) {
                branchForm.setFields([
                    {
                        name: "branchName",
                        errors: ["Branch Already Exists !"]
                    }
                ])
            } else {
                swal("Warning", "Try again later", "warning")
            };
        } finally {
            setLoading(false)
        }

    }

    // update employee

    const onEditBranch = async (obj) => {
        setEdit(obj);
        branchForm.setFieldsValue(obj)
    }

    const onUpdate = async (values) => {
        try {
            setLoading(true)
            let finalObj = trimData(values)
            const httpRequest = http()
            await httpRequest.put(`/api/branch/${edit._id}`, finalObj)
            swal("Success", "Branch Update Successfully", "success")
            setEdit(null)
            setNumber(number + 1)
            branchForm.resetFields()
        } catch {
            swal("Warning", "Unable to update branch !", "warning")
        } finally {
            setLoading(false)
        }
    }

    // delete employee
    const onDeleteBranch = async (id) => {
        try {
            const httpRequest = http()
            await httpRequest.delete(`/api/branch/${id}`)
            swal("Success", "Branch Record Delete Successfully", "success")
            setNumber(number + 1)
        } catch {
            swal("Warning", "Unable to delete branch !", "warning")
        }
    }


    // columns for table 
    const columns = [

        {
            title: "Branch Name",
            dataIndex: "branchName",
            key: "branchName"
        },
        {
            title: "Branch Address",
            dataIndex: "branchAddress",
            key: "branchAddress"
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
                        onConfirm={() => onEditBranch(obj)}
                    >
                        <Button type="text" className="!bg-green-100 !text-green-500" icon={<EditOutlined />} />
                    </Popconfirm>

                    <Popconfirm
                        title="Are You Sure?"
                        description="Once you deleted, you can't restore !"
                        onCancel={() => swal("Info", "Your Data is Safe", "info")}
                        onConfirm={() => onDeleteBranch(obj._id)}
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
                    <Card title='Add new branch'>
                        <Form form={branchForm} onFinish={edit ? onUpdate : onFinish} layout="vertical">

                            <Item label='Branch Name' name="branchName" rules={[{ required: true }]}>
                                <Input />
                            </Item>

                            <Item label='Branch Address' name="branchAddress">
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
                    <Card style={{ overflowX: "auto" }} title="Branch list" className="md:col-span-2">
                        <Table scroll={{ x: "max-content" }} columns={columns} dataSource={allBranch} />
                    </Card>
                </div>
            </Adminlayout>
        </div>
    )
}
