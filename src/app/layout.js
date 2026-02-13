import "./globals.css";

export const metadata = {
  title: "Outfit Mate | 每一刻都精致",
  description: "AI 驱动的个人穿搭管理助手",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0", 
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body>
        <main className="main-content">
          {children}
        </main>
        
        <nav className="bottom-nav glass">
          <a href="/" className="nav-item active">
            <span className="nav-icon">🏠</span>
            <span>首页</span>
          </a>
          <a href="/capture" className="nav-item">
            <span className="nav-icon">📸</span>
            <span>拍照</span>
          </a>
          <a href="/gallery" className="nav-item">
            <span className="nav-icon">👗</span>
            <span>衣橱</span>
          </a>
          <a href="/settings" className="nav-item">
            <span className="nav-icon">⚙️</span>
            <span>设置</span>
          </a>
        </nav>
      </body>
    </html>
  );
}
