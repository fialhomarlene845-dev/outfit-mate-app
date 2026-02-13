"use client";
import { useState, useRef } from "react";
import styles from "./capture.module.css";
import { useRouter } from "next/navigation";

export default function Capture() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    
    const customRules = localStorage.getItem("ai_rules") || "";
    
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ image, customRules }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("分析失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const saveOutfit = () => {
    const saved = JSON.parse(localStorage.getItem("outfits") || "[]");
    const newOutfit = {
      id: Date.now(),
      image,
      ...result,
      date: new Date().toISOString(),
    };
    localStorage.setItem("outfits", JSON.stringify([...saved, newOutfit]));
    router.push("/");
  };

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800' }}>捕捉灵感</h1>
      </header>

      <div className={styles.captureContainer}>
        {!image ? (
          <div className={styles.uploadBox} onClick={() => fileInputRef.current.click()}>
            <div className={styles.uploadIcon}>📸</div>
            <p>挑选照片或即刻拍摄</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              style={{ display: 'none' }} 
            />
          </div>
        ) : (
          <div className={styles.previewContainer}>
            <img src={image} className={styles.preview} alt="Preview" />
            <button className={styles.retakeBtn} onClick={() => setImage(null)}>重拍</button>
            
            {!result && (
              <button 
                className={styles.analyzeBtn} 
                onClick={analyzeImage}
                disabled={loading}
              >
                {loading ? "AI 正在思考中..." : "✨ 智能分析"}
              </button>
            )}
          </div>
        )}
      </div>

      {result && (
        <div className={`${styles.resultCard} premium-card fade-in`}>
          <div className={styles.resultGroup}>
            <label>分类</label>
            <input 
              value={result.category} 
              onChange={(e) => setResult({...result, category: e.target.value})} 
            />
          </div>

          <div className={styles.resultGroup}>
            <label>描述</label>
            <textarea 
              value={result.description} 
              onChange={(e) => setResult({...result, description: e.target.value})} 
            />
          </div>

          <div className={styles.resultGroup}>
            <label>标签 (逗号分隔)</label>
            <input 
              value={result.tags?.join(", ")} 
              onChange={(e) => setResult({...result, tags: e.target.value.split(",").map(t => t.trim())})} 
            />
          </div>

          <div className={styles.resultGroup}>
            <label>穿着建议</label>
            <input 
              value={result.suggestion} 
              onChange={(e) => setResult({...result, suggestion: e.target.value})} 
            />
          </div>

          <button className={styles.saveBtn} onClick={saveOutfit}>保存到衣橱</button>
        </div>
      )}
    </div>
  );
}
