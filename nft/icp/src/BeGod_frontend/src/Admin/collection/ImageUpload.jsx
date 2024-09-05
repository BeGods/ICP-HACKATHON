import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
const fileList = [];
const App = () => (
  <Upload
    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
    listType="picture"
    defaultFileList={fileList}
  >
    <div 
        className="image_upload_container pl-4 w-[100%] h-[20px] md:h-[40px] bg-[#29292C] rounded-md flex items-center justify-center"
        hidden={hideUpload}
      >
        <RiFolder6Line className="cursor-pointer" onClick={handleIconClick} />
      </div>
  </Upload>
);
export default App;