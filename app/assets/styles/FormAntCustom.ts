import { Form, FormProps } from "antd";
import styled, { WebTarget } from "styled-components";

export const CustomFormStyled = styled(Form)<FormProps<void | WebTarget>>`
    .ant-select-selection-item-remove {
        color: rgb(0, 255, 0) !important;
    }
    .ant-form-item {
        margin-bottom: 0 !important;
    }
    .ant-form-item-label > label {
        font-size: 1.125rem;
        line-height: normal;
        margin-bottom: 0px !important;
        font-weight: 500;
        color: rgb(0, 255, 0) !important;
    }

    .ant-input-outlined {
        background: #2c2c2c !important;
        border-radius: 0.375rem;
        color: #fff;
        border: 0.0625rem solid #444444 !important;
        }
    .ant-input-outlined::placeholder {
        color: #FFF;
        opacity: 1; 
    }
    .ant-table-placeholder {
        background: #2c2c2c !important;
        color: #fff !important;
    }
    .ant-empty-description {
        color: #fff !important;
    }
    .ant-select-selector {
        border-radius: 0.375rem;
        border: 0.0625rem solid #444444 !important;
        background: #2c2c2c !important;
    }
    .ant-select-selection-placeholder, .ant-select-selection-item {
        line-height: normal;
        font-weight: 500;
        color: rgb(255, 255, 255) !important;
    }
` as typeof Form;;