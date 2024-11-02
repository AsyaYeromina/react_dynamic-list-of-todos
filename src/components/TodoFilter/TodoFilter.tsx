import { useState } from 'react';
import { FilterStatus } from '../../types/FilterStatus';

interface TodoFilterProps {
  onFilterChange: (status: FilterStatus, query: string) => void;
}

export const TodoFilter: React.FC<TodoFilterProps> = ({ onFilterChange }) => {
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value as FilterStatus;

    if (newStatus !== selectedStatus) {
      setSelectedStatus(newStatus);
      onFilterChange(newStatus, searchQuery);
    }
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    if (newQuery !== searchQuery) {
      setSearchQuery(newQuery);
      onFilterChange(selectedStatus, newQuery);
    }
  };

  const handleClearQuery = () => {
    setSearchQuery('');
    onFilterChange(selectedStatus, '');
  };

  return (
    <form className="field has-addons">
      <p className="control">
        <span className="select">
          <select
            data-cy="statusSelect"
            onChange={handleStatusChange}
            value={selectedStatus}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </span>
      </p>

      <p className="control is-expanded has-icons-left has-icons-right">
        <input
          data-cy="searchInput"
          type="text"
          className="input"
          placeholder="Search..."
          onChange={handleQueryChange}
          value={searchQuery}
        />
        <span className="icon is-left">
          <i className="fas fa-magnifying-glass" />
        </span>

        <span className="icon is-right" style={{ pointerEvents: 'all' }}>
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}

          {searchQuery && (
            <button
              data-cy="clearSearchButton"
              type="button"
              className="delete"
              onClick={handleClearQuery}
            />
          )}
        </span>
      </p>
    </form>
  );
};
