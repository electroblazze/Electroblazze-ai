export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ModelSettings {
  temperature: number;
  top_p: number;
  max_tokens: number;
  frequency_penalty: number;
  presence_penalty: number;
}
