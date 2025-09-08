import { Button, Card, DatePicker, Form, Input, message, Modal, Select, Table } from "antd"
import EmployeeLayout from "../../Layout/Employeelayout"
import { SearchOutlined } from "@ant-design/icons"
import { http, trimData, fetchData, uploadFile } from "../../../modules/modules"
import swal from "sweetalert"
import { useState } from "react"
import useSWR, { mutate } from "swr"


const { Item } = Form

export default function NewAccount() {

    // get userinfo from sessionstorage 
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"))


    const [accountForm] = Form.useForm()
    const [messageApi, context] = message.useMessage()

    // sate collections 
    const [accountModal, setAccountModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [photo, setPhoto] = useState(null)
    const [signature, setSignature] = useState(null)
    const [document, setDocument] = useState(null)
    const [number, setNumber] = useState(0)

    // get branding details 

    const { data: brandings, error: bError } = useSWR(
        "/api/branding",
        fetchData,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000
        }
    )

    let bankAccountNo = Number(brandings && brandings?.data[0]?.bankAccountNo) + 1
    let brandingId = brandings && brandings?.data[0]?._id

    accountForm.setFieldValue("accountNo", bankAccountNo)


    // create new account 
    const onFinish = async (values) => {
        try {
            setLoading(true)
            let finalObj = trimData(values)
            finalObj.profile = photo ? photo : "bankimages/dummy.png"
            finalObj.signature = signature ? signature : "bankimages/dummy.png"
            finalObj.document = document ? document : "bankimages/dummy.png"
            finalObj.key = finalObj.email
            finalObj.userType = "customer"
            finalObj.branch = userInfo?.branch
            finalObj.createBy = userInfo?.email
            const httpRequest = http()

            await httpRequest.post(`/api/users`, finalObj)
            const obj = {
                email: finalObj.email,
                password: finalObj.password
            }
            await httpRequest.post(`/api/customers`, finalObj)
            await httpRequest.post(`/api/send-email`, obj)
            await httpRequest.put(`/api/branding/${brandingId}`, { bankAccountNo })
            accountForm.resetFields()
            setPhoto(null)
            setSignature(null)
            setDocument(null)
            setNumber(number + 1)
            setAccountModal(false)
            swal("Success", "Account Created", "success")
        } catch (err) {
            if (err?.response?.data?.error?.code === 11000) {
                accountForm.setFields([
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


    // handle photo
    const handlePhoto = async (e) => {
        const file = e.target.files[0];
        const folderName = "customerPhoto";
        try {
            const result = await uploadFile(file, folderName);
            setPhoto(result.filePath);
            swal("Success", "Image uploaded successfully", "success");
        } catch {
            swal("Failed", "Unable to upload", "warning");
        }
    };

    // handle signature
    const handleSignature = async (e) => {
        const file = e.target.files[0];
        const folderName = "customerSignature";
        try {
            const result = await uploadFile(file, folderName);
            setSignature(result.filePath);
            swal("Success", "Image uploaded successfully", "success");
        } catch {
            swal("Failed", "Unable to upload", "warning");
        }
    };

    // handle document
    const handleDocument = async (e) => {
        const file = e.target.files[0];
        const folderName = "customerDocument";
        try {
            const result = await uploadFile(file, folderName);
            setDocument(result.filePath);
            swal("Success", "Image uploaded successfully", "success");
        } catch {
            swal("Failed", "Unable to upload", "warning");
        }
    };

    // columns for table 
    const columns = [
        {
            title: "Branch",
            dataIndex: "branch",
            key: "branch"
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
            title: "Account No",
            dataIndex: "accountNo",
            key: "accountNo",
        },
        {
            title: "Fullname",
            dataIndex: "fullname",
            key: "fullname",
            render: (text) => <span className="capitalize">{text}</span>
        },
        {
            title: "DOB",
            dataIndex: "dob",
            key: "dob",
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
            title: "Photo",
            key: "photo",
            render: (src, obj) => (
                <Image src={`${import.meta.env.VITE_BASEURL}/${obj.profile}`} className="rounded-full" width={40} height={40} />
            )
        },
        {
            title: "Signature",
            key: "signature",
            render: (src, obj) => (
                <Image src={`${import.meta.env.VITE_BASEURL}/${obj.profile}`} className="rounded-full" width={40} height={40} />
            )
        },
        {
            title: "Document",
            key: "document",
            render: (src, obj) => (
                <Image src={`${import.meta.env.VITE_BASEURL}/${obj.profile}`} className="rounded-full" width={40} height={40} />
            )
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
                    // onConfirm={() => updateIsActive(obj._id, obj.isActive)}
                    >
                        <Button type="text" className={`${obj.isActive ? "!bg-indigo-100 !text-indigo-500" : "!bg-pink-100 !text-pink-500"}`}
                            icon={obj.isActive ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        />
                    </Popconfirm>

                    <Popconfirm
                        title="Are You Sure?"
                        description="Once you update, you can also re-update !"
                        onCancel={() => swal("Warning", "No Changes Occur", "warning")}
                    // onConfirm={() => onEditUser(obj)}
                    >
                        <Button type="text" className="!bg-green-100 !text-green-500" icon={<EditOutlined />} />
                    </Popconfirm>

                    <Popconfirm
                        title="Are You Sure?"
                        description="Once you deleted, you can't restore !"
                        onCancel={() => swal("Info", "Your Data is Safe", "info")}
                    // onConfirm={() => onDeleteUser(obj._id)}
                    >
                        <Button type="text" className="!bg-rose-100 !text-rose-500" icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            )
        },

    ]
    return (
        <EmployeeLayout>
            {context}
            <div className="grid">
                <Card
                    title="Account List"
                    style={{ overflowX: "auto" }}
                    extra={
                        <div className="flex gap-x-3">
                            <Input
                                placeholder="Search By Name"
                                prefix={<SearchOutlined />}
                            // onChange={onSearch}
                            />
                            <Button
                                onClick={() => setAccountModal(true)}
                                type="text"
                                className="!font-bold !bg-blue-500 !text-white"
                            >
                                Add New Account
                            </Button>
                        </div>
                    }
                >
                    <Table
                        scroll={{ x: "max-content" }}
                        columns={columns}
                    //  dataSource={allEmployee} 
                    />
                </Card>
            </div>

            <Modal
                open={accountModal}
                onCancel={() => setAccountModal(false)}
                width={820}
                footer={null}
                title="Open New Account"
            >
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    form={accountForm}
                >
                    <div className="grid md:grid-cols-3 gap-x-3">
                        <Item
                            label="Account No"
                            name="accountNo"
                            rules={[{ required: true }]}
                        >
                            <Input disabled placeholder="Account No" />
                        </Item>

                        <Item
                            label="Full Name"
                            name="fullname"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="Enter fullname" />
                        </Item>

                        <Item
                            label="Mobile"
                            name="mobile"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="Enter mobile" />
                        </Item>

                        <Item
                            label="Father Name"
                            name="fathername"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="Enter father name" />
                        </Item>

                        <Item
                            label="Email"
                            name="email"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="Enter email" />
                        </Item>

                        <Item
                            label="Password"
                            name="password"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="Enter password" />
                        </Item>


                        <Item
                            label="DOB"
                            name="dob"
                            rules={[{ required: true }]}
                        >
                            <Input type="date" />
                        </Item>

                        <Item
                            label="Gender"
                            name="gender"
                            rules={[{ required: true }]}
                        >
                            <Select
                                placeholder="Select Gender"
                                options={[
                                    { label: "Male", value: "male" },
                                    { label: "Female", value: "female" }
                                ]}
                            />
                        </Item>

                        <Item
                            label="Currency"
                            name="currency"
                            rules={[{ required: true }]}
                        >
                            <Select
                                placeholder="Select Currency"
                                options={[
                                    { label: "INR", value: "inr" },
                                    { label: "USD", value: "usd" }
                                ]}
                            />
                        </Item>

                        <Item
                            label="Photo"
                            name="photo"
                        >
                            <Input type="file" onChange={handlePhoto} />
                        </Item>

                        <Item
                            label="Signature"
                            name="signature"
                        >
                            <Input type="file" onChange={handleSignature} />
                        </Item>

                        <Item
                            label="Document"
                            name="document"
                        >
                            <Input type="file" onChange={handleDocument} />
                        </Item>
                    </div>

                    <Item
                        label="Address"
                        name="address"
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea />
                    </Item>

                    <Item
                        className="flex justify-end items-center"
                    >
                        <Button
                            loading={loading}
                            type="text"
                            htmlType="submit"
                            className="!font-semibold !text-white !bg-blue-500"
                        >
                            Submit
                        </Button>
                    </Item>
                </Form>
            </Modal>
        </EmployeeLayout>
    )
}
