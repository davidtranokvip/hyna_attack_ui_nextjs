// import React from 'react';
// import { Select } from 'antd';
// import styled from 'styled-components';

// interface SelectOption {
//     value: string;
//     label: string;
//     disabled?: boolean;
// }

// // Định nghĩa interface cho props của CustomMultiSelect
// interface CustomSelectProps {
//     options?: SelectOption[];
//     placeholder?: string;
//     onChange?: (value: string[], option: SelectOption[] | SelectOption) => void;// Kiểu cho multi-select
//     value?: string[];
//     defaultValue?: string[];
//     width?: number | string;
//     maxTagCount?: number | 'responsive';
//     allowClear?: boolean;
//     showSearch?: boolean;
//     disabled?: boolean;
//     [key: string]: any; // Cho phép các props khác của antd Select
// }
  
// const CustomSelectStyled = styled(Select)`
//   .ant-select-selection-item-remove {
//     color: rgb(0, 255, 0) !important;
//   }

//   .ant-form-item-label > label {
//     font-size: 1.125rem;
//     line-height: normal;
//     margin-bottom: 0px !important;
//     font-weight: 500;
//     color: rgb(0, 255, 0) !important;
//   }

//   .ant-input-outlined {
//     background: #2c2c2c !important;
//     border-radius: 0.375rem;
//     color: #fff;
//     border: 0.0625rem solid #444444 !important;
//   }

//   .ant-select-selector {
//     border-radius: 0.375rem;
//     border: 0.0625rem solid #444444 !important;
//     background: #202020 !important;
//   }

//   .ant-select-selection-placeholder,
//   .ant-select-selection-item {
//     line-height: normal;
//     font-weight: 500;
//     color: rgb(255, 255, 255) !important;
//   }
// `;

// const CustomSelect: React.FC<CustomSelectProps> = ({
//     options = [],
//     placeholder = 'Chọn các mục',
//     onChange,
//     value,
//     defaultValue,
//     width = 200,
//     maxTagCount = 'responsive',
//     allowClear = true,
//     showSearch = false,
//     disabled = false,
//     ...rest
//   }) => {

//     const handleChange = (selectedValues: string[], selectedOptions: SelectOption[] | SelectOption) => {
//         if (onChange) {
//           onChange(selectedValues, selectedOptions);
//         }
//       };
    
//       return (
//         <CustomSelectStyled
//           mode="multiple"
//           options={options}
//           placeholder={placeholder}
//           onChange={handleChange}
//           value={value}
//           defaultValue={defaultValue}
//           style={{ width }}
//           maxTagCount={maxTagCount}
//           allowClear={allowClear}
//           showSearch={showSearch}
//           disabled={disabled}
//           filterOption={(input: string, option?: SelectOption) =>
//             showSearch &&
//             option?.label.toLowerCase().includes(input.toLowerCase())
//           }
//           {...rest}
//         />
//       );
//     };

// export default CustomSelect;