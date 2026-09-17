import { Funnel } from 'lucide-react';
import { SearchInput } from './searchInput';
import './searchBar.css';

export function SearchBar() {
    return (
        <div className="container-search">

            <SearchInput />

            <span className="filter-icon">
                <Funnel />
            </span>

            {/* سنفصل Dropdown لاحقًا */}

            {/* سنفصل Button لاحقًا */}

        </div>
    );
}