"use client";
import { useState, useEffect } from "react";
import styles from "./settings.module.css";

export default function Settings() {
  const [rules, setRules] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedRules = localStorage.getItem("ai_rules");
    if (savedRules) setRules(savedRules);
  }, []);

  const handleSave = () => {
    localStorage.setItem("ai_rules", rules);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>AI 设置</h1>
        <p style={{ color: 'var(--text-muted)' }}>定义您的穿搭助手语气与风格</p>
      </header>

      <div className="premium-card">
        <label className={styles.label}>生成规则 (Prompt Rules)</label>
        <p className={styles.description}>
          在这里输入您希望 AI 遵循的规则。例如：“语气要温柔”、“标注材质信息”、“分类要包含季节”等。
        </p>
        <textarea
          className={styles.textarea}
          value={rules}
          onChange={(e) => setRules(e.target.value)}
          placeholder="例如：请用赞美的语气描述我的每一套衣服，并且一定要提到颜色搭配的亮点..."
        />
        
        <button className={styles.saveBtn} onClick={handleSave}>
          {saved ? "已保存 ✨" : "保存设置"}
        </button>
      </div>

      <div className={styles.help}>
        <h3>默认规则：</h3>
        <ul>
          <li>提供具体的衣物描述（颜色、剪裁、纹理）</li>
          <li>自动识别 3-5 个分类标签</li>
          <li>建议适合的场合（如：通勤、约会、居家）</li>
        </ul>
      </div>
    </div>
  );
}
