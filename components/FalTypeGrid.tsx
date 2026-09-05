import Link from "next/link";
import FalTypeCard from "./FalTypeCard";
import { 
  Coffee, 
  MessageSquare, 
  Heart, 
  Wallet, 
  Briefcase, 
  Moon, 
  Sun, 
  Star, 
  Zap 
} from "lucide-react";

export default function FalTypeGrid() {
  const falTypes = [
    {
      title: "Kahve Falı",
      description: "Fincanını yükle, kişisel falını keşfet.",
      icon: Coffee,
      colorClass: "bg-gradient-to-br from-brown-600 via-amber-400 to-yellow-300",
      href: "/fal/upload",
      isMain: true
    },
    {
      title: "Tarot Falı",
      description: "Desteni seç, kartların sana ne söylediğini keşfet.",
      icon: MessageSquare,
      colorClass: "bg-gradient-to-br from-purple-700 via-indigo-500 to-violet-400",
      href: "/fal/tarot"
    },
    {
      title: "Aşk Falı",
      description: "Aşk hayatındaki meraklarını keşfet.",
      icon: Heart,
      colorClass: "bg-gradient-to-br from-rose-800 via-red-600 to-pink-400",
      href: "/fal/ask"
    },
    {
      title: "Para & Kısmet",
      description: "Bereket ve kısmet enerjini keşfet.",
      icon: Wallet,
      colorClass: "bg-gradient-to-br from-emerald-800 via-green-600 to-lime-400",
      href: "/fal/para"
    },
    {
      title: "İş & Kariyer",
      description: "Kariyer yolundaki sembolleri keşfet.",
      icon: Briefcase,
      colorClass: "bg-gradient-to-br from-blue-800 via-sky-500 to-cyan-400",
      href: "/fal/is"
    },
    {
      title: "Günlük Fal",
      description: "Bugünün enerjisini öğren.",
      icon: Sun,
      colorClass: "bg-gradient-to-br from-indigo-900 via-blue-600 to-sky-400",
      href: "/fal/gunluk"
    },
    {
      title: "Yıldızname / Burç",
      description: "Gökyüzünün ipuçlarını çöz.",
      icon: Star,
      colorClass: "bg-gradient-to-br from-purple-900 via-purple-600 to-fuchsia-400",
      href: "/fal/burc"
    },
    {
      title: "Rüya Yorumu",
      description: "Rüyalarındaki mesajları yorumla.",
      icon: Zap,
      colorClass: "bg-gradient-to-br from-indigo-800 via-violet-600 to-pink-400",
      href: "/fal/ruya"
    }
  ];

  return (
    <div className="grid gap-6 mb-16">
      {/* Main coffee fal card - larger */}
      <div className="col-span-1 md:col-span-2 lg:col-span-2">
        <FalTypeCard {...falTypes[0]} />
      </div>
      
      {/* Other fal types in a grid */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {falTypes.slice(1).map((falType, index) => (
          <FalTypeCard key={index} {...falType} />
        ))}
      </div>
    </div>
  );
}