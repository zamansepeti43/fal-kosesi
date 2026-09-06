"use client";

import PremiumFortune from "../components/premium-fortune";

export default function GunlukClient() {
  return <PremiumFortune kind="daily" title="Günlük Fal" eyebrow="Bugünün Enerjisi" description="Bugünün enerjisini sadece genel bir cümleyle değil, senin profilin ve bugün merak ettiğin konu üzerinden detaylı okuyalım." placeholder="Örn: Bugün özellikle hangi konuda dikkatli olmalıyım, karşıma nasıl bir fırsat çıkabilir?" accent="amber" />;
}
