'use client' //this
import { MessagesContext } from '@/context/messages'
import { cn } from '@/lib/utils'
import { Message } from '@/lib/validators/message'
import { useMutation } from '@tanstack/react-query'
import { CornerDownLeft, Loader2 } from 'lucide-react'
import { nanoid } from 'nanoid'
import { FC, HTMLAttributes, useContext, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import TextareaAutosize from 'react-textarea-autosize'

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {}

const ChatInput: FC<ChatInputProps> = ({ className, ...props }) => {

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [input, setInput] = useState<string>('')



  const {
    messages,
    addMessage,
    removeMessage,
    updateMessage,
    setIsMessageUpdating,
  } = useContext(MessagesContext)

  const { mutate: sendMessage, isLoading } = useMutation({
    mutationKey: ['sendMessage'],
    // include message to later use it in onMutate
    mutationFn: async (_message: Message) => { //its of Type Message
      
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages :'hello'}),
      })

      return response.body
    },
    onMutate(message) {
      addMessage(message)
    },
    onSuccess: async (stream) => {
      if (!stream) throw new Error('No stream')

      // construct new message to add
      const id = nanoid()
      const responseMessage: Message = {
        id,
        isUserMessage: false,
        text: '',
      }

      // add new message to state
      addMessage(responseMessage)

      setIsMessageUpdating(true)

      const reader = stream.getReader()
      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        const chunkValue = decoder.decode(value)
        updateMessage(id, (prev) => prev + chunkValue)
      }

      // clean up
      setIsMessageUpdating(false)
      setInput('')

      setTimeout(() => {
        textareaRef.current?.focus()
      }, 10)
    },
    onError: (_, message) => {
      toast.error('Something went wrong. Please try again.')
      removeMessage(message.id)
      textareaRef.current?.focus()
    },
  })
 

  return (
    <div {...props } className={cn('border-t border-zinc-300', className)} >
        <div className="relative text-black mt-4 flex-1 overflow-hidden border-none outline-none bg-red-400">
          <TextareaAutosize
                      ref={textareaRef}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
            
                          const message: Message = {
                            id: nanoid(),
                            isUserMessage: true, 
                            text: input,
                          }     
                          sendMessage(message)
                        }
                      }}
             rows={2}
            maxRows={4}
             autoFocus
             value={input}
             onChange={(e)=>setInput(e.target.value)}
             placeholder='Write a Message...'
             className='peer text-black p-2 disabled:opacity-50 pr-14 resize-none block w-full border-0 bg-zinc-100 py-1.5 focus:ring-0 text-sm sm:leading-6'

          />
         </div>
    </div>
  )
}

export default ChatInput
