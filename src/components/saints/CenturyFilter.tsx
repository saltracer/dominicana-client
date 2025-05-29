import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface CenturyFilterProps {
  centuries: number[];
  selectedCentury: number | null;
  onCenturyChange: (century: number | null) => void;
  className?: string;
}

const getCenturyLabel = (century: number) => {
  const suffix = century === 1 ? 'st' : century === 2 ? 'nd' : century === 3 ? 'rd' : 'th';
  return `${century}${suffix} Century`;
};

const CenturyFilter: React.FC<CenturyFilterProps> = ({
  centuries,
  selectedCentury,
  onCenturyChange,
  className = ''
}) => {
  return (
    <div className={className}>
      <Select
        value={selectedCentury?.toString() || ''}
        onValueChange={(value) => onCenturyChange(value ? parseInt(value) : null)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="All Centuries" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Centuries</SelectItem>
          {centuries.map((century) => (
            <SelectItem key={century} value={century.toString()}>
              {getCenturyLabel(century)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CenturyFilter;
