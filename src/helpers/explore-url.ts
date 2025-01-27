import { addLapisSelectorToUrlSearchParams, LapisSelector } from '../data/LapisSelector';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { globalDateCache } from './date-cache';
import { Utils } from './Utils';

export type ExploreUrl = {
  selector: LapisSelector;
  setSelector: (selector: LapisSelector) => void;
};

export function useExploreUrl(): ExploreUrl {
  const searchString = useLocation().search;
  const searchParam = useMemo(() => new URLSearchParams(searchString), [searchString]);

  const selector: LapisSelector = useMemo(() => {
    const dateFromString = searchParam.get('dateFrom');
    const dateToString = searchParam.get('dateTo');
    return {
      location: {
        region: searchParam.get('region') ?? undefined,
        country: searchParam.get('country') ?? undefined,
        division: searchParam.get('division') ?? undefined,
      },
      host: searchParam.get('host')?.split(',') ?? [],
      variant: {
        clade: searchParam.get('clade') ?? undefined,
      },
      dateRange: {
        dateFrom: dateFromString ? globalDateCache.getDay(dateFromString) : undefined,
        dateTo: dateToString ? globalDateCache.getDay(dateToString) : undefined,
        yearFrom: Utils.safeParseInt(searchParam.get('yearFrom')),
        yearTo: Utils.safeParseInt(searchParam.get('yearTo')),
        yearMonthFrom: searchParam.get('yearMonthFrom') ?? undefined,
        yearMonthTo: searchParam.get('yearMonthTo') ?? undefined,
      },
    };
  }, [searchParam]);

  const navigate = useNavigate();
  const setSelector = useCallback(
    (selector: LapisSelector) => {
      const newParams = new URLSearchParams();
      addLapisSelectorToUrlSearchParams(selector, newParams);
      navigate(`.?${newParams.toString()}`);
    },
    [navigate]
  );

  return { selector, setSelector };
}
