
import React from 'react';
import { BoardGame } from '../types';

interface BoardGameCardProps {
  game: BoardGame;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export const BoardGameCard: React.FC<BoardGameCardProps> = ({ game, isSelected, onToggle }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border transition-all duration-200 overflow-hidden ${
        isSelected ? 'border-indigo-500 ring-2 ring-indigo-200 shadow-md' : 'border-gray-100'
      }`}
    >
      <div className="relative aspect-video">
        <img 
          src={game.image} 
          alt={game.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggle(game.id)}
            className="w-6 h-6 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
        </div>
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            game.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {game.available ? 'ว่าง' : 'ถูกยืม'}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-gray-900 text-lg leading-tight">{game.name}</h3>
          <span className="text-xs text-gray-400 font-medium">#{game.id}</span>
        </div>
        <p className="text-indigo-600 text-xs font-medium mb-2">{game.category}</p>
        <p className="text-gray-500 text-sm line-clamp-2">{game.description}</p>
      </div>
      
      <div className="px-4 pb-4">
        <button 
          onClick={() => onToggle(game.id)}
          className={`w-full py-2 rounded-lg font-medium text-sm transition-colors ${
            isSelected 
            ? 'bg-indigo-600 text-white' 
            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          {isSelected ? 'เลือกแล้ว' : 'เลือกยืมเกมนี้'}
        </button>
      </div>
    </div>
  );
};
