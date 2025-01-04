'use client';

import { motion } from 'framer-motion';
import { Cloud, Newspaper, TrendingUp, Github, Film, Music } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

type WidgetType = 'weather' | 'news' | 'finance' | 'github' | 'movie';

interface Widget {
  type: WidgetType;
  title: string;
  color: string;
}

const icons: Record<WidgetType, React.ReactNode> = {
  weather: <Cloud className="h-14 w-14" />,
  news: <Newspaper className="h-14 w-14" />,
  finance: <TrendingUp className="h-14 w-14" />,
  github: <Github className="h-14 w-14" />,
  movie: <Film className="h-14 w-14" />,
};

const initialWidgets: Widget[] = [
  { type: 'weather', title: 'Weather', color: 'from-blue-400 to-cyan-300' },
  { type: 'news', title: 'News', color: 'from-green-400 to-emerald-300' },
  { type: 'finance', title: 'Finance', color: 'from-purple-400 to-pink-300' },
  { type: 'github', title: 'GitHub', color: 'from-gray-600 to-gray-400' },
  { type: 'movie', title: 'Movies', color: 'from-red-400 to-orange-300' },
];

interface DraggableWidgetProps {
  widget: Widget;
  index: number;
  moveWidget: (fromIndex: number, toIndex: number) => void;
  onSelect: (widget: WidgetType) => void;
}
const DraggableWidget = ({ widget, index, moveWidget, onSelect }: DraggableWidgetProps) => {
  const [, dragRef] = useDrag(() => ({
    type: 'widget',
    item: { index },
  }));

  const [, dropRef] = useDrop(() => ({
    accept: 'widget',
    hover: (item: { index: number }, monitor) => {
      if (!monitor.isOver({ shallow: true })) return;
      const draggedIndex = item.index;
      if (draggedIndex !== index) {
        moveWidget(draggedIndex, index);
        item.index = index;
      }
    },
  }));

  return (
    <motion.div
      ref={(node) => dragRef(dropRef(node))}
      className={`w-full p-6 rounded-xl bg-gradient-to-br ${widget.color} text-white shadow-lg transition-all duration-300 cursor-pointer`}
      onClick={() => onSelect(widget.type)}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div>{icons[widget.type]}</div>
        <h3 className="text-xl font-semibold">{widget.title}</h3>
      </div>
    </motion.div>
  );
};

export function WidgetSelector({ onSelect }: { onSelect: (widget: WidgetType) => void }) {
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    const savedOrder = localStorage.getItem('widgetsOrder');
    return savedOrder ? JSON.parse(savedOrder) : initialWidgets;
  });

  useEffect(() => {
    localStorage.setItem('widgetsOrder', JSON.stringify(widgets));
  }, [widgets]);

  const moveWidget = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setWidgets((prevWidgets) => {
      const updatedWidgets = [...prevWidgets];
      const [movedWidget] = updatedWidgets.splice(fromIndex, 1);
      updatedWidgets.splice(toIndex, 0, movedWidget);
      return updatedWidgets;
    });
  };


  const resetToDefault = () => {
    setWidgets(initialWidgets);
    localStorage.removeItem('widgetsOrder');
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={resetToDefault}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Reset to Default
        </button>
      </div>
      <DndProvider backend={HTML5Backend}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {widgets.map((widget, index) => (
            <DraggableWidget
              key={widget.type}
              widget={widget}
              index={index}
              moveWidget={moveWidget}
              onSelect={onSelect}
            />
          ))}
        </div>
      </DndProvider>
    </div>
  );
}
