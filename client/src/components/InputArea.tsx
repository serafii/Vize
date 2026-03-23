import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { LinkIcon, UploadIcon, ZapIcon, FolderIcon, XIcon } from "lucide-react";
import { message } from "antd";
import axios from "axios";

interface InputAreaProps {
  onAnalyze: (url: string) => void;
  setAnalysisResult: (result: any) => void;
  setAnalysisComplete: () => void;
  setAnalysisError: () => void;
}

const InputArea: React.FC<InputAreaProps> = ({
  onAnalyze,
  setAnalysisResult,
  setAnalysisComplete,
  setAnalysisError,
}) => {
  const [url, setUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const MAX_FILE_SIZE_MB = 10 * 1024 * 1024; // 10MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = ""; // Reset file input for future uploads

    if (!file.name.endsWith(".zip")) {
      messageApi.open({
        type: "warning",
        content:
          "Only .zip files are supported. Please upload a valid .zip file.",
        className: "custom-class",
        style: {
          marginTop: "20vh",
        },
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB) {
      messageApi.open({
        type: "warning",
        content:
          "File size exceeds the 10MB limit. Please upload a smaller file.",
      });
      return;
    }

    setUploadFile(file);

    messageApi.open({
      type: "success",
      content: `File "${file.name}" uploaded successfully`,
    });
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".zip")) {
      messageApi.open({
        type: "warning",
        content:
          "Only .zip files are supported. Please upload a valid .zip file.",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB) {
      messageApi.warning("File exceeds 10MB limit.");
      return;
    }

    setUploadFile(file);
    messageApi.open({
      type: "success",
      content: `File "${file.name}" uploaded successfully`,
    });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!url && !uploadFile) return;

    if (url && uploadFile) {
      messageApi.open({
        type: "warning",
        content: "Please either provide a URL or upload a file, not both.",
      });
      return;
    }

    if (url && !isValidRepositoryURL(url)) {
      messageApi.open({
        type: "warning",
        content:
          "Repository could not be found. Please try again with a valid repository URL or upload a directory.",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      onAnalyze(url || uploadFile?.name || "uploaded project");

      const formData = new FormData();
      if (uploadFile) {
        formData.append("file", uploadFile);
      } else if (url) {
        formData.append("url", url);
      }

      const response = await axios.post(
        "https://vize-1-zvrl.onrender.com/upload/analyze",
        formData,
      );

      if (response.data.success) {
        const { total_files, total_dirs, total_size, languages } =
          response.data.data;

        const analysis = response.data.analysis;

        const analyzedData = {
          totalFiles: total_files,
          totalDirs: total_dirs,
          totalSize: total_size,
          languages: languages,
          analysis: analysis,
        };

        setAnalysisResult(analyzedData);
        setAnalysisComplete();
      }

      if (response.data.success == false) {
        message.error(
          response.data.message ||
            "An error occurred during analysis. Please try again.",
        );
        setAnalysisError();
      }
    } catch (error: any) {
      console.error("Error during analysis:", error);
      message.error(
        "An error occurred while processing your request. Please try again.",
      );
      setAnalysisError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidRepositoryURL = (input: string): boolean => {
    try {
      const url = new URL(input);

      // Currently supported hosts - can be expanded in the future
      const validHosts = ["github.com", "gitlab.com", "bitbucket.org"];

      if (!validHosts.includes(url.hostname)) return false;

      const pathParts = url.pathname.split("/").filter(Boolean);

      const isValidPath = pathParts.length >= 2; // Ensure at least "username/repo"

      return isValidPath;
    } catch {
      return false;
    }
  };

  return (
    <>
      {contextHolder}
      <motion.div
        className="w-full max-w-xl mx-auto z-10"
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          delay: 0.1,
          ease: "easeOut",
        }}
      >
        <div className="bg-surface rounded-2xl p-6 md:p-8 border border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* URL Input */}
            <div className="space-y-2">
              <label
                htmlFor="url-input"
                className="block text-sm font-medium text-gray-300"
              >
                Project URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-gray-500" />
                </div>
                <div
                  className={`absolute inset-y-0 right-0 pr-4 flex items-center hover:cursor-pointer ${url ? "visible" : "hidden"}`}
                  onClick={() => setUrl("")}
                >
                  <XIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="url-input"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/username/project"
                  className="w-full bg-background border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-accent focus:ring-0 focus:ring-accent transition-all hover:border-accent hover:ring-0 hover:ring-accent"
                />
              </div>
              <p className="block text-xs text-gray-500">
                Supports GitHub, GitLab, and Bitbucket public repositories
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center space-x-4 py-2">
              <div className="h-px bg-white/10 flex-1"></div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Or
              </span>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            {/* Upload Zone */}
            <div
              className="space-y-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                accept=".zip"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
              <label className="block text-sm font-medium text-gray-300">
                Upload Project (.zip)
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group ${isDragging ? "border-accent bg-accent/5" : "border-white/10 hover:border-accent/40 hover:bg-white/2"}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
              >
                <div
                  className={`p-3 rounded-full mb-3 transition-colors ${isDragging ? "bg-accent/20" : "bg-white/5 group-hover:bg-accent/10"}`}
                >
                  <UploadIcon
                    className={`w-6 h-6 ${isDragging ? "text-accent" : "text-gray-400 group-hover:text-accent"}`}
                  />
                </div>
                <p className="text-sm text-gray-300 font-medium text-center">
                  <span className="text-accent">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Supports .zip folders up to 10MB
                </p>
              </div>
            </div>
            {uploadFile && (
              <div className="flex items-center justify-center gap-2 mt-1">
                <FolderIcon className="w-5 h-5 text-accent" />
                <span className="text-xs text-accent">{uploadFile.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setUploadFile(null);
                    messageApi.open({
                      type: "info",
                      content: "File selection cleared.",
                    });
                  }}
                  className={`text-red-400 text-xs hover:text-red-500 hover:cursor-pointer transition-colors ${isSubmitting ? "pointer-events-none opacity-50" : ""}`}
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || (!url && !uploadFile)}
              className="w-full bg-accent text-black font-semibold rounded-xl py-4 px-6 flex items-center justify-center space-x-2 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer transition-all active:scale-[0.98]"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear",
                  }}
                  className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full"
                />
              ) : (
                <>
                  <ZapIcon className="w-5 h-5" />
                  <span>Analyze Project</span>
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default InputArea;
