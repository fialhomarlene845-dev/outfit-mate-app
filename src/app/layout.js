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
        
        <nav className="bottom-nav">
          <a href="/" className="nav-item active">
            <span>首页</span>
          </a>
          <a href="/capture" className="nav-item">
            <div className="capture-btn">＋</div>
          </a>
          <a href="/gallery" className="nav-item">
            <span>衣橱</span>
          </a>
        </nav>
      </body>
    </html>
  );
}
