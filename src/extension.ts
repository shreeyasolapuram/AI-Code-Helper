/*import * as vscode from 'vscode';
import ollama from 'ollama'
import axios from 'axios'; // Import axios for HTTP requests

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    console.log('Shreeya AI Extension Activated!');

    // Create an output channel for logging responses
    const outputChannel = vscode.window.createOutputChannel("Shreeya AI");

    // Register command to interact with DeepSeek R1
    const disposable = vscode.commands.registerCommand('shreeya-ai.generateCode', async () => {
        // Prompt user for input
        const userInput = await vscode.window.showInputBox({
            prompt: "Enter a coding question or request for DeepSeek AI",
            placeHolder: "Example: Write a Python function for Fibonacci series"
        });

        if (!userInput) {
            vscode.window.showWarningMessage("No input provided!");
            return;
        }

        // Call DeepSeek R1 model
        outputChannel.appendLine(`User: ${userInput}`);
        outputChannel.appendLine("Processing...");

        try {
            const response = await axios.post("http://localhost:11434/api/generate", {
                model: "deepseek-coder-1.5b", // Adjust based on how it's served
                prompt: userInput,
                max_tokens: 512
            });

            const aiResponse = response.data.text.trim();
            outputChannel.appendLine(`DeepSeek AI: ${aiResponse}`);
            vscode.window.showInformationMessage("DeepSeek AI response generated. Check the output panel!");
        } catch (error) {
            vscode.window.showErrorMessage("Error fetching response from DeepSeek AI.");
            outputChannel.appendLine(`Error: ${error.message}`);
        }
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
    console.log('Shreeya AI Extension Deactivated.');
}*/

/*import * as vscode from 'vscode';
import axios from 'axios';
import ollama from 'ollama';


export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('fireship-ext.start', () => {
        const panel = vscode.window.createWebviewPanel(
            'deepChat',
            'AI Code Helper',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        panel.webview.html = getWebViewContent();

        panel.webview.onDidReceiveMessage(async (message: any) => {
            if (message.command === 'chat') {
                const userPrompt = message.text;
                let responseText = '';
				
                try {
                    // Assuming the Ollama API URL is being used in the axios post request
                    // Assuming the Ollama API URL is being used in the axios post request
                    const response = await axios.post("http://localhost:12345/api/generate", {
                    model: "deepseek-r1:1.5b", // Make sure model is correct as well
                    prompt: userPrompt,
                    max_tokens: 512
                });



                    for await (const part of streamResponse) {
                        responseText += part.message.content;
                        panel.webview.postMessage({ command: 'chatResponse', text: responseText });
                    }
                } catch (err) {
                    panel.webview.postMessage({ command: 'chatResponse', text: `Error: ${String(err)}` });
                }
            }
        });
    });

    context.subscriptions.push(disposable);
}*/

/*import * as vscode from 'vscode';
import axios, { AxiosResponse } from 'axios'; // Correct import
import ollama from 'ollama'; // Assuming you need this for some other part of the project

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('fireship-ext.start', () => {
        const panel = vscode.window.createWebviewPanel(
            'deepChat',
            'AI Code Helper',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        panel.webview.html = getWebViewContent(); // Assuming you have this function

        panel.webview.onDidReceiveMessage(async (message: any) => {
            if (message.command === 'chat') {
                const userPrompt = message.text;
                let responseText = '';

                try {
                    // Send the request to get the stream response
                    const streamResponse: AxiosResponse = await axios.post('http://localhost:11434/api/generate', {
                        model: "deepseek-r1:1.5b",
                        prompt: userPrompt,
                        max_tokens: 512,
                        responseType: 'stream'  // Make sure to set responseType to stream
                    });

                    // Iterate over the stream response
                    for await (const part of streamResponse.data) {
                        // Assuming part is a chunk of string, append to responseText
                        responseText += part.toString(); // Convert part to string if it's binary

                        // Send the updated response to the webview
                        panel.webview.postMessage({ command: 'chatResponse', text: responseText });
                    }
                } catch (err) {
                    // If there's an error, send it to the webview
                    panel.webview.postMessage({ command: 'chatResponse', text: `Error: ${String(err)}` });
                }
            }
        });
    });

    context.subscriptions.push(disposable);
}
*/
import * as vscode from 'vscode';
import axios from 'axios';
import { Readable } from 'stream'; // Import Readable for stream handling

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('fireship-ext.start', () => {
        const panel = vscode.window.createWebviewPanel(
            'deepChat',
            'AI Code Helper',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        panel.webview.html = getWebViewContent(); // Assuming you have this function

        panel.webview.onDidReceiveMessage(async (message: any) => {
            if (message.command === 'chat') {
                const userPrompt = message.text;
                let responseText = '';

                try {
                    // Send the request with responseType 'stream'
                    const streamResponse = await axios({
                        method: 'post',
                        url: 'http://localhost:11434/api/generate',
                        data: {
                            model: "deepseek-r1:1.5b",
                            prompt: userPrompt,
                            max_tokens: 512
                        },
                        responseType: 'stream' // Important for handling streaming responses
                    });

                    // Read the response as a stream
                    const reader = streamResponse.data as Readable;
                    reader.on('data', (chunk: Buffer) => {
                        const chunkStr = chunk.toString();

                        try {
                            // Parse the JSON chunk
                            const jsonChunk = JSON.parse(chunkStr);

                            // Ensure it has a response field
                            if (jsonChunk.response) {
                                const textPart = jsonChunk.response;

                                // Ignore <think> tags
                                if (textPart.includes('<think>')) return;

                                responseText += textPart;

                                // Send the response incrementally to the webview
                                panel.webview.postMessage({ command: 'chatResponse', text: responseText });
                            }
                        } catch (error) {
                            console.error('Error parsing JSON chunk:', error);
                        }
                    });

                    // Handle stream completion
                    reader.on('end', () => {
                        panel.webview.postMessage({ command: 'chatResponse', text: responseText });
                    });

                } catch (err) {
                    console.error('Error:', err);
                    panel.webview.postMessage({ command: 'chatResponse', text: `Error: ${String(err)}` });
                }
            }
        });
    });

    context.subscriptions.push(disposable);
}

function getWebViewContent(): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: sans-serif; margin: 1rem; }
            #prompt { width: 100%; box-sizing: border-box; }
            #response { border: 1px solid #ccc; margin-top: 1rem; padding: 0.5rem; }
        </style>
    </head>
    <body>
        <h2>AI Code Helper VS Code Extension</h2>
        <textarea id="prompt" rows="3" placeholder="Ask Something"></textarea><br/>
        <button id="askBtn">Ask</button>
        <div id="response"></div>
        <script>
            const vscode = acquireVsCodeApi();
            document.getElementById('askBtn').addEventListener('click', () => {
                const text = document.getElementById('prompt').value;
                vscode.postMessage({ command: 'chat', text });
            });

            window.addEventListener('message', event => {
                const { command, text } = event.data;
                if (command === 'chatResponse') {
                    document.getElementById('response').innerText = text;
                }
            });
        </script>
    </body>
    </html>`;
}



