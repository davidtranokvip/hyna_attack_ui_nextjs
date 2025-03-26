"use client";

import React, { useEffect, useState } from "react";
import { ILoginReq, loginApi } from "@/api/auth";
import { useRouter } from "next/navigation";
import { Form, FormProps, Input } from "antd";
import styled from "styled-components";
import NoticeError from "@/components/notice/NoticeError";
import NoticePass from "@/components/notice/NoticePass";
import { setTokenCookie } from "@/shared/utils/cookies";
import Image from 'next/image'

export default function Page() {
    
    const router = useRouter();
    const [form] = Form.useForm<ILoginReq>();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(""); 
    
    useEffect(() => {
        const token = localStorage.getItem('hyna_token');
        if(token) return router.push('/');
    }, [router]);

    const handleSubmit = async (values: ILoginReq) => {
        try {
            const data: ILoginReq = {
                nameAccount: values.nameAccount,
                password: values.password
            };
            
            const result = await loginApi(data);

            if (result.status === 'success') {
                setTokenCookie(result.data.token)
                setSuccess(result.message);
                setTimeout(() => {
                  router.push("/");
                }, 1500);
            }
        } catch (error: any) {
            setError(error.response.data.message);
      };
    }
    return (
        <div className="scanlines min-h-screen w-full">
            {error && (
                <NoticeError error={error} setError={setError} myClass="text-8xl md:text-4xl lg:text-8xl"/>
            )}
            {success && (
                <NoticePass success={success} setSuccess={setSuccess} myClass="text-8xl"/>
            )}
            <div className="flex w-full relative flex-col justify-between items-center">
                <div className="pt-4 text-2xl">
                    <h2>CONNECTION ESTABLISHED</h2>
                </div>  
                <div className="w-full max-w-[300px] md:max-w-[350px] lg:max-w-[400px] mx-auto">
                    <Image
                        src="/images/logo.png"
                        width={400}
                        height={400}
                        alt="HYNY SYSTEM"
                        className="w-full h-auto"
                    />
                </div>
                <div className="text-center w-full">
                    <h1 className="font-login title_login hero glitch layers text-6xl md:text-7xl lg:text-9xl mt-4">
                        <span>
                        HYNA SYSTEM
                        </span>
                    </h1>
                    <div className="p-5 flex justify-center mb-16">
                        <StyledForm form={form} onFinish={handleSubmit} layout="horizontal" className="w-full max-w-md">
                            <Form.Item label="USERNAME" name="nameAccount" rules={[{ message: "User not found!" }]} >
                                <Input size='large' autoComplete="off"/>
                            </Form.Item>
                            <Form.Item label="PASSWORD" name="password" >
                                <Input.Password size='large' autoComplete="off"/>
                            </Form.Item>
                            <Form.Item>
                                <button className="rounded-none hover:enabled:bg-[#00ff00] hover:enabled:text-[#000] border-[#00ff00] text-[#00ff00] bg-transparent border py-2 px-6 font-mono mx-auto block transition-all duration-300">
                                    LOGIN
                                </button>
                            </Form.Item>
                        </StyledForm>
                    </div>
                </div>
                <div className="w-[90%] md:w-[75%] lg:w-[50%] pb-5 text-center text-xs md:text-sm">
                    <span className="MatrixTextEffect">HYNA; outputUser= penetrate:typeof accessrequest; user;output(cn) use; py;proxy. output;needer(code of proxy user) output; penetrate&quot; == typeof $. accessRequest // <br />
                    HYNA Version 1.0 by {' '}<span className="Pulse">Team 11A</span>
                    </span>
                </div>
            </div>
        </div>
    );
}

const StyledForm = styled(Form)<FormProps<ILoginReq>>`
    .ant-form-item-label {
        padding-right: 1rem;
        
        @media (min-width: 768px) {
            padding-right: 2rem;
        }
        
        @media (min-width: 1280px) {
            padding-right: 3rem;
        }
    }

    .ant-form-item-label > label {
        text-shadow: 0 0 20px #00ff00;
        font-size: 1rem;
        color: #00ff00;
        
        @media (min-width: 768px) {
            font-size: 1.25rem;
        }
        
        @media (min-width: 1280px) {
            font-size: 1.5rem;
        }
    }

    .ant-input, 
    .ant-input-affix-wrapper {
        background: transparent;
        border: 1px solid #00ff00;
        color: #00ff00;
        padding: 0.5rem;
        border-radius: 0px;
        font-family: monospace;
        outline: none;
        
        &:focus,
        &-focused {
            box-shadow: 0 0 10px #00ff00;
            border-color: #00ff00;
        }
    }

    .anticon {
        color: #00ff00;
        
        svg {
            fill: #00ff00;
        }

        &:hover {
            color: #00ff00;

            svg {
                fill: #00ff00;
            }
        }
    }
    
    .ant-form-item {
        margin-bottom: 1rem;
        
        @media (min-width: 768px) {
            margin-bottom: 1.5rem;
        }
    }
    
    @media (max-width: 640px) {
        .ant-form-item-label {
            padding: 0 0 8px;
            text-align: left;
            white-space: normal;
            display: block;
        }
    }
  }
`;