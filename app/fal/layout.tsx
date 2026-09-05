import { FalAccessGate } from "@/components/FalAccessGate";

export default function FalLayout({ children }: { children: React.ReactNode }) {
  return <FalAccessGate>{children}</FalAccessGate>;
}
