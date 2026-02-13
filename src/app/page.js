"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [outfits, setOutfits] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("outfits");
    if (saved) {
      setOutfits(JSON.parse(saved).reverse());
    }
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.tabContainer}>
          <span className={`${styles.tab} ${styles.activeTab}`}>推荐</span>
          <span className={styles.tab}>关注</span>
        </div>
      </header>

      <main className={styles.waterfallGrid}>
        {outfits.length > 0 ? (
          outfits.map((item) => (
            <div key={item.id} className={styles.noteCard}>
              <div 
                className={styles.noteCover} 
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className={styles.noteContent}>
                <h3 className={styles.noteTitle}>{item.category}</h3>
                <div className={styles.noteFooter}>
                  <div className={styles.userInfo}>
                    <div className={styles.avatar}>🎀</div>
                    <span className={styles.userName}>女主人</span>
                  </div>
                  <div className={styles.likes}>
                    <span>❤️</span>
                    <span className={styles.likeCount}>{Math.floor(Math.random() * 100)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📷</div>
            <p>点击下方 “＋” 记录第一套穿搭</p>
          </div>
        )}
      </main>
    </div>
  );
}
