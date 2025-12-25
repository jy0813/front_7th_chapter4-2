import { useMemo } from 'react';
import { useDndContext } from '@dnd-kit/core';

const useActiveTableId = (): string | null => {
  const { active } = useDndContext();

  return useMemo(() => {
    if (active?.id) {
      return String(active.id).split(':')[0];
    }
    return null;
  }, [active?.id]);
};

export default useActiveTableId;
