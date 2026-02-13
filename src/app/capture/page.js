"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./capture.module.css";
import { useRouter } from "next/navigation";

export default function Capture() {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const fileInputRef = useRef(null);
    const router = useRouter();

    // 监听图片变化，一旦图片就位且未分析过，立即启动自动分析
    useEffect(() => {
        if (image && !result && !loading) {
            analyzeImage();
        }
    }, [image]);

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
            alert("智能分析失败，请稍后重试或更换图片");
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
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backBtn} onClick={() => router.back()}>✕</button>
                <span className={styles.title}>发布穿搭</span>
                <button 
                    className={styles.postBtn} 
                    onClick={saveOutfit} 
                    disabled={!result || loading}
                >
                    发布
                </button>
            </header>

            <div className={styles.content}>
                <div className={styles.mediaSection}>
                    {!image ? (
                        <div className={styles.uploadPlaceholder} onClick={() => fileInputRef.current.click()}>
                            <div className={styles.addIcon}>＋</div>
                            <p>添加穿搭照片</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                        </div>
                    ) : (
                        <div className={styles.previewBox}>
                            <img src={image} className={styles.preview} alt="Preview" />
                            {loading && (
                                <div className={styles.loadingOverlay}>
                                    <div className={styles.spinner}></div>
                                    <span>管家正在识图...</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className={styles.formSection}>
                    <div className={styles.field}>
                        <input 
                            className={styles.categoryInput}
                            placeholder="填写穿搭分类 (如：法式复古)"
                            value={result?.category || ""} 
                            onChange={(e) => setResult({ ...result, category: e.target.value })} 
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.field}>
                        <textarea 
                            className={styles.descriptionText}
                            placeholder="添加描述..."
                            value={result?.description || ""} 
                            onChange={(e) => setResult({ ...result, description: e.target.value })} 
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.tagSection}>
                        <div className={styles.tagIcon}>🏷️</div>
                        <div className={styles.tagsContainer}>
                            {result?.tags?.map((tag, i) => (
                                <span key={i} className={styles.tagItem}>#{tag}</span>
                            )) || (loading ? "正在生成标签..." : "自动生成穿搭标签")}
                        </div>
                    </div>

                    <div className={styles.suggestionBox}>
                        <p className={styles.label}>管家穿搭建议：</p>
                        <p className={styles.suggestionText}>
                            {loading ? "正在构思建议..." : (result?.suggestion || "上传照片后，管家会为您提供建议")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
