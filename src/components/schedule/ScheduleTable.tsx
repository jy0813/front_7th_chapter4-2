import { memo } from 'react';
import { Box } from '@chakra-ui/react';
import { Schedule } from '../../types';
import useAutoCallback from '../../hooks/useAutoCallback';
import useScheduleColor from '../../hooks/useScheduleColor';
import useActiveTableId from '../../hooks/useActiveTableId';
import ScheduleGrid from './ScheduleGrid';
import DraggableSchedule from './DraggableSchedule';

interface ScheduleTableProps {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick: (timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick: (timeInfo: { day: string; time: number }) => void;
}

const ScheduleTable = memo(
  ({
    tableId,
    schedules,
    onScheduleTimeClick,
    onDeleteButtonClick,
  }: ScheduleTableProps) => {
    // 커스텀 훅 사용
    const getColor = useScheduleColor(schedules);
    const activeTableId = useActiveTableId();

    // 셀 클릭 핸들러
    const handleCellClick = useAutoCallback((day: string, time: number) => {
      onScheduleTimeClick({ day, time });
    });

    // 삭제 핸들러
    const handleDelete = useAutoCallback((day: string, time: number) => {
      onDeleteButtonClick({ day, time });
    });

    return (
      <Box
        position="relative"
        outline={activeTableId === tableId ? '5px dashed' : undefined}
        outlineColor="blue.300"
      >
        <ScheduleGrid onCellClick={handleCellClick} />

        {schedules.map((schedule, index) => (
          <DraggableSchedule
            key={`${schedule.lecture.id}-${schedule.day}-${schedule.range[0]}`}
            id={`${tableId}:${index}`}
            schedule={schedule}
            bg={getColor(schedule.lecture.id)}
            onDelete={() => handleDelete(schedule.day, schedule.range[0])}
          />
        ))}
      </Box>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.tableId !== nextProps.tableId) return false;
    if (prevProps.schedules.length !== nextProps.schedules.length) return false;
    return prevProps.schedules.every(
      (s, i) =>
        s.lecture.id === nextProps.schedules[i]?.lecture.id &&
        s.day === nextProps.schedules[i]?.day &&
        s.range[0] === nextProps.schedules[i]?.range[0],
    );
  },
);

export default ScheduleTable;
