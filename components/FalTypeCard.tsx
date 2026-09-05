import Link from "next/link";

type FalTypeCardProps = {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  colorClass: string;
  href: string;
  isMain?: boolean;
};

export default function FalTypeCard({ 
  title, 
  description, 
  icon: Icon, 
  colorClass, 
  href, 
  isMain = false 
}: FalTypeCardProps) {
  return (
    <Link href={href} className={`group block fal-card ${isMain ? "fal-card coffee" : ""} h-full`}>
      <div className="fal-card-content">
        <div className={`fal-card-icon ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="fal-card-title">{title}</h3>
        <p className="fal-card-description">{description}</p>
        <div className="fal-card-button flex items-center">
          <span>Keşfet</span>
          <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  );
}