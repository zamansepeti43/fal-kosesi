"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, MessagesSquare, Coffee as CoffeeIcon, Heart, Wallet, Briefcase, Moon } from "lucide-react";

const mockResult = {
  summary: "Fincanınızdaki semboller, bir dönüm noktasının ve yeni başlangıçların önünden geldiğini gösteriyor. Bu yolculuk, gelecekteki adımlarınızı daha güvenle atabileceğinizi gösterir.",
  symbols: [
    { name: "Kuş", zone: "Kenar", meaning: "Yakında güzel bir haber alacaksınız." },
    { name: "Kalp", zone: "Orta", meaning: "Aşk hayatınızda derinleşme ve duygusal bağlanma artışı." },
    { name: "Anahtar", zone: "Dip", meaning: "Kariyerinizde yeni bir kapı açılacak veya mevcut pozisyonunuzda bir ilerleme kaydedeceksiniz." },
    { name: "Yol", zone: "Kenar", meaning: "Seyahat planlarınız veya yaşamınızda yeni bir yön geçerli olacak." },
    { name: "Halka", zone: "Dip", meaning: "İlişkilerinizde bir bağlanma veya taahhüt aşamasına girmeye hazırsınız." }
  ],
  love: "Aşk hayatınızda sıcaklık ve yakınlık artıyor. Şu anda zorluklar yaşasanız da, bu geçici ve anlaşılmaya değer. Açık iletişim, kalbinizin istediği yere götürecek.",
  money: "Finansal durumunuzda iyileşme görünür. Beklediğiniz bir ödeme veya gelirinizi artıran bir fırsat yaklaşır. Paranızı değerli yatırım alanlarına yönlendirmek iyi bir zaman.",
  career: "Kariyer yolunuzda önemli bir ilerleme kaydedebileceğinizi gösterir. Yeni bir proje, sorumluluk veya liderlik rolü sunulabilir. Güveninizi artırın ve fırsatlardan yararlanın.",
  future: "Yakın geleceğinizde pozitif değişiklikler ve kişisel büyüme fırsatları bekliyor. Açık kalın ve içgüdülerinizi dinleyin; size yön veren işaretleri görmeye hazırlıklı olun."
};

export default function ResultClient() {
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Array<{id: number; text: string; isUser: boolean}>>([]);
  const [reading, setReading] = useState<typeof mockResult | null>(null);

  const mockResponses = [
    "Bu sembol, genellikle bir mesaj veya haber getirdiğini gösterir. Daha spesifik olmak için, kimin sizinle iletişim kurmak istediğini düşünün.",
    "Kalbinizdeki bu bağ, derinlemesine bir anlam taşır. Bu duygusal bağ, sadece geçici bir iltifat değil, daha kalıcı bir şeyin başlangıcı olabilir.",
    "Bu anahtar sembolü, genellikle bir kapının açılması veya bir problemin çözümüyle ilgilidir. Hangi alanda bir çözüm arıyorsunuz?",
    "Yol sembolü, hem gerçek yolculuk hem de yaşam yolunuzdaki bir değişiklik gösterebilir. Hangi yönü düşünüyorsunuz?",
    "Bu dairenin anlamı, genellikle tamamlık ve bütünlük. Hangi alanda bir döngünün tamamlandığını hissediyorsunuz?"
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = sessionStorage.getItem("falResult");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setReading({
          summary: parsed.summary ?? mockResult.summary,
          symbols: Array.isArray(parsed.symbols) ? parsed.symbols : mockResult.symbols,
          love: parsed.sections?.love ?? mockResult.love,
          money: parsed.sections?.money ?? mockResult.money,
          career: parsed.sections?.career ?? mockResult.career,
          future: parsed.sections?.future ?? mockResult.future,
        });
      } catch {
        setReading(mockResult);
      }
      return;
    }
    setReading(mockResult);
  }, []);

  const activeResult = reading ?? mockResult;

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: chatInput,
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    setChatInput("");

    setTimeout(() => {
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      const botMessage = {
        id: Date.now() + 1,
        text: randomResponse,
        isUser: false
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-7 md:px-8 md:pt-9">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-3">
            <Link href="/fal/upload">
              <span className="text-sm text-muted">← Geri</span>
            </Link>
            <h1 className="text-2xl font-bold">Fal Sonuçlarınız</h1>
          </div>
          <button
            onClick={() => setShowChat(!showChat)}
            className="flex items-center space-x-2 px-4 py-2 bg-line/30 hover:bg-line/40 rounded-lg text-sm"
          >
            <MessagesSquare size={20} />
            <span className="hidden md:inline">Falcıya Sor</span>
          </button>
        </header>

        <section className="mb-12">
          <div className="space-y-8">
            <div className="glass p-6 hover:glass-hover transition-all card-lift hover:-translate-y-2">
              <h2 className="font-semibold text-xl mb-4">Genel Yorum</h2>
              <p className="text-muted leading-relaxed">{activeResult.summary}</p>
            </div>

            <div className="glass p-6 hover:glass-hover transition-all card-lift hover:-translate-y-2">
              <h2 className="font-semibold text-xl mb-4">Görülen Semboller</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {activeResult.symbols.map((symbol, index) => (
                  <div key={index} className="p-4 bg-line/30 rounded-lg text-center">
                    <div className="flex items-center justify-center w-10 h-10 mb-3 mx-auto bg-gold/20 rounded-lg">
                      {symbol.name === "Kuş" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bird"><path d="M13 10h3l2-4-5 6-6-4z"/></svg>
                      )}
                      {symbol.name === "Kalp" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      )}
                      {symbol.name === "Anahtar" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-key"><path d="M12 4l2 12h5l-3-5 6-6H7l-3 5z"/></svg>
                      )}
                      {symbol.name === "Yol" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin"><path d="M20 10c0 4-4.107 7.5-8 10C4.107 17.5 0 14 0 10c0-3 1.894-5.396 4.5-6.562A7.943 7.943 0 0 1 10 1.94l1.055.369A3.999 3.999 0 0 1 14.5 3.562A7.943 7.943 0 0 1 20 10z"/></svg>
                      )}
                      {symbol.name === "Halka" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle"><circle cx="12" cy="12" r="8"/></svg>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg">{symbol.name}</h3>
                    <p className="text-xs text-muted">{symbol.zone}</p>
                    <p className="text-sm leading-relaxed">{symbol.meaning}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass p-6 hover:glass-hover transition-all card-lift hover:-translate-y-2">
              <h2 className="font-semibold text-xl mb-4">Aşk</h2>
              <p className="text-muted leading-relaxed">{activeResult.love}</p>
            </div>

            <div className="glass p-6 hover:glass-hover transition-all card-lift hover:-translate-y-2">
              <h2 className="font-semibold text-xl mb-4">Para & Kısmet</h2>
              <p className="text-muted leading-relaxed">{activeResult.money}</p>
            </div>

            <div className="glass p-6 hover:glass-hover transition-all card-lift hover:-translate-y-2">
              <h2 className="font-semibold text-xl mb-4">İş & Kariyer</h2>
              <p className="text-muted leading-relaxed">{activeResult.career}</p>
            </div>

            <div className="glass p-6 hover:glass-hover transition-all card-lift hover:-translate-y-2">
              <h2 className="font-semibold text-xl mb-4">Yakın Gelecek</h2>
              <p className="text-muted leading-relaxed">{activeResult.future}</p>
            </div>
          </div>
        </section>

        {showChat && (
          <section className="mb-8">
            <div className="glass p-6 hover:glass-hover transition-all card-lift hover:-translate-y-2">
              <h2 className="font-semibold text-xl mb-4">Falcıya Sor</h2>
              <p className="text-muted mb-4">
                Falınız hakkında ek sorular sorun ve daha derinlemesine yorumlar alın.
              </p>
              <div className="h-96 overflow-y-auto space-y-4 mb-4 p-4 bg-line/10 rounded-lg">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isUser ? "justify-end" : "justify-start"} space-x-3 max-w-[80%] ${msg.isUser ? "ml-auto" : "mr-auto"}`}>
                    <div className={`flex flex-col ${msg.isUser ? "items-end" : "items-start"}`}>
                      {msg.isUser && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user mr-2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>
                      )}
                      {!msg.isUser && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle ml-2"><path d="M12 2a9 9 0 0 1 9 9h-2a9 9 0 0 1-9-9 9 9 0 0 0-9 9 9 9 0 0 1 9 9z"/><line x1="12" x2="12" y1="8" y2="12"/></svg>
                      )}
                      <div className={`${msg.isUser ? "bg-gold" : "bg-line/30"} rounded-lg px-3 py-1 max-w-[200px]`}>
                        <p className={`${msg.isUser ? "text-background" : "text-foreground"} m-0`}>{msg.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Falınız hakkında bir soru yazın..."
                  className="flex-1 px-4 py-3 glass hover:glass-hover transition-all rounded-lg border border-line/30 focus:border-gold focus:ring-0 resize-none"
                  rows={2}
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-gold hover:bg-gold-hover text-background rounded-lg font-medium transition-all card-lift disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!chatInput.trim()}
                >
                  <Sparkles size={16} />
                  <span>Gönder</span>
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}