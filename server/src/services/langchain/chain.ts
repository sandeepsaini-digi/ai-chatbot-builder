import { ChatOpenAI } from '@langchain/openai';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';
import { PromptTemplate } from '@langchain/core/prompts';
import { IBot } from '../../models/Bot';

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const embeddings = new OpenAIEmbeddings({ modelName: 'text-embedding-3-small' });

// Cache chains per session to maintain conversation memory
const chainCache = new Map<string, ConversationalRetrievalQAChain>();

export async function getOrCreateChain(botId: string, sessionId: string, bot: IBot) {
  const cacheKey = `${botId}:${sessionId}`;

  if (chainCache.has(cacheKey)) {
    return chainCache.get(cacheKey)!;
  }

  const index = pinecone.Index(process.env.PINECONE_INDEX!);
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
    namespace: botId,
  });

  const llm = new ChatOpenAI({
    modelName: bot.model ?? 'gpt-4o-mini',
    temperature: bot.temperature ?? 0.3,
    openAIApiKey: process.env.OPENAI_API_KEY,
    streaming: true,
  });

  const systemPrompt = bot.systemPrompt ?? `You are a helpful assistant.
Answer questions using only the provided context.
If you don't know the answer, say "I don't have information about that.
Would you like me to connect you with a human agent?"
Never make up information that isn't in the context.`;

  const qaPrompt = PromptTemplate.fromTemplate(`
${systemPrompt}

Context from knowledge base:
{context}

Chat History:
{chat_history}