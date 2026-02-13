"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [outfits, setOutfits] = useState([]);
  const [filter, setFilter] = useState("全部");
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("outfits");
    if (saved) {
      setOutfits(JSON.parse(saved).reverse());
    }
  }, []);

  const categories = ["全部", ...new Set(outfits.map(o => o.category))];

  const filteredOutfits = filter === "全部"
    ? outfits
    : outfits.filter(o => o.category === filter);

  const handleDelete = (id) => {
    if (confirm("确定要移出衣橱吗？")) {
      const updated = outfits.filter(o => o.id !== id);
      setOutfits(updated);
      // Store back in original chronological order (reverse of display)
      localStorage.setItem("outfits", JSON.stringify(updated.slice().reverse())); 
      if (editingItem?.id === id) setEditingItem(null);
    }
  };

  const handleUpdate = (updatedItem) => {
    const updatedOutfits = outfits.map(o => o.id === updatedItem.id ? updatedItem : o);
    setOutfits(updatedOutfits);
    // Store back in original chronological order
    localStorage.setItem("outfits", JSON.stringify(updatedOutfits.slice().reverse()));
    setEditingItem(null);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>我的时尚库</h1>
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
      </header>

      <main className={styles.waterfallGrid}>
        {filteredOutfits.map((item) => (
          <div key={item.id} className={styles.noteCard} onClick={() => setEditingItem(item)}>
            <div 
              className={styles.noteCover} 
              style={{ backgroundImage: `url(${item.image})` }}
            />
            <div className={styles.noteContent}>
              <h3 className={styles.noteTitle}>{item.category}</h3>
              <div className={styles.noteFooter}>
                <div className={styles.tagRow}>
                   {item.tags?.slice(0, 2).map(tag => (
                      <span key={tag} className={styles.tag}>#{tag}</span>
                   ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>

       {filteredOutfits.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📷</div>
            <p>点击下方 “＋” 记录第一套穿搭</p>
          </div>
        )}

      {/* Edit Modal */}
      {editingItem && (
        <div className={styles.modalOverlay} onClick={() => setEditingItem(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div 
              className={styles.modalImage}
              style={{ backgroundImage: `url(${editingItem.image})` }}
            />
            <div className={styles.modalForm}>
              <button className={styles.closeBtn} onClick={() => setEditingItem(null)}>✕</button>
              
              <div className={styles.formGroup}>
                <label>分类 / Category</label>
                <input 
                  value={editingItem.category} 
                  onChange={e => setEditingItem({...editingItem, category: e.target.value})}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>描述 / Description</label>
                <textarea 
                  value={editingItem.description} 
                  onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroup}>
                <label>标签 / Tags</label>
                <input 
                  value={editingItem.tags?.join(", ")} 
                  onChange={e => setEditingItem({...editingItem, tags: e.target.value.split(",").map(t=>t.trim())})}
                  className={styles.input}
                />
              </div>

              <div className={styles.modalActions}>
                <button className={styles.deleteAction} onClick={() => handleDelete(editingItem.id)}>删除</button>
                <button className={styles.saveAction} onClick={() => handleUpdate(editingItem)}>保存修改</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
