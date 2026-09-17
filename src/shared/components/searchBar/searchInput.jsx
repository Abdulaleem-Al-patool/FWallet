import { Search } from 'lucide-react';

export function SearchInput() {
    return (
        <div className="input-wrapper">
            <Search
                className="search-placeholder-icon"
                size={18}
            />

            <input
                type="text"
                className="search-input"
                placeholder="بحث.."
            />
        </div>
    );
}