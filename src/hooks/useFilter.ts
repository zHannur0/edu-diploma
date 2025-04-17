"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo, useCallback } from "react";

type FilterValue = string | number | boolean | undefined | null;
type Filters = Record<string, FilterValue | FilterValue[]>;

export const useFilters = <T extends Filters = Filters>(defaultValues?: T) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const setFilter = useCallback(
        (key: string, value: FilterValue | FilterValue[]) => {
            const params = new URLSearchParams(searchParams.toString());

            params.delete(key);

            if (value === undefined || value === null) {
            }
            else if (Array.isArray(value)) {
                value.filter(Boolean).forEach((item) => {
                    params.append(key, String(item));
                });
            }
            else if (value !== "") {
                params.set(key, String(value));
            }

            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [searchParams, router, pathname]
    );

    const setFilters = useCallback(
        (filterObject: Partial<T>) => {
            const params = new URLSearchParams(searchParams.toString());

            Object.entries(filterObject).forEach(([key, value]) => {
                params.delete(key);

                if (value === undefined || value === null) {
                } else if (Array.isArray(value)) {
                    value.filter(Boolean).forEach((item) => {
                        if (item !== undefined && item !== null && item !== "") {
                            params.append(key, String(item));
                        }
                    });
                } else if (value !== "") {
                    params.set(key, String(value));
                }
            });

            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [searchParams, router, pathname]
    );

    const setPage = useCallback(
        (page: number) => {
            const params = new URLSearchParams(searchParams.toString());

            params.delete("page");

            if (page !== 1) {
                params.set("page", page.toString());
            }

            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [searchParams, router, pathname]
    );

    const resetFilters = useCallback(() => {
        router.push(pathname, { scroll: false });
    }, [router, pathname]);

    const removeFilter = useCallback(
        (key: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete(key);
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [searchParams, router, pathname]
    );

    const filters = useMemo(() => {
        const params = new URLSearchParams(searchParams.toString());
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: Record<string, any> = { ...defaultValues };

        const processNumeric = (key: string) => {
            const value = params.get(key);
            return value ? Number(value) : undefined;
        };

        result.degree_type = processNumeric("degree_type") || undefined;
        result.duration = processNumeric("duration") || undefined;

        result.fields_of_study = processNumeric("fields_of_study") || undefined;
        result.languages = processNumeric("languages") || undefined;

        result.location = params.get("location") || undefined;

        result.name = params.get("name") || undefined;

        result.study_formats = params.get("study_formats") || undefined;

        Array.from(params.keys()).forEach(key => {
            const values = params.getAll(key);
            if (values.length > 1) {
                if (!isNaN(Number(values[0]))) {
                    result[`${key}__gte`] = Math.min(...values.map(Number));
                    result[`${key}__lte`] = Math.max(...values.map(Number));
                    result[key] = values.map(Number);
                } else {
                    result[key] = values;
                }
            } else if (!result[key] && values.length === 1) {
                const value = values[0];
                if (value === "true" || value === "false") {
                    result[key] = value === "true";
                } else if (!isNaN(Number(value))) {
                    result[key] = Number(value);
                } else {
                    result[key] = value;
                }
            }
        });

        return result as T;
    }, [searchParams, defaultValues]);

    const getFilterUrl = useCallback(
        (additionalParams?: Partial<T>) => {
            const params = new URLSearchParams(searchParams.toString());

            if (additionalParams) {
                Object.entries(additionalParams).forEach(([key, value]) => {
                    params.delete(key);

                    if (value === undefined || value === null) {
                    } else if (Array.isArray(value)) {
                        value.filter(Boolean).forEach(item => {
                            params.append(key, String(item));
                        });
                    } else if (value !== "") {
                        params.set(key, String(value));
                    }
                });
            }

            return `${pathname}?${params.toString()}`;
        },
        [searchParams, pathname]
    );

    return {
        filters,
        setFilter,
        setFilters,
        setPage,
        resetFilters,
        removeFilter,
        getFilterUrl,
        searchParams
    };
};