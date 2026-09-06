"use client";

import PremiumFortune from "../components/premium-fortune";

export default function IsClient() {
  return <PremiumFortune kind="career" title="İş & Kariyer Falı" eyebrow="Kariyer" description="Kariyerindeki yön değişimini, fırsatları, görünürlüğünü ve önündeki seçenekleri sana özel okuyalım." placeholder="Örn: İş değiştirmeli miyim, bulunduğum yerde yükselme ihtimalim var mı?" accent="blue" />;
}
