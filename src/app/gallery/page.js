"use client";
import { useState, useEffect } from "react";
import styles from "./gallery.module.css";

export default function Gallery() {
  const [outfits, setOutfits] = useState([]);
  const [filter, setFilter] = useState("全部");

  useEffect(() => {
    const saved = localStorage.getItem("outfits");
    if (saved) setOutfits(JSON.parse(saved).reverse());
  }, []);

  const categories = ["全部", ...new Set(outfits.map(o => o.category))];
  
  const filteredOutfits = filter === "全部" 
    ? outfits 
    : outfits.filter(o => o.category === filter);

  const deleteOutfit = (id) => {
    if (confirm("确定要删除这件穿搭吗？")) {
      const updated = outfits.filter(o => o.id !== id);
      setOutfits(updated);
      localStorage.setItem("outfits", JSON.stringify(updated));
    }
  };

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>我的衣橱</h1>
        <p style={{ color: 'var(--text-muted)' }}>共记录了 {outfits.length} 套穿搭</p>
      </header>

      <div className={styles.filterBar}>
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`${styles.filterBtn} ${filter === cat ? styles.active : ""}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.galleryGrid}>
        {filteredOutfits.map((item) => (
          <div key={item.id} className={`${styles.outfitCard} premium-card`}>
            <div 
              className={styles.imageBox} 
              style={{ backgroundImage: `url(${item.image})` }}
            />
            <div className={styles.cardContent}>
              <div className={styles.tagRow}>
                {item.tags?.slice(0, 3).map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
              <h3 className={styles.category}>{item.category}</h3>
              <p className={styles.description}>{item.description}</p>
              <div className={styles.footer}>
                <span className={styles.date}>{new Date(item.date).toLocaleDateString()}</span>
                <button className={styles.deleteBtn} onClick={() => deleteOutfit(item.id)}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOutfits.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#999' }}>
          暂时没有相关穿搭记录
        </div>
      )}
    </div>
  );
}
