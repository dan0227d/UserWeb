import { useState, useEffect } from "react";
import { exportUserPdf } from "../api/apiService";
import "./Report.css";

export default function Report() {

    const [pdfUrl, setPdfUrl] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {

    const loadPdf = async () => {
        try{
          const url = await exportUserPdf(true);

          setPdfUrl(url);
        }catch (error){
          setMessage(error.message);
        }
        
    };

  loadPdf();

  }, []);

  return (
    <div className="reportPage">

        <div className="reportHeader">

            <h2 className="reportTitle">
            使用者報表
            </h2>

            <button
            className="exportPdfButton"
            onClick={() => exportUserPdf(false)}
            >
            下載 PDF
            </button>

        </div>

        {pdfUrl && (
            <iframe
            className="reportFrame"
            src={pdfUrl}
            title="使用者資料報表"
            />
        )}

        <p className="message">{message}</p>

    </div>
  );
}