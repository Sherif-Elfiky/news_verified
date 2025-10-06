import Providers from './components/Providers'

export const metadata = {
  title: 'News Verified',
  description: 'AI-powered news verification',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <style>{`
          * {
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            min-height: 100vh;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          
          .header {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
            font-size: 32px;
          }
          
          .input-section {
            margin-bottom: 20px;
          }
          
          .label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: #555;
          }
          
          .input {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
            box-sizing: border-box;
          }
          
          .button {
            width: 100%;
            padding: 12px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            margin-bottom: 20px;
          }
          
          .button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
          }
          
          .error {
            background-color: #f8d7da;
            color: #721c24;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 20px;
            border: 1px solid #f5c6cb;
          }
          
          .result-card {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 4px;
            margin-bottom: 20px;
            border: 1px solid #dee2e6;
          }
          
          .result-title {
            color: #333;
            margin-bottom: 15px;
            font-size: 20px;
          }
          
          .result-text {
            color: #555;
            line-height: 1.6;
          }
          
          .classification-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 14px;
          }
          
          .neutral {
            background-color: #d4edda;
            color: #155724;
          }
          
          .biased {
            background-color: #fff3cd;
            color: #856404;
          }
          
          .propaganda {
            background-color: #f8d7da;
            color: #721c24;
          }
          
          .scores-list {
            margin-top: 10px;
            padding-left: 20px;
          }
          
          .scores-list li {
            margin-bottom: 5px;
            color: #555;
          }
        `}</style>
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
