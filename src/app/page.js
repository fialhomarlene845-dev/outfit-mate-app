"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [outfits, setOutfits] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("outfits");
    if (saved) {
      setOutfits(JSON.parse(saved).slice(-4).reverse()); // 仅展示最近4件
    }
  }, []);

  return (
    <div className="fade-in">
      <header className={styles.header}>
        <h1 className={styles.greeting}>早安，<span className={styles.username}>女主人</span> ✨</h1>
        <p className={styles.subtitle}>今天也想怎么搭配呢？</p>
      </header>

      <section className={styles.quickActions}>
        <a href="/capture" className={styles.actionCard}>
          <div className={styles.actionIcon}>➕</div>
          <div className={styles.actionLabel}>记录新搭配</div>
        </a>
        <a href="/settings" className={styles.actionCardSecondary}>
          <div className={styles.actionIcon}>🪄</div>
          <div className={styles.actionLabel}>定制 AI 规则</div>
        </a>
      </section>

      <section className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2>最近记录</h2>
          <a href="/gallery" className={styles.viewMore}>查看全部</a>
        </div>
        
        {outfits.length > 0 ? (
          <div className={styles.recentGrid}>
            {outfits.map((item, index) => (
              <div key={item.id || index} className="premium-card" style={{ padding: '8px', marginBottom: '16px' }}>
                <div 
                  className={styles.imagePlaceholder} 
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className={styles.itemMeta}>
                  <p className={styles.itemTitle}>{item.category || "未分类"}</p>
                  <p className={styles.itemDate}>{new Date(item.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>还没有记录哦，快去拍照吧！</p>
          </div>
        )}
      </section>
    </div>
  );
}
