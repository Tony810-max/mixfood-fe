import { useUiText } from '@/contexts/LanguageContext';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput
} from "@/components/ui/input-group"
import { useLanguage } from "@/contexts/LanguageContext"
import { Search, X } from "lucide-react"

interface SearchContentProps {
    value: string
    onSearchChange?: (query: string) => void
}

export default function SearchContent({ value, onSearchChange }: SearchContentProps) {
  const ui = useUiText();
    const { t } = useLanguage()

    return (
        <InputGroup className="h-11 rounded-xl border-input bg-card shadow-sm has-[[data-slot=input-group-control]:focus-visible]:border-primary has-[[data-slot=input-group-control]:focus-visible]:ring-2 has-[[data-slot=input-group-control]:focus-visible]:ring-primary/20">
            <InputGroupInput
                type="search"
                placeholder={t.menuSearchPlaceholder}
                aria-label={t.menuSearchPlaceholder}
                className="h-11 text-base focus-visible:ring-0 focus-visible:ring-offset-0 md:text-sm [&::-webkit-search-cancel-button]:appearance-none"
                value={value}
                onChange={(e) => onSearchChange?.(e.target.value)}
            />
            <InputGroupAddon>
                <Search aria-hidden="true" />
            </InputGroupAddon>
            {value && <InputGroupAddon align="inline-end"><button type="button" onClick={() => onSearchChange?.("")} aria-label={ui("Clear search")} className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><X aria-hidden="true" className="size-4" /></button></InputGroupAddon>}
        </InputGroup>
    )
}
