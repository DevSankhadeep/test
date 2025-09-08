import { Button, Card, Form, Input, Table, Image, Popconfirm } from "antd"
import Adminlayout from "../../Layout/Adminlayout"
import { DeleteOutlined, EditOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons"
import { http, trimData } from "../../../modules/modules"
import swal from "sweetalert"
import { useEffect, useState } from "react"


const { Item } = Form

export default function Currency() {

    // staes collection 
    const [currencyForm] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [allCurrency, setAllCurrency] = useState([])
    const [edit, setEdit] = useState(null)
    const [number, setNumber] = useState(0)

    // get all employee data

    useEffect(() => {
        const fetcher = async () => {
            try {
                const httpRequest = http();
                const { data } = await httpRequest.get("/api/currency");
                setAllCurrency(data.data);

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
            finalObj.key = finalObj.currencyName
            const httpRequest = http()
            await httpRequest.post(`/api/currency`, finalObj)
            swal("Success", "Currency Created", "success")
            currencyForm.resetFields()
            setNumber(number + 1)
        } catch (err) {
            if (err?.response?.data?.error?.code === 11000) {
                currencyForm.setFields([
                    {
                        name: "currencyName",
                        errors: ["Currency Already Exists !"]
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

    const onEditCurrency = async (obj) => {
        setEdit(obj);
        currencyForm.setFieldsValue(obj)
    }

    const onUpdate = async (values) => {
        try {
            setLoading(true)
            let finalObj = trimData(values)
            const httpRequest = http()
            await httpRequest.put(`/api/currency/${edit._id}`, finalObj)
            swal("Success", "Currency Update Successfully", "success")
            setEdit(null)
            setNumber(number + 1)
            currencyForm.resetFields()
        } catch {
            swal("Warning", "Unable to update currency !", "warning")
        } finally {
            setLoading(false)
        }
    }

    // delete employee
    const onDeleteCurrency = async (id) => {
        try {
            const httpRequest = http()
            await httpRequest.delete(`/api/currency/${id}`)
            swal("Success", "Currency Record Delete Successfully", "success")
            setNumber(number + 1)
        } catch {
            swal("Warning", "Unable to delete currency !", "warning")
        }
    }


    // columns for table 
    const columns = [

        {
            title: "Currency Name",
            dataIndex: "currencyName",
            key: "currencyName"
        },
        {
            title: "Currency Description",
            dataIndex: "currencyDesc",
            key: "currencyDesc"
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
                        onConfirm={() => onEditCurrency(obj)}
                    >
                        <Button type="text" className="!bg-green-100 !text-green-500" icon={<EditOutlined />} />
                    </Popconfirm>

                    <Popconfirm
                        title="Are You Sure?"
                        description="Once you deleted, you can't restore !"
                        onCancel={() => swal("Info", "Your Data is Safe", "info")}
                        onConfirm={() => onDeleteCurrency(obj._id)}
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
                    <Card title='Add new currency'>
                        <Form form={currencyForm} onFinish={edit ? onUpdate : onFinish} layout="vertical">

                            <Item label='Currency Name' name="currencyName" rules={[{ required: true }]}>
                                <Input />
                            </Item>

                            <Item label='Currency Description' name="currencyDesc">
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
                    <Card style={{ overflowX: "auto" }} title="Currency list" className="md:col-span-2">
                        <Table scroll={{ x: "max-content" }} columns={columns} dataSource={allCurrency} />
                    </Card>
                </div>
            </Adminlayout>
        </div>
    )
}
