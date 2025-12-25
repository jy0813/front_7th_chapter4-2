import { DndContext, Modifier, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { PropsWithChildren, useMemo } from "react";
import { CellSize, DAY_LABELS } from "./constants.ts";
import { useScheduleActions } from "./context";
import useAutoCallback from "./hooks/useAutoCallback";

function createSnapModifier(): Modifier {
  return ({ transform, containerNodeRect, draggingNodeRect }) => {
    const containerTop = containerNodeRect?.top ?? 0;
    const containerLeft = containerNodeRect?.left ?? 0;
    const containerBottom = containerNodeRect?.bottom ?? 0;
    const containerRight = containerNodeRect?.right ?? 0;

    const { top = 0, left = 0, bottom = 0, right = 0 } = draggingNodeRect ?? {};

    const minX = containerLeft - left + 120 + 1;
    const minY = containerTop - top + 40 + 1;
    const maxX = containerRight - right;
    const maxY = containerBottom - bottom;


    return ({
      ...transform,
      x: Math.min(Math.max(Math.round(transform.x / CellSize.WIDTH) * CellSize.WIDTH, minX), maxX),
      y: Math.min(Math.max(Math.round(transform.y / CellSize.HEIGHT) * CellSize.HEIGHT, minY), maxY),
    })
  };
}

const modifiers = [createSnapModifier()]

export default function ScheduleDndProvider({ children }: PropsWithChildren) {
  // setSchedulesMap만 구독 - schedulesMap 변경에 리렌더링되지 않음
  const { setSchedulesMap } = useScheduleActions();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // 안정적인 핸들러 - 함수형 업데이트로 schedulesMap 직접 구독 제거
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = useAutoCallback((event: any) => {
    const { active, delta } = event;
    const { x, y } = delta;
    const [tableId, index] = active.id.split(':');
    const moveDayIndex = Math.floor(x / 80);
    const moveTimeIndex = Math.floor(y / 30);

    // 이동이 없으면 업데이트 스킵
    if (moveDayIndex === 0 && moveTimeIndex === 0) {
      return;
    }

    setSchedulesMap((prev) => {
      const targetSchedules = prev[tableId];
      if (!targetSchedules) return prev;

      const targetIndex = Number(index);
      const schedule = targetSchedules[targetIndex];
      if (!schedule) return prev;

      const nowDayIndex = DAY_LABELS.indexOf(schedule.day as typeof DAY_LABELS[number]);
      const newDay = DAY_LABELS[nowDayIndex + moveDayIndex];
      const newRange = schedule.range.map(time => time + moveTimeIndex);

      // 해당 테이블만 업데이트, 다른 테이블은 그대로 참조 유지
      return {
        ...prev,
        [tableId]: targetSchedules.map((s, i) => {
          // 변경되지 않은 스케줄은 원본 참조 유지
          if (i !== targetIndex) {
            return s;
          }
          // 변경된 스케줄만 새 객체 생성
          return {
            ...s,
            day: newDay,
            range: newRange,
          };
        }),
      };
    });
  });

  // sensors를 메모이제이션 (useSensors 결과는 이미 stable하지만 명시적으로)
  const memoizedSensors = useMemo(() => sensors, [sensors]);

  return (
    <DndContext sensors={memoizedSensors} onDragEnd={handleDragEnd} modifiers={modifiers}>
      {children}
    </DndContext>
  );
}
