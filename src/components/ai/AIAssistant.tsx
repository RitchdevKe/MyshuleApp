"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Mic, X, MessageSquare, Loader2, Volume2, VolumeX, Send } from "lucide-react";

// ── School-domain auto-corrections for speech recognition ──
// The browser STT frequently mishears school terminology.
const SPEECH_CORRECTIONS: Record<string, string> = {
  "face": "fees",
  "faze": "fees",
  "fays": "fees",
  "phase": "fees",
  "fee's": "fees",
  "feces": "fees",
  "piece": "fees",
  "peace": "fees",
  "fis": "fees",
  "fizz": "fees",
  "fade": "fees",
  "faith": "fees",
  "balanced": "balance",
  "balances": "balance",
  "ballots": "balance",
  "clarence": "clearance",
  "attendance": "attendance",
  "a tendance": "attendance",
  "attendants": "attendance",
  "attendees": "attendance",
  "student": "student",
  "students": "students",
  "stew dent": "student",
  "grades": "grades",
  "grace": "grades",
  "gray": "grade",
  "gray d": "grade",
  "term": "term",
  "tram": "term",
  "stream": "stream",
  "scream": "stream",
  "class": "class",
  "clasp": "class",
  "glass": "class",
  "teach her": "teacher",
  "teachers": "teachers",
  "invoice": "invoice",
  "in voice": "invoice",
  "in voices": "invoices",
  "admission": "admission",
  "add mission": "admission",
  "my shoe": "MyShule",
  "my school": "MyShule",
  "my shul": "MyShule",
  "my shell": "MyShule",
  "my show": "MyShule",
  "michelle": "MyShule",
  "my shoe lay": "MyShule",
};

function autoCorrectTranscript(raw: string): string {
  let corrected = raw.toLowerCase();
  // Sort corrections by length (longest first) to avoid partial matches
  const sorted = Object.entries(SPEECH_CORRECTIONS).sort(
    (a, b) => b[0].length - a[0].length
  );
  for (const [wrong, right] of sorted) {
    const regex = new RegExp(`\\b${wrong}\\b`, "gi");
    corrected = corrected.replace(regex, right);
  }
  return corrected;
}

// MyShule AI Assistant — renders as a mic icon in the top bar,
// chat panel opens to the RIGHT of MyShule App.
export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Pre-load speech synthesis voices on mount to avoid empty arrays on first use
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Close panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim()) return;

    // Auto-correct speech mishearings
    const correctedText = autoCorrectTranscript(text);

    const current = messagesRef.current;
    const newMessages = [...current, { role: "user" as const, text: correctedText }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: correctedText,
          history: current.map((m) => ({
            role: m.role === "ai" ? "model" : "user",
            parts: [{ text: m.text }],
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || `Server error (${res.status})`);
      }

      setMessages([...newMessages, { role: "ai", text: data.response }]);

      if (voiceEnabled && "speechSynthesis" in window) {
        window.speechSynthesis.cancel(); // Stop any ongoing speech
        const utterance = new SpeechSynthesisUtterance(data.response);
        
        // Try to find a female voice
        let voices = window.speechSynthesis.getVoices();
        
        // Some browsers need this to trigger voice loading
        if (voices.length === 0) {
          window.speechSynthesis.onvoiceschanged = () => {
             // We can't easily wait for this inside this sync block, but fetching voices here might help.
          };
        }

        const femaleNames = ["samantha", "victoria", "karen", "moira", "tessa", "zira", "google uk english female", "google us english", "female"];
        const femaleVoice = voices.find(v => 
          femaleNames.some(name => v.name.toLowerCase().includes(name))
        );
        
        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }
        
        window.speechSynthesis.speak(utterance);
      }
    } catch (err: any) {
      setMessages([...newMessages, { role: "ai", text: `Sorry, I couldn't process that. ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  }, [voiceEnabled]);

  // Initialise browser Speech Recognition once
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-KE"; // Kenyan English for better local accent recognition

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) handleSend(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
  }, [handleSend]);

  const toggleListen = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in this browser. Try Chrome.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // ── Collapsed state: just a mic icon in the header ──
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-8 h-8 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 transition-colors ml-2"
        title="MyShule AI"
      >
        <Mic className="w-4 h-4" />
      </button>
    );
  }

  // ── Expanded state: chat panel opens to the RIGHT ──
  return (
    <div className="relative ml-2" ref={panelRef}>
      <button
        onClick={() => setIsOpen(false)}
        className="w-8 h-8 rounded-full flex items-center justify-center text-secondary-400 bg-white/20 transition-colors"
        title="Close MyShule"
      >
        <Mic className="w-4 h-4" />
      </button>

      <div className="absolute top-0 left-full ml-3 w-[380px] max-h-[520px] bg-white border border-gray-200 shadow-2xl rounded-2xl flex flex-col z-[100] overflow-hidden animate-in fade-in slide-in-from-left-2 duration-150">
        {/* Header */}
        <div className="bg-primary-950 px-4 py-3 text-white flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-secondary-500" />
            <span className="font-black text-xs tracking-widest uppercase">
              My<span className="text-secondary-500">Shule</span>
            </span>
          </div>
          <div className="flex gap-1.5">
            <button onClick={() => setVoiceEnabled(!voiceEnabled)} className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              {voiceEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            <button onClick={() => setIsOpen(false)} className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 p-3 overflow-y-auto min-h-[280px] max-h-[360px] bg-gray-50 flex flex-col gap-2.5">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 my-auto text-xs leading-relaxed">
              <p className="font-semibold text-gray-600 mb-1">Hi! I&apos;m MyShule.</p>
              <p>Ask me about students, fees, attendance&hellip;</p>
              <p className="mt-2 text-[10px] text-gray-400">Start by saying: <span className="italic">&ldquo;Hi MyShule, what&apos;s the fee balance for&hellip;&rdquo;</span></p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`p-2.5 rounded-xl max-w-[85%] text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary-950 text-white rounded-br-none"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="p-2.5 bg-white border border-gray-200 rounded-xl rounded-bl-none shadow-sm">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div className="px-3 py-2.5 border-t border-gray-200 bg-white flex items-center gap-2 flex-shrink-0">
          <button
            onClick={toggleListen}
            className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center transition-colors ${
              isListening
                ? "bg-red-100 text-red-600 animate-pulse ring-2 ring-red-300"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
            }`}
            title={isListening ? "Listening…" : "Start voice input"}
          >
            <Mic className="h-4 w-4" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            placeholder="Hi MyShule…"
            className="flex-1 bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-secondary-500 rounded-full px-3.5 py-2 text-xs"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center bg-primary-950 text-white hover:bg-primary-900 disabled:opacity-40 transition-colors"
            title="Send"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
