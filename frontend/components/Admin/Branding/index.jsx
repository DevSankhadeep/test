import { Button, Card, Form, Input } from "antd"
import Adminlayout from "../../Layout/Adminlayout"
import { EditOutlined } from "@ant-design/icons"
import swal from "sweetalert"
import { http, trimData } from "../../../modules/modules"
import { useEffect, useState } from "react"

const { Item } = Form

export default function Branding() {

    const [bankForm] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [photo, setPhoto] = useState(null)
    const [branding, setBranding] = useState(null)
    const [number, setNumber] = useState(0)
    const [edit, setEdit] = useState(false)


    // get all branding data
    useEffect(() => {
        const fetcher = async () => {
            try {
                const httpRequest = http();
                const { data } = await httpRequest.get("/api/branding");
                bankForm.setFieldsValue(data?.data[0])
                setBranding(data?.data[0]);
                setEdit(true)
            } catch {
                swal("Warning", "Uanble to fetch data", "warning")
            }
        }
        fetcher()
    }, [number])


    // store bank details in database 
    const onFinish = async (values) => {
        try {
            setLoading(true)
            const finalObj = trimData(values)
            finalObj.bankLogo = photo ? photo : "bankimages/dummy.png"
            const userInfo = {
                email: finalObj.email,
                fullname: finalObj.fullname,
                password: finalObj.password,
                userType: "admin",
                isActive: true,
                profile: "bankimages/dummy.png"
            }
            const httpRequest = http()
            await httpRequest.post("/api/branding", finalObj)
            await httpRequest.post("/api/users", userInfo)
            swal("Success", "Branding Created Successfully", "success")
            bankForm.resetFields()
            setPhoto(null)
            setNumber(number + 1)
        } catch {
            swal("Warning", "Unable to store branding !", "warning")
        } finally {
            setLoading(false)
        }
    }

    // update bank details in database 
    const onUpdate = async (values) => {
        try {
            setLoading(true)
            const finalObj = trimData(values)
            if (photo) {
                finalObj.bankLogo = photo
            }
            const httpRequest = http()
            await httpRequest.put(`/api/branding/${branding._id}`, finalObj)
            swal("Success", "Branding Updated Successfully", "success")
            bankForm.resetFields()
            setPhoto(null)
            setNumber(number + 1)
        } catch {
            swal("Warning", "Unable to update branding !", "warning")
        } finally {
            setLoading(false)
        }
    }

    // handle upload
    const handleUpload = async (e) => {
        try {
            let file = e.target.files[0]
            const formData = new FormData()
            formData.append("photo", file)
            const httpRequest = http()
            const { data } = await httpRequest.post("/api/upload", formData)
            setPhoto(data.filePath);
        } catch {
            swal("Failed", "Unable to upload", "warning")
        }

    }

    return (
        <Adminlayout>
            <Card
                title="Bank Details"
                extra={
                    <Button onClick={() => setEdit(!edit)} icon={<EditOutlined />} />
                }
            >
                <Form
                    form={bankForm}
                    layout="vertical"
                    onFinish={branding ? onUpdate : onFinish}
                    disabled={branding ? edit : !edit}
                >
                    <div className="grid md:grid-cols-3 gap-x-3">
                        <Item
                            label="Bank Name"
                            name="bankName"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Item>

                        <Item
                            label="Bank Tagline"
                            name="bankTagline"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Item>

                        <Item
                            label="Bank Logo"
                            name="xyz"
                        >
                            <Input type="file" onChange={handleUpload} />
                        </Item>

                        <Item
                            label="Bank Account No"
                            name="bankAccountNo"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Item>

                        <Item
                            label="Bank Account Transaction Id"
                            name="bankTransactionId"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Item>

                        <Item
                            label="Bank Address"
                            name="bankAddress"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Item>

                        <div className={`${branding ? "hidden" : "md:col-span-3 grid md:grid-cols-3 gap-x-3"}`}>

                            <Item
                                label="Admin Fullname"
                                name="fullname"
                                rules={[{ required: branding ? false : true }]}
                            >
                                <Input />
                            </Item>

                            <Item
                                label="Admin Email"
                                name="email"
                                rules={[{ required: branding ? false : true }]}
                            >
                                <Input />
                            </Item>

                            <Item
                                label="Admin Password"
                                name="password"
                                rules={[{ required: branding ? false : true }]}
                            >
                                <Input.Password />
                            </Item>

                        </div>

                        <Item
                            label="Bank LinkedIn"
                            name="bankLinkedIn"
                        >
                            <Input type="url" />
                        </Item>

                        <Item
                            label="Bank Twitter"
                            name="bankTwitter"
                        >
                            <Input type="url" />
                        </Item>

                        <Item
                            label="Bank Facebook"
                            name="bankFacebook"
                        >
                            <Input type="url" />
                        </Item>
                    </div>

                    <Item
                        label="Bank Description"
                        name="bankDesc"
                    >
                        <Input.TextArea />
                    </Item>

                    {
                        branding ?
                            <Item className="flex justify-end items-center">
                                <Button
                                    loading={loading}
                                    type="text"
                                    htmlType="submit"
                                    className="!bg-rose-500 !text-white !font-bold"
                                >
                                    Update
                                </Button>
                            </Item>
                            :
                            <Item className="flex justify-end items-center">
                                <Button
                                    loading={loading}
                                    type="text"
                                    htmlType="submit"
                                    className="!bg-blue-500 !text-white !font-bold"
                                >
                                    Submit
                                </Button>
                            </Item>
                    }
                </Form>
            </Card>
        </Adminlayout>
    )
}
