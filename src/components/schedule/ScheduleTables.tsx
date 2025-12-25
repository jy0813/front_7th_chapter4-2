import { memo, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { useScheduleContext } from '../../ScheduleContext';
import useAutoCallback from '../../hooks/useAutoCallback';
import ScheduleTableItem from './ScheduleTableItem';
import SearchDialog from '../searchDialog/SearchDialog';

interface SearchInfo {
  tableId: string;
  day?: string;
  time?: number;
}

const ScheduleTables = memo(() => {
  const { schedulesMap, setSchedulesMap } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<SearchInfo | null>(null);

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  const handleDuplicate = useAutoCallback((targetId: string) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [`schedule-${Date.now()}`]: [...prev[targetId]],
    }));
  });

  const handleRemove = useAutoCallback((targetId: string) => {
    setSchedulesMap((prev) => {
      const newMap = { ...prev };
      delete newMap[targetId];
      return newMap;
    });
  });

  const handleAddClick = useAutoCallback((tableId: string) => {
    setSearchInfo({ tableId });
  });

  const handleScheduleTimeClick = useAutoCallback(
    (tableId: string, timeInfo: { day: string; time: number }) => {
      setSearchInfo({ tableId, ...timeInfo });
    },
  );

  const handleDeleteSchedule = useAutoCallback(
    (tableId: string, { day, time }: { day: string; time: number }) => {
      setSchedulesMap((prev) => ({
        ...prev,
        [tableId]: prev[tableId].filter(
          (schedule) =>
            schedule.day !== day || !schedule.range.includes(time),
        ),
      }));
    },
  );

  const handleCloseDialog = useAutoCallback(() => {
    setSearchInfo(null);
  });

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <ScheduleTableItem
            key={tableId}
            tableId={tableId}
            schedules={schedules}
            index={index}
            disabledRemove={disabledRemoveButton}
            onAddClick={() => handleAddClick(tableId)}
            onDuplicateClick={() => handleDuplicate(tableId)}
            onRemoveClick={() => handleRemove(tableId)}
            onScheduleTimeClick={(timeInfo) =>
              handleScheduleTimeClick(tableId, timeInfo)
            }
            onDeleteSchedule={(timeInfo) =>
              handleDeleteSchedule(tableId, timeInfo)
            }
          />
        ))}
      </Flex>
      {searchInfo && (
        <SearchDialog searchInfo={searchInfo} onClose={handleCloseDialog} />
      )}
    </>
  );
});

export default ScheduleTables;
