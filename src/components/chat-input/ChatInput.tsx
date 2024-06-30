'use client';

import { useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from '../ui/Button';
import { Icons } from '../icons/Icons';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ChatInputProps {
  chatId: string;
  chatPartner: User;
}

export const ChatInput = ({ chatId, chatPartner }: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');

  const sendMessage = async () => {
    if (!input) return;
    setIsLoading(true);
    try {
      await axios.post('/api/message/send', { text: input, chatId });
      setInput('');
      textareaRef.current?.focus();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
      <div className="relative flex md:block md:flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-violet-700">
        <TextareaAutosize
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${chatPartner.name}`}
          className="block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
        />
        <Button
          className="block md:hidden bg-trasparent hover:bg-violet-700 group transition-all duration-100 ease-in-out"
          isLoading={isLoading}
          onClick={sendMessage}
          type="submit"
        >
          {!isLoading ? (
            <Icons.Send className="h-6 w-auto text-violet-700 group-hover:text-white" />
          ) : (
            <span className="animate-pulse">Sending...</span>
          )}
        </Button>

        <div
          onClick={() => textareaRef.current?.focus()}
          className="py-2"
          aria-hidden="true"
        >
          <div className="py-px hidden md:flex">
            <div className="h-9" />
          </div>
        </div>
        <div className="absolute hidden md:flex right-0 bottom-0 justify-between py-2 pl-3 pr-2">
          <div className="flex-shrink-0">
            <Button
              className="bg-trasparent hover:bg-violet-700 group transition-all duration-100 ease-in-out"
              isLoading={isLoading}
              onClick={sendMessage}
              type="submit"
            >
              {!isLoading ? (
                <Icons.Send className="h-6 w-auto text-violet-700 group-hover:text-white" />
              ) : (
                <span className="animate-pulse">Sending...</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
