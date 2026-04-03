import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { Document } from 'langchain/document';
import { BotDocument } from '../../models/Document';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const embeddings = new OpenAIEmbeddings({
  modelName: 'text-embedding-3-small',
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

/**
 * Ingest a PDF file into the vector store for a specific bot
 */
export async function ingestPDF(botId: string, filePath: string, metadata: Record<string, string>) {
  const loader = new PDFLoader(filePath);
  const rawDocs = await loader.load();

  const docs = await splitter.splitDocuments(rawDocs);
  const taggedDocs = docs.map((doc) => ({
    ...doc,
    metadata: {
      ...doc.metadata,
      ...metadata,
      botId,
      source: 'pdf',
    },
  }));

  await storeEmbeddings(botId, taggedDocs);
  return taggedDocs.length;
}

/**
 * Ingest a URL (scrape and embed) into the vector store
 */
export async function ingestURL(botId: string, url: string) {
  const loader = new CheerioWebBaseLoader(url, {
    selector: 'p, h1, h2, h3, article, main',
  });
  const rawDocs = await loader.load();

  const docs = await splitter.splitDocuments(rawDocs);
  const taggedDocs = docs.map((doc) => ({
    ...doc,
    metadata: {
      ...doc.metadata,
      botId,
      source: 'url',
      url,
    },
  }));

  await storeEmbeddings(botId, taggedDocs);
  return taggedDocs.length;
}

/**
 * Ingest raw text into the vector store
 */
export async function ingestText(botId: string, text: string, sourceName: string) {
  const chunks = await splitter.splitText(text);
  const docs: Document[] = chunks.map((chunk) => ({
    pageContent: chunk,
    metadata: { botId, source: 'text', sourceName },
  }));

  await storeEmbeddings(botId, docs);
  return docs.length;
}

async function storeEmbeddings(botId: string, docs: Document[]) {
  const index = pinecone.Index(process.env.PINECONE_INDEX!);

  await PineconeStore.fromDocuments(docs, embeddings, {
    pineconeIndex: index,
    namespace: botId, // Each bot gets its own namespace
    maxConcurrency: 5,
  });
}

/**
 * Delete all embeddings for a bot (when bot is deleted or document is removed)
 */
export async function deleteNamespace(botId: string) {
  const index = pinecone.Index(process.env.PINECONE_INDEX!);
  await index.namespace(botId).deleteAll();
}
