import { Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSites } from "@/context/SiteContext";

interface SiteFilterProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SiteFilter({ value, onChange, className = "w-44 h-9" }: SiteFilterProps) {
  const { sites } = useSites();
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <Filter className="w-3.5 h-3.5 mr-1" />
        <SelectValue placeholder="Filter by Site" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Sites</SelectItem>
        {sites.map(s => (
          <SelectItem key={s.id} value={s.id}>{s.shortName}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
