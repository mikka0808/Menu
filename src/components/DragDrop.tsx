import type { ReactNode } from 'react';
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable
} from '@dnd-kit/core';

const mergeClasses = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

export interface PlannerDragDropProps {
  onDragEnd: (event: DragEndEvent) => void;
  children: ReactNode;
}

export const PlannerDragDrop = ({ children, onDragEnd }: PlannerDragDropProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd} autoScroll={false}>
      {children}
    </DndContext>
  );
};

export interface DroppableCellProps {
  id: string;
  label: string;
  className?: string;
  children: ReactNode;
}

export const DroppableCell = ({ id, label, className, children }: DroppableCellProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      role="gridcell"
      aria-label={label}
      tabIndex={0}
      className={mergeClasses(
        'relative rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
        isOver && 'ring-2 ring-indigo-500 ring-offset-2 shadow-md',
        className
      )}
      data-over={isOver}
    >
      {children}
    </div>
  );
};

export interface DraggableMealProps {
  id: string;
  label: string;
  children: ReactNode;
}

export const DraggableMeal = ({ id, label, children }: DraggableMealProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={mergeClasses(
        'flex h-full flex-col justify-between gap-2 rounded-lg bg-indigo-50 p-3 text-left text-sm font-medium text-indigo-900 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
        isDragging && 'opacity-80'
      )}
      aria-label={label}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
};
