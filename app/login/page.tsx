"use client";

import React, { useEffect, useState } from "react";
import { ILoginReq, loginApi } from "@/api/auth";
import { useRouter } from "next/navigation";
import { Form, FormProps, Input } from "antd";
import styled from "styled-components";
import NoticeError from "@/components/notice/NoticeError";
import NoticePass from "@/components/notice/NoticePass";
import SceneWrapper from "@/components/SceneWrapper";
import { setTokenCookie } from "@/shared/utils/cookies";

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
        <div className="scanlines">
            {error && (
                <NoticeError error={error} setError={setError} myClass="text-8xl"/>
            )}
            {success && (
                <NoticePass success={success} setSuccess={setSuccess} myClass="text-8xl"/>
            )}
            <div className="flex w-full relative flex-col justify-between items-center">
                <div className="pt-4 text-2xl">
                    <h2>CONNECTION ESTABLISHED</h2>
                </div>  
                <SceneWrapper height="h-[410px]" />
                <div className="text-center">
                    <h3 className="title_login hero glitch layers">
                        <span>
                            HYNA SYSTEM
                        </span>
                    </h3>
                    <div className="p-5 flex justify-center">
                        <StyledForm form={form} onFinish={handleSubmit} layout="horizontal">
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
                <div className="w-[50%] pb-5 text-center">
                <span className="MatrixTextEffect">HYNA; outputUser= penetrate:typeof accessrequest; user;output(cn) use; py;proxy. output;needer(code of proxy user) output; penetrate&quot; == typeof $. accessRequest // <br />
                HYNA Version 1.0 by {' '}<span className="Pulse">Team 11A</span></span>
                </div>
            </div>
        </div>
    );
}


const StyledForm = styled(Form)<FormProps<ILoginReq>>`
    .ant-form-item-label {
        padding-right: 3rem;
    }

    .ant-form-item-label > label {
        text-shadow: 0 0 20px #00ff00;
        font-size: 1.5rem;
        color: #00ff00;
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
        
  }
`;
