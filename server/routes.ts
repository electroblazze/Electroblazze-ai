import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from 'openai';
import { Message } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create OpenAI instance with NVIDIA API configuration
  const openai = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY || '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',
    baseURL: 'https://integrate.api.nvidia.com/v1',
  });

  // Chat API endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, settings } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: "Invalid request: messages must be an array" });
      }

      // Validate settings
      const temperature = settings?.temperature ?? 0.6;
      const top_p = settings?.top_p ?? 0.95;
      const max_tokens = settings?.max_tokens ?? 4096;
      const frequency_penalty = settings?.frequency_penalty ?? 0;
      const presence_penalty = settings?.presence_penalty ?? 0;

      // Setup response as a stream
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Transfer-Encoding', 'chunked');

      // Call NVIDIA API with streaming
      const completion = await openai.chat.completions.create({
        model: "nvidia/llama-3.1-nemotron-ultra-253b-v1",
        messages: messages,
        temperature,
        top_p,
        max_tokens,
        frequency_penalty,
        presence_penalty,
        stream: true,
      });

      // Stream the response
      for await (const chunk of completion) {
        if (chunk.choices[0]?.delta?.content) {
          res.write(chunk.choices[0].delta.content);
        }
      }

      // End the response
      res.end();
    } catch (error) {
      console.error('Error with AI chat request:', error);
      
      // If headers have not been sent yet, send error response
      if (!res.headersSent) {
        res.status(500).json({ 
          message: error instanceof Error ? error.message : "Error communicating with AI service" 
        });
      } else {
        // If headers already sent, just end the response
        res.end();
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
