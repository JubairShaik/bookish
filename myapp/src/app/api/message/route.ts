import { chatbotPrompt } from '@/helpers/constants/chatbot-prompt'
import { ChatGPTMessage,
  OpenAIStream,
  OpenAIStreamPayload,
} from '@/lib/openai-stream'


import { MessageArraySchema } from '@/lib/validators/message'


export async function POST(req: Request) {
  const { messages } = await req.json()

  const parsedMessages = MessageArraySchema.parse(messages)


  // we sent this messages to CHAT GPT 

  const outboundMessages: ChatGPTMessage[] = parsedMessages.map((message) => {
    return {
      role: message.isUserMessage ? 'user' : 'system',
      content: message.text,
      // Content Means the Message we Pass Through the Frontend
    }
  })

  {/*
   Its Like a Array : push(adds Element at the Last to the Array)
                      unshift(adds Element at Start to the Array)
 */}

 //User Input //
  outboundMessages.unshift({
    role: 'system',
    content: chatbotPrompt,
  })

  const payload: OpenAIStreamPayload = {
    model: 'gpt-3.5-turbo',     //version of GPT
    messages: outboundMessages, //Message from the FrontEnd (Line No 19)
    temperature: 0.4,
    top_p: 1,
    frequency_penalty: 0,  //------> How Often a Certain Word Occurs
    presence_penalty: 0,       // if Words are Presnt in the Prompt 
                              // the Higher the Presense Penlity the // Lesser the GPT considers those Words inside the Prompt
    max_tokens: 150,        
    stream: true,
    n: 1,
  }

  const stream = await OpenAIStream(payload)

  return new Response(stream)
}
