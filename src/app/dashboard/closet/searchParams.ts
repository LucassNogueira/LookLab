import { parseAsBoolean, parseAsString, createSearchParamsCache } from 'nuqs/server';

export const searchParamsCache = createSearchParamsCache({
    activeTab: parseAsString.withDefault("All"),
    isBuilderMode: parseAsBoolean.withDefault(false),
    occasion: parseAsString.withDefault(""),
    isAddItemOpen: parseAsBoolean.withDefault(false),
});

export const searchParamsParsers = {
    activeTab: parseAsString.withDefault("All"),
    isBuilderMode: parseAsBoolean.withDefault(false),
    occasion: parseAsString.withDefault(""),
    isAddItemOpen: parseAsBoolean.withDefault(false),
};
