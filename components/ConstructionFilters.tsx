'use client';

import { useState } from 'react';
import { Filter, ChevronDown, X, LayoutGrid, List } from 'lucide-react';
import type { FilterOptions, SortOption, ViewMode } from '@/lib/types';

interface ConstructionFiltersProps {
    filterOptions: FilterOptions;
    sortOption: SortOption;
    viewMode: ViewMode;
    동목록: string[];
    onFilterChange: (filters: FilterOptions) => void;
    onSortChange: (sort: SortOption) => void;
    onViewModeChange: (mode: ViewMode) => void;
}

export default function ConstructionFilters({
    filterOptions,
    sortOption,
    viewMode,
    동목록,
    onFilterChange,
    onSortChange,
    onViewModeChange
}: ConstructionFiltersProps) {
    const [showFilters, setShowFilters] = useState(false);

    // 활성 필터 개수
    const activeFilterCount =
        (filterOptions.시공구분 !== '전체' ? 1 : 0) +
        (filterOptions.동.length > 0 ? 1 : 0);

    // 필터 초기화
    const resetFilters = () => {
        onFilterChange({
            시공구분: '전체',
            동: [],
            가격대: { 최소: 0, 최대: Infinity }
        });
    };

    return (
        <div className="sticky top-16 z-30 -mx-4 sm:mx-0">
            <div className="glass border-y sm:border sm:rounded-2xl border-neutral-200/50">
                <div className="px-4 py-3 sm:px-6 sm:py-4">
                    {/* 상단 바 */}
                    <div className="flex items-center justify-between gap-4">
                        {/* 왼쪽: 필터 버튼 */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`btn-ghost !px-3 relative
                                    ${showFilters ? 'bg-neutral-100' : ''}`}
                            >
                                <Filter className="w-4 h-4" />
                                <span className="hidden sm:inline">필터</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                                {activeFilterCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-accent text-white 
                                                     text-xs font-bold rounded-full flex items-center justify-center">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>

                            {/* 활성 필터 칩 */}
                            <div className="hidden sm:flex items-center gap-2 overflow-x-auto scrollbar-hide">
                                {filterOptions.시공구분 !== '전체' && (
                                    <button
                                        onClick={() => onFilterChange({ ...filterOptions, 시공구분: '전체' })}
                                        className="badge-dark group flex items-center gap-1.5 hover:bg-neutral-700 transition-colors"
                                    >
                                        {filterOptions.시공구분}
                                        <X className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                                    </button>
                                )}
                                {filterOptions.동.length > 0 && (
                                    <button
                                        onClick={() => onFilterChange({ ...filterOptions, 동: [] })}
                                        className="badge-dark group flex items-center gap-1.5 hover:bg-neutral-700 transition-colors"
                                    >
                                        {filterOptions.동.length === 1 ? `${filterOptions.동[0]}동` : `${filterOptions.동.length}개 동 선택`}
                                        <X className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 오른쪽: 정렬 + 뷰 전환 */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* 정렬 드롭다운 */}
                            <select
                                value={sortOption}
                                onChange={(e) => onSortChange(e.target.value as SortOption)}
                                className="bg-neutral-100 hover:bg-neutral-200 
                                           px-3 py-2 rounded-lg
                                           text-sm font-medium text-neutral-700
                                           border-none cursor-pointer
                                           focus:outline-none focus:ring-2 focus:ring-neutral-300
                                           transition-colors"
                            >
                                <option value="동호수">동/호수순</option>
                                <option value="금액_낮은순">금액 낮은순</option>
                                <option value="금액_높은순">금액 높은순</option>
                                <option value="최신순">최신순</option>
                            </select>

                            {/* 뷰 모드 전환 */}
                            <div className="flex bg-neutral-100 rounded-lg p-1">
                                <button
                                    onClick={() => onViewModeChange('gallery')}
                                    className={`p-2 rounded-md transition-all
                                        ${viewMode === 'gallery'
                                            ? 'bg-white shadow-soft text-neutral-900'
                                            : 'text-neutral-500 hover:text-neutral-700'
                                        }`}
                                    title="갤러리 뷰"
                                    aria-label="갤러리 뷰로 전환"
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onViewModeChange('list')}
                                    className={`p-2 rounded-md transition-all
                                        ${viewMode === 'list'
                                            ? 'bg-white shadow-soft text-neutral-900'
                                            : 'text-neutral-500 hover:text-neutral-700'
                                        }`}
                                    title="리스트 뷰"
                                    aria-label="리스트 뷰로 전환"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 확장 필터 패널 */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-neutral-200 space-y-5 animate-fade-in">
                            {/* 시공 구분 */}
                            <div>
                                <h4 className="text-sm font-semibold text-neutral-900 mb-3">시공 유형</h4>
                                <div className="flex flex-wrap gap-2">
                                    {(['전체', '중문', '도어'] as const).map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => onFilterChange({ ...filterOptions, 시공구분: type })}
                                            className={`px-4 py-2.5 rounded-xl text-sm font-medium 
                                                       transition-all duration-200
                                                ${filterOptions.시공구분 === type
                                                    ? 'bg-neutral-900 text-white shadow-medium'
                                                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 동 선택 */}
                            {동목록.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-neutral-900 mb-3">동 선택</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {동목록.map((dong) => {
                                            const isSelected = filterOptions.동.includes(dong);
                                            return (
                                                <button
                                                    key={dong}
                                                    onClick={() => {
                                                        const newDongs = isSelected
                                                            ? filterOptions.동.filter(d => d !== dong)
                                                            : [...filterOptions.동, dong];
                                                        onFilterChange({ ...filterOptions, 동: newDongs });
                                                    }}
                                                    className={`px-3 py-2 rounded-lg text-sm font-medium 
                                                               transition-all duration-200
                                                        ${isSelected
                                                            ? 'bg-neutral-900 text-white'
                                                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                                        }`}
                                                >
                                                    {dong}동
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* 필터 초기화 */}
                            {activeFilterCount > 0 && (
                                <div className="flex justify-end pt-2">
                                    <button
                                        onClick={resetFilters}
                                        className="text-sm text-neutral-500 hover:text-neutral-900 
                                                   font-medium transition-colors"
                                    >
                                        필터 초기화
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
