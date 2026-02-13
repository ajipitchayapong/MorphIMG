# MorphIMG - Privacy-First Image Converter

MorphIMG is a free, open-source, and privacy-focused image converter that works 100% in your browser. No server uploads, no file size limits, and no subscriptions.

![MorphIMG Logo](/public/favicon.svg)

## 🚀 Key Features

- **100% Local Processing**: All conversions happen on your device using WebAssembly. Your images never leave your computer.
- **Wide Format Support**: Convert between HEIC, AVIF, JXL, PNG, JPG, WEBP, and more.
- **Privacy-First**: No tracking, no data collection, and strictly local processing.
- **No Limits**: Unlimited file size and unlimited conversions.
- **Modern UI**: Clean, responsive design with dark mode support.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS, Shadcn UI
- **Processing**: WebAssembly (for HEIC, AVIF, and image processing)
- **State Management**: Zustand
- **Deployment**: Vercel

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/MorphIMG.git
   cd MorphIMG
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env.local` and fill in the required values:

   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💖 Support

If you find this tool useful, consider supporting the developer:
[Buy me a coffee](https://ko-fi.com/ajioh)
