import React from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Paperclip } from "lucide-react";

const FileUploader = ({ onUploadComplete }) => {
  const onDrop = async (acceptedFiles) => {
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post("/chat/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onUploadComplete(response.data);
    } catch (err) {
      console.error("파일 업로드 실패:", err);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={{
        border: "1px dashed #999",
        padding: "8px",
        margin: "8px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isDragActive ? "#f0f0f0" : "white",
        cursor: "pointer",
        borderRadius: "6px"
      }}
    >
      <input {...getInputProps()} />
      <Paperclip style={{ marginRight: "6px" }} />
      <span>파일 선택 또는 드래그 앤 드롭</span>
    </div>
  );
};

export default FileUploader;