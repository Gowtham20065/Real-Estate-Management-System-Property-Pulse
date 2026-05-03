const { ChatOpenAI } = require('@langchain/openai');
const { AgentExecutor, createOpenAIFunctionsAgent } = require('langchain/agents');
const { ChatPromptTemplate, MessagesPlaceholder } = require('@langchain/core/prompts');
const tools = require('./tools');
const Property = require('../models/Property');

const SYSTEM_PROMPT = `You are a helpful real estate assistant for an Indian property platform.
Your job is to understand what the user is looking for and use the available tools to find the best matching properties.

Guidelines:
- Always extract: location (city/area), budget (in lakhs), property type (apartment/villa/plot), BHK count, and special requirements (metro nearby, amenities).
- If the user mentions a price range like "under 40 lakhs", set maxPrice=40.
- For BHK, treat "2BHK" or "2 bedroom" as bhk=2.
- After fetching results, summarize what you found in a friendly, concise way.
- If no results match, suggest relaxing one constraint (e.g., slightly higher budget or nearby area).`;

let agentExecutor = null;

async function getAgentExecutor() {
  if (agentExecutor) return agentExecutor;

  const llm = new ChatOpenAI({
    modelName: 'gpt-4o',
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', SYSTEM_PROMPT],
    new MessagesPlaceholder('chat_history'),
    ['human', '{input}'],
    new MessagesPlaceholder('agent_scratchpad'),
  ]);

  const agent = await createOpenAIFunctionsAgent({ llm, tools, prompt });
  agentExecutor = new AgentExecutor({ agent, tools, verbose: false });
  return agentExecutor;
}

async function runAgent(userMessage, chatHistory = []) {
  const executor = await getAgentExecutor();
  try {
    const result = await executor.invoke({
      input: userMessage,
      chat_history: chatHistory,
    });
    return result.output;
  } catch (err) {
    if (isOpenAIQuotaError(err)) {
      return runFallbackSearch(userMessage);
    }
    throw err;
  }
}

function isOpenAIQuotaError(err) {
  const message = String(err?.message || err || '').toLowerCase();
  return message.includes('429') || message.includes('quota') || message.includes('rate limit');
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseFallbackQuery(message) {
  const text = message.toLowerCase();
  const filter = { available: true };

  const city = ['hyderabad', 'bangalore', 'bengaluru', 'pune'].find(name => text.includes(name));
  if (city) filter['location.city'] = new RegExp(escapeRegex(city === 'bengaluru' ? 'bangalore' : city), 'i');

  const areaMap = ['hitech city', 'jubilee hills', 'kukatpally', 'whitefield', 'koramangala', 'indiranagar', 'wakad', 'baner'];
  const area = areaMap.find(name => text.includes(name));
  if (area) filter['location.area'] = new RegExp(escapeRegex(area), 'i');

  const bhk = text.match(/(\d+)\s*(bhk|bed|bedroom)/);
  if (bhk) filter.bhk = Number(bhk[1]);

  const type = ['apartment', 'villa', 'plot', 'commercial'].find(name => text.includes(name));
  if (type) filter.type = type;

  const budget = text.match(/(?:under|below|less than|upto|up to)\s*(?:rs\.?|inr|₹)?\s*(\d+(?:\.\d+)?)\s*(crore|cr|lakh|lakhs|l)?/);
  if (budget) {
    const amount = Number(budget[1]);
    const unit = budget[2] || 'lakh';
    filter.price = { $lte: unit.startsWith('cr') || unit.startsWith('crore') ? amount * 100 : amount };
  }

  if (text.includes('metro')) filter['location.nearMetro'] = true;

  return filter;
}

async function runFallbackSearch(message) {
  const filter = parseFallbackQuery(message);
  const properties = await Property.find(filter).sort({ price: 1 }).limit(5);

  if (!properties.length) {
    return 'I could not reach the OpenAI agent because the API key has no quota, and I did not find matching properties with the local fallback search. Try relaxing the city, budget, BHK, or metro requirement.';
  }

  const listings = properties.map((property, index) => {
    const location = [property.location?.area, property.location?.city].filter(Boolean).join(', ');
    const details = [
      property.bhk ? `${property.bhk}BHK` : null,
      property.type,
      property.area?.size ? `${property.area.size} sqft` : null,
      property.location?.nearMetro ? 'near metro' : null,
    ].filter(Boolean).join(', ');

    return `${index + 1}. ${property.title} - ₹${property.price}L in ${location} (${details})`;
  }).join('\n');

  return `OpenAI quota is currently unavailable, so I used the local property search fallback.\n\nHere are the best matches:\n${listings}`;
}

module.exports = { runAgent };
