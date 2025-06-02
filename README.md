AI-Powered Coding Assistant for VS Code
This VS Code extension is designed to assist developers by providing detailed code explanations directly inside VS Code without requiring an internet connection. It integrates a locally running AI model to make AI-powered coding help fast, accessible, and seamless within your development workflow.

Features
AI-based code explanation: Generate detailed explanations of any code snippet or programming question inside VS Code.

Offline usage: Uses local AI models (Ollama API) so no internet connection is required.

Interactive UI: Uses VS Code’s WebView API for a rich, chat-like interface.

Future enhancements planned:

Real-time error detection and explanations

Automatic error fixing with one-click apply

Intelligent code autocompletion to speed up coding

How It Works
The extension activates in VS Code and opens a WebView panel.

Users input code snippets or questions in the WebView chat interface.

The input is sent to the Ollama API — a local AI model runner — using Axios HTTP requests.

Ollama processes the input and returns detailed explanations or code snippets.

The extension displays the AI’s response directly inside VS Code.

Technologies Used
VS Code API and TypeScript for extension development

WebView API for interactive user interface inside VS Code

Ollama API to run AI models locally without internet

Axios for HTTP requests to the Ollama API

About the AI Model
Currently, the extension uses DeepSeek R1: 1.5B — an AI model with 1.5 billion parameters.

Larger models (like 7B or more) can provide more accurate and efficient responses but require significantly more RAM and computing resources.

Future Roadmap
Error Detection and Explanation: Detect syntax and logical errors in code and provide clear explanations.

Automatic Error Fixing: Offer one-click solutions to fix detected errors directly in the editor.

AI-Powered Code Autocompletion: Suggest context-aware code completions to speed up coding, similar to GitHub Copilot.

How to Install and Use
Download the extension .vsix file or install it from the VS Code marketplace (once published).

Ensure the Ollama API is installed and running locally on your system.

Open the extension’s WebView panel via the command palette.

Enter your code or questions and get instant AI-powered explanations.

