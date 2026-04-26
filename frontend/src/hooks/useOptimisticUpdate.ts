import { useQueryClient, type QueryKey } from '@tanstack/react-query';

export function useOptimisticUpdate<T>(
  queryKey: QueryKey,
  updateFn: (old: T | undefined) => T
) {
  const queryClient = useQueryClient();

  const mutateOptimistically = async (mutateFn: () => Promise<unknown>): Promise<void> => {
    // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries({ queryKey });

    // Snapshot the previous value
    const previousValue = queryClient.getQueryData<T>(queryKey);

    // Optimistically update to the new value
    queryClient.setQueryData<T>(queryKey, updateFn);

    try {
      // Execute the actual mutation
      await mutateFn();
    } catch (err) {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(queryKey, previousValue);
      throw err;
    } finally {
      // Always refetch after error or success to ensure synced state
      queryClient.invalidateQueries({ queryKey });
    }
  };

  return { mutateOptimistically };
}
