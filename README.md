# AI Text Replacer
## 🚀 Project Demo

Here’s a quick video showing how the app works in real time:

[![Watch the demo](https://img.youtube.com/vi/jYfzrdmONnA/0.jpg)](https://youtu.be/jYfzrdmONnA)


A minimalist Electron-based desktop application that provides AI-powered text replacement using Google's Gemini API. The app features a sleek, always-on-top floating window with seamless clipboard integration and intelligent window management.

## Features

- **AI-Powered Text Processing**: Uses Google's Gemini 2 Flash model for intelligent text transformation
- **Floating Window Interface**: Always-on-top, frameless window with native OS blur effects
- **Smart Clipboard Integration**: Automatically handles text selection and replacement
- **Intelligent Window Management**: Tracks window focus history and seamlessly switches between applications
- **Theme Support**: Light and dark themes with smooth transitions
- **Cross-Platform**: Works on Linux, Windows, and macOS
- **Minimalist Design**: Clean, non-intrusive UI that expands when needed

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key
- Linux: `xdotool` package for window management
- Windows: No additional dependencies
- macOS: No additional dependencies

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-text-replacer
```

2. Install dependencies:
```bash
npm install
```

3. Configure your API key:
   - Open `main.js`
   - Replace `xxxxxxxxxxxxxxxxxxxxxxxxxxx` with your actual Google Gemini API key
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. Install system dependencies (Linux only):
```bash
# Ubuntu/Debian
sudo apt-get install xdotool

# Fedora/RHEL
sudo dnf install xdotool

# Arch Linux
sudo pacman -S xdotool
```

## Usage

1. Start the application:
```bash
npm start
```

2. The app will appear as a small floating window that stays on top of other applications

3. Click the floating button to expand the input field

4. Type your text transformation request (e.g., "Make this more professional", "Fix grammar", "Summarize this")

5. Press Enter or click the process button

6. The AI will process your text and automatically paste the result into the previously focused window

## How It Works

1. **Text Selection**: The app can read selected text from the clipboard
2. **AI Processing**: Sends the text to Google's Gemini API for transformation
3. **Window Management**: Tracks which windows you've been using
4. **Automatic Pasting**: Returns focus to the previous window and pastes the processed text

## API Integration

The application uses Google's Gemini 2 Flash model via the Generative Language API. The API endpoint is:
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2-flash:generateContent
```

## Building

To build the application for distribution:

```bash
npm run build
```

This will create platform-specific installers in the `dist/` directory:
- Linux: AppImage
- Windows: NSIS installer
- macOS: DMG

## Project Structure

```
ai-text-replacer/
├── main.js          # Main Electron process
├── preload.js       # Preload script for secure IPC
├── index.html       # Frontend UI and logic
├── package.json     # Dependencies and build configuration
└── README.md        # This file
```

## Technical Details

### Architecture
- **Main Process**: Handles window creation, API calls, and system integration
- **Renderer Process**: Manages the UI and user interactions
- **Preload Script**: Secure bridge between main and renderer processes

### Key Technologies
- **Electron**: Cross-platform desktop app framework
- **Google Gemini API**: AI text processing
- **xdotool**: Linux window management (Linux only)
- **Native OS APIs**: Clipboard and window management

### Security Features
- Context isolation enabled
- Preload script for secure IPC communication
- API key stored in main process only

## Configuration

### Window Settings
- Size: 500x100 pixels (expandable)
- Always on top: Enabled
- Frame: Disabled (frameless)
- Transparency: Enabled with blur effects

### API Configuration
- Model: Gemini 2 Flash
- Endpoint: Google Generative Language API
- Rate limiting: Handled by Google's API

## Troubleshooting

### Common Issues

1. **API Key Error**: Ensure your Google Gemini API key is correctly set in `main.js`
2. **Window Management Issues (Linux)**: Make sure `xdotool` is installed and accessible
3. **Clipboard Issues**: Check that the app has clipboard permissions
4. **Theme Not Switching**: Clear browser cache or restart the application

### Debug Mode

Run with debug logging:
```bash
npm start -- --enable-logging
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on your platform
5. Submit a pull request
---

**Note**: This application requires an active internet connection to function as it uses Google's cloud-based Gemini API for text processing.

