import { memo } from 'react';
import {
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Stack,
} from '@chakra-ui/react';
import { Schedule } from '../../types';
import useAutoCallback from '../../hooks/useAutoCallback';
import ScheduleTable from './ScheduleTable';

interface ScheduleTableItemProps {
  tableId: string;
  schedules: Schedule[];
  index: number;
  disabledRemove: boolean;
  onAddClick: () => void;
  onDuplicateClick: () => void;
  onRemoveClick: () => void;
  onScheduleTimeClick: (timeInfo: { day: string; time: number }) => void;
  onDeleteSchedule: (timeInfo: { day: string; time: number }) => void;
}

const ScheduleTableItem = memo(
  ({
    tableId,
    schedules,
    index,
    disabledRemove,
    onAddClick,
    onDuplicateClick,
    onRemoveClick,
    onScheduleTimeClick,
    onDeleteSchedule,
  }: ScheduleTableItemProps) => {
    const handleScheduleTimeClick = useAutoCallback(
      (timeInfo: { day: string; time: number }) => {
        onScheduleTimeClick(timeInfo);
      },
    );

    const handleDeleteSchedule = useAutoCallback(
      (timeInfo: { day: string; time: number }) => {
        onDeleteSchedule(timeInfo);
      },
    );

    return (
      <Stack width="600px">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h3" fontSize="lg">
            시간표 {index + 1}
          </Heading>
          <ButtonGroup size="sm" isAttached>
            <Button colorScheme="green" onClick={onAddClick}>
              시간표 추가
            </Button>
            <Button colorScheme="green" mx="1px" onClick={onDuplicateClick}>
              복제
            </Button>
            <Button
              colorScheme="green"
              isDisabled={disabledRemove}
              onClick={onRemoveClick}
            >
              삭제
            </Button>
          </ButtonGroup>
        </Flex>
        <ScheduleTable
          tableId={tableId}
          schedules={schedules}
          onScheduleTimeClick={handleScheduleTimeClick}
          onDeleteButtonClick={handleDeleteSchedule}
        />
      </Stack>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.tableId === nextProps.tableId &&
      prevProps.index === nextProps.index &&
      prevProps.disabledRemove === nextProps.disabledRemove &&
      prevProps.schedules.length === nextProps.schedules.length &&
      prevProps.schedules.every(
        (s, i) =>
          s.lecture.id === nextProps.schedules[i]?.lecture.id &&
          s.day === nextProps.schedules[i]?.day &&
          s.range[0] === nextProps.schedules[i]?.range[0],
      )
    );
  },
);

export default ScheduleTableItem;
