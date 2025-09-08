
import React from 'react'
import { Button, Card, Form, Input, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import swal from "sweetalert"
import { http, trimData } from '../../../modules/modules';
import Cookies from "universal-cookie"
import { useNavigate } from "react-router-dom"

const { Item } = Form


export default function Login() {

    const cookies = new Cookies()
    const expires = new Date()
    expires.setDate(expires.getDate() + 3)

    const navigate = useNavigate()

    const [messageApi, context] = message.useMessage()

    const onFinish = async (values) => {
        try {
            const finalObj = trimData(values)
            const httpRequest = http()
            const { data } = await httpRequest.post("/api/login", finalObj)
            if (data?.isLoged && data?.userType === "admin") {
                const { token } = data
                cookies.set("authToken", token, {
                    path: "/",
                    expires
                })
                navigate("/admin")
            } else if (data?.isLoged && data?.userType === "employee") {
                const { token } = data
                cookies.set("authToken", token, {
                    path: "/",
                    expires
                })
                navigate("/employee")
            } else if (data?.isLoged && data?.userType === "customer") {
                const { token } = data
                cookies.set("authToken", token, {
                    path: "/",
                    expires
                })
                navigate("/customer")
            } else {
                swal("Warning", "Wrong Credentials", "warning")
            }
            swal("Success", "Login Success", "success")
        } catch (err) {
            messageApi.error(err?.response?.data?.message)
        }

    }


    return (
        <div className='flex'>
            {context}
            <div className='hidden md:flex items-center justify-center w-1/2'>
                <img className='w-4/5 object-contain' src="/banking.jpg" alt="Bank" />
            </div>
            <div className='flex items-center justify-center w-full md:w-1/2 p-6 bg-white'>
                <Card className='w-full max-w-sm shadow-xl'>
                    <h2 className='text-2xl font-semibold text-center mb-6'>Bank Login</h2>
                    <Form name='login' onFinish={onFinish} layout='vertical'>
                        <Item name="email" label="username" rules={[{ required: true }]}>
                            <Input prefix={<UserOutlined />} placeholder='Enter Your Username' />
                        </Item>

                        <Item name="password" label="password" rules={[{ required: true }]}>
                            <Input.Password prefix={<LockOutlined />} placeholder='Enter Your Password' />
                        </Item>

                        <Item>
                            <Button type='text' htmlType='submit' block className='!bg-blue-500 !text-white !font-bold'>
                                Login
                            </Button>
                        </Item>
                    </Form>
                </Card>
            </div>
        </div>
    )
}
