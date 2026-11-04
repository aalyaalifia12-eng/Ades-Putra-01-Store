'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Trophy,
  Sparkles,
  Flame,
  RotateCcw,
  Coins,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CandyCrushGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimReward: (points: number) => void;
  currentPoints?: number;
}

interface CandyItem {
  id: string;
  type: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  name: string;
}

const CANDY_TYPES: Omit<CandyItem, 'id'>[] = [
  {
    type: 'sneakers',
    icon: '👟',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    name: 'Sneakers',
  },
  {
    type: 'heels',
    icon: '👠',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-300',
    name: 'High Heels',
  },
  {
    type: 'backpack',
    icon: '🎒',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    name: 'Tas Ransel',
  },
  {
    type: 'wallet',
    icon: '👛',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    name: 'Dompet',
  },
  {
    type: 'boots',
    icon: '🥾',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    name: 'Boots Gunung',
  },
  {
    type: 'diamond',
    icon: '💎',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-300',
    name: 'Koin Permata',
  },
];

const BOARD_SIZE = 6;
const TARGET_SCORE = 1500;
const INITIAL_MOVES = 12; // DIBUAT SUSAH: hanya 12 langkah untuk mencapai 1.500 poin!
const REWARD_POINTS = 1000; // 1 Koin Hadiah Game (= Rp 1.000 Diskon Belanja Langsung)

function getRandomCandy(): CandyItem {
  const template = CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)];
  return {
    ...template,
    id: `candy-${Math.random().toString(36).substring(2, 9)}`,
  };
}

export default function CandyCrushGameModal({
  isOpen,
  onClose,
  onClaimReward,
  currentPoints = 0,
}: CandyCrushGameModalProps) {
  const [board, setBoard] = useState<CandyItem[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [score, setScore] = useState<number>(0);
  const [movesLeft, setMovesLeft] = useState<number>(INITIAL_MOVES);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost' | 'claimed'>('playing');
  const [comboCount, setComboCount] = useState<number>(0);
  const [animatingMatches, setAnimatingMatches] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Sound Synthesizer via Web Audio API (Zero dependencies)
  const playSound = useCallback((type: 'match' | 'win' | 'select' | 'lose') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'select') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'match') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      } else if (type === 'win') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'lose') {
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch {
      // Audio not permitted or supported; continue silently
    }
  }, []);

  // Initialize board without existing matches
  const initBoard = useCallback(() => {
    let newBoard: CandyItem[][] = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      newBoard[r] = [];
      for (let c = 0; c < BOARD_SIZE; c++) {
        let candy: CandyItem;
        do {
          candy = getRandomCandy();
        } while (
          (r >= 2 && newBoard[r - 1][c].type === candy.type && newBoard[r - 2][c].type === candy.type) ||
          (c >= 2 && newBoard[r][c - 1].type === candy.type && newBoard[r][c - 2].type === candy.type)
        );
        newBoard[r][c] = candy;
      }
    }
    setBoard(newBoard);
    setSelectedCell(null);
    setScore(0);
    setMovesLeft(INITIAL_MOVES);
    setGameState('playing');
    setComboCount(0);
    setAnimatingMatches([]);
    setIsProcessing(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      initBoard();
    }
  }, [isOpen, initBoard]);

  // Find all matches on board
  const findMatches = (currentBoard: CandyItem[][]): { r: number; c: number }[] => {
    const matchedCoords: Set<string> = new Set();

    // Check horizontal
    for (let r = 0; r < BOARD_SIZE; r++) {
      let matchLen = 1;
      for (let c = 0; c < BOARD_SIZE; c++) {
        const isEnd = c === BOARD_SIZE - 1;
        const isSame = !isEnd && currentBoard[r][c].type === currentBoard[r][c + 1].type;
        if (isSame) {
          matchLen++;
        } else {
          if (matchLen >= 3) {
            for (let i = 0; i < matchLen; i++) {
              matchedCoords.add(`${r},${c - i}`);
            }
          }
          matchLen = 1;
        }
      }
    }

    // Check vertical
    for (let c = 0; c < BOARD_SIZE; c++) {
      let matchLen = 1;
      for (let r = 0; r < BOARD_SIZE; r++) {
        const isEnd = r === BOARD_SIZE - 1;
        const isSame = !isEnd && currentBoard[r][c].type === currentBoard[r + 1][c].type;
        if (isSame) {
          matchLen++;
        } else {
          if (matchLen >= 3) {
            for (let i = 0; i < matchLen; i++) {
              matchedCoords.add(`${r - i},${c}`);
            }
          }
          matchLen = 1;
        }
      }
    }

    return Array.from(matchedCoords).map((coord) => {
      const [r, c] = coord.split(',').map(Number);
      return { r, c };
    });
  };

  // Resolve matches and drop new candies
  const resolveBoard = useCallback(
    async (curBoard: CandyItem[][], currentScore: number, remainingMoves: number) => {
      let activeBoard = curBoard.map((row) => [...row]);
      let runningScore = currentScore;
      let cascadeCount = 0;

      while (true) {
        const matches = findMatches(activeBoard);
        if (matches.length === 0) break;

        cascadeCount++;
        playSound('match');

        // Highlight matching candies
        const matchedIds = matches.map((m) => activeBoard[m.r][m.c].id);
        setAnimatingMatches(matchedIds);

        // Score multiplier
        const pointsAdded = matches.length >= 5 ? 500 : matches.length === 4 ? 250 : 100 * matches.length / 3;
        const comboBonus = cascadeCount > 1 ? cascadeCount * 50 : 0;
        runningScore += Math.round(pointsAdded + comboBonus);
        setScore(runningScore);
        setComboCount(cascadeCount);

        // Short pause for match animation
        await new Promise((res) => setTimeout(res, 220));

        // Clear matched and drop down
        for (let c = 0; c < BOARD_SIZE; c++) {
          const colItems: CandyItem[] = [];
          for (let r = 0; r < BOARD_SIZE; r++) {
            const isMatched = matches.some((m) => m.r === r && m.c === c);
            if (!isMatched) {
              colItems.push(activeBoard[r][c]);
            }
          }
          // Fill from top with new candies
          const needed = BOARD_SIZE - colItems.length;
          const newCandies: CandyItem[] = [];
          for (let i = 0; i < needed; i++) {
            newCandies.push(getRandomCandy());
          }
          const fullCol = [...newCandies, ...colItems];
          for (let r = 0; r < BOARD_SIZE; r++) {
            activeBoard[r][c] = fullCol[r];
          }
        }

        setBoard(activeBoard.map((row) => [...row]));
        setAnimatingMatches([]);
        await new Promise((res) => setTimeout(res, 180));
      }

      // Check win / lose condition
      if (runningScore >= TARGET_SCORE) {
        setGameState('won');
        playSound('win');
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else if (remainingMoves <= 0) {
        setGameState('lost');
        playSound('lose');
      }

      setIsProcessing(false);
    },
    [playSound]
  );

  // Cell click handler
  const handleCellClick = async (r: number, c: number) => {
    if (isProcessing || gameState !== 'playing') return;

    if (!selectedCell) {
      setSelectedCell({ r, c });
      playSound('select');
      return;
    }

    const { r: prevR, c: prevC } = selectedCell;

    // Check if clicked the same cell (deselect)
    if (prevR === r && prevC === c) {
      setSelectedCell(null);
      return;
    }

    // Check if cells are adjacent
    const isAdjacent =
      (Math.abs(prevR - r) === 1 && prevC === c) ||
      (Math.abs(prevC - c) === 1 && prevR === r);

    if (!isAdjacent) {
      // Select the new cell instead
      setSelectedCell({ r, c });
      playSound('select');
      return;
    }

    // Execute swap
    setIsProcessing(true);
    setSelectedCell(null);

    const swappedBoard = board.map((row) => [...row]);
    const temp = swappedBoard[prevR][prevC];
    swappedBoard[prevR][prevC] = swappedBoard[r][c];
    swappedBoard[r][c] = temp;

    const matches = findMatches(swappedBoard);

    if (matches.length === 0) {
      // Invalid swap: visually swap then revert
      setBoard(swappedBoard);
      playSound('select');
      await new Promise((res) => setTimeout(res, 200));
      setBoard(board); // revert
      setIsProcessing(false);
      return;
    }

    // Valid move!
    const newMoves = movesLeft - 1;
    setMovesLeft(newMoves);
    setBoard(swappedBoard);
    await resolveBoard(swappedBoard, score, newMoves);
  };

  const handleClaim = () => {
    onClaimReward(REWARD_POINTS);
    setGameState('claimed');
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
    });
  };

  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.round((score / TARGET_SCORE) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      {/* Modal Container: Clean White dengan Red Line Border */}
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-2 border-red-500 overflow-hidden flex flex-col max-h-[95vh] text-slate-900">
        {/* Top Header: White with Red Line Accent */}
        <div className="px-5 py-3.5 bg-white border-b-2 border-red-500 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center text-xl shadow-md border border-red-700">
              🍬
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-black text-sm sm:text-base text-slate-900 leading-none">
                  Ades Sweet Crush
                </h3>
                <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded-full bg-red-600 text-white shadow-2xs">
                  Game Susah
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-none mt-1">
                Kumpulkan Koin Potongan Harga Belanja
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-black">
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              <span>Saldo: {currentPoints.toLocaleString('id-ID')} Poin</span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 border border-slate-200 text-slate-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dashboard Skor & Sisa Langkah (Moves) */}
        <div className="px-5 py-3 bg-slate-50 border-b border-red-200 grid grid-cols-3 gap-2 text-center text-xs">
          {/* Target Box */}
          <div className="bg-white p-2 rounded-2xl border border-red-200 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">
              Target Skor
            </span>
            <span className="text-sm font-black text-slate-900 mt-1 block">
              {TARGET_SCORE.toLocaleString()}
            </span>
          </div>

          {/* Sisa Langkah (Dibuat Susah) */}
          <div className="bg-white p-2 rounded-2xl border-2 border-red-500 shadow-2xs">
            <span className="text-[10px] text-red-600 font-black uppercase block leading-none flex items-center justify-center space-x-0.5">
              <Flame className="w-3 h-3 text-red-600 animate-pulse" />
              <span>Sisa Langkah</span>
            </span>
            <span
              className={`text-base font-black mt-0.5 block ${
                movesLeft <= 3 ? 'text-red-600 animate-bounce' : 'text-slate-900'
              }`}
            >
              {movesLeft} Moves
            </span>
          </div>

          {/* Skor Saat Ini */}
          <div className="bg-white p-2 rounded-2xl border border-red-200 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">
              Skor Anda
            </span>
            <span className="text-sm font-black text-red-600 mt-1 block">
              {score.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Target Progress Bar */}
        <div className="px-5 pt-2 pb-1 bg-white">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
            <span>Kemajuan Target Kemenangan:</span>
            <span className="text-red-600 font-black">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-red-200">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-rose-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Main Board Container */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col items-center justify-center bg-white overflow-y-auto">
          {/* Game Overlays (Won / Lost / Claimed) */}
          {gameState === 'won' && (
            <div className="w-full bg-gradient-to-br from-amber-50 via-white to-red-50 border-2 border-red-500 rounded-3xl p-6 text-center space-y-3 shadow-xl animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center text-3xl mx-auto shadow-lg border-2 border-red-400 animate-bounce">
                🏆
              </div>
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-red-600 text-white shadow-2xs">
                  Tantangan Berhasil Ditaklukkan!
                </span>
                <h4 className="text-xl font-black text-slate-900 mt-1">
                  Selamat, Anda Menang!
                </h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto mt-0.5">
                  Hebat! Anda berhasil meraih <b>{score.toLocaleString()} Poin</b> dalam game yang sulit ini!
                </p>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-red-300 max-w-xs mx-auto shadow-sm">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Hadiah Game:
                </span>
                <div className="flex items-center justify-center space-x-1.5 text-red-600 font-black text-base mt-0.5">
                  <Coins className="w-5 h-5 text-amber-500" />
                  <span>+1 Koin Hadiah (= Rp 1.000 Diskon)</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Koin dikumpulkan dan otomatis jadi potongan harga di keranjang belanja!
                </p>
              </div>

              <button
                onClick={handleClaim}
                className="w-full max-w-xs py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-lg shadow-red-600/30 transition-all transform active:scale-95 flex items-center justify-center space-x-2 mx-auto"
              >
                <Sparkles className="w-4 h-4" />
                <span>Klaim 1 Koin Belanja Sekarang &rarr;</span>
              </button>
            </div>
          )}

          {gameState === 'claimed' && (
            <div className="w-full bg-white border-2 border-emerald-500 rounded-3xl p-6 text-center space-y-3 shadow-xl animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center text-3xl mx-auto shadow-lg border-2 border-emerald-400">
                ✅
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-900">
                  Koin Berhasil Diklaim!
                </h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto mt-1">
                  Koin sudah masuk ke akun Anda. Anda bisa mengumpulkannya lagi atau langsung berbelanja sepatu, tas & buku!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  onClick={initBoard}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-colors flex items-center justify-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Main Lagi Kumpulkan Koin</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-colors shadow-sm"
                >
                  Belanja Pakai Koin &rarr;
                </button>
              </div>
            </div>
          )}

          {gameState === 'lost' && (
            <div className="w-full bg-slate-50 border-2 border-red-500 rounded-3xl p-6 text-center space-y-3 shadow-xl animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-3xl mx-auto border-2 border-slate-300">
                ⏳
              </div>
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                  Langkah Habis!
                </span>
                <h4 className="text-lg font-black text-slate-900 mt-1">
                  Skor Anda: {score.toLocaleString()} / {TARGET_SCORE.toLocaleString()}
                </h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto mt-0.5 leading-relaxed">
                  Game ini memang dibuat <b>susah dan menantang</b>! Coba lagi dan cari combo 4 atau 5 baris untuk ledakan skor besar!
                </p>
              </div>

              <button
                onClick={initBoard}
                className="w-full max-w-xs py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-lg shadow-red-600/30 transition-all transform active:scale-95 flex items-center justify-center space-x-2 mx-auto"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Coba Lagi (Main Ulang)</span>
              </button>
            </div>
          )}

          {/* Active 6x6 Candy Grid */}
          {gameState === 'playing' && (
            <div className="w-full max-w-xs sm:max-w-sm">
              <div className="bg-slate-50 p-2.5 rounded-3xl border-2 border-red-500 shadow-md">
                <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
                  {board.map((row, r) =>
                    row.map((item, c) => {
                      const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                      const isMatching = animatingMatches.includes(item.id);

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleCellClick(r, c)}
                          disabled={isProcessing}
                          className={`aspect-square rounded-2xl flex items-center justify-center text-xl sm:text-2xl transition-all duration-150 select-none relative ${
                            item.bgColor
                          } border ${item.borderColor} ${
                            isSelected
                              ? 'ring-4 ring-red-600 scale-105 z-10 shadow-lg bg-red-100'
                              : 'hover:scale-105 hover:shadow-xs active:scale-95'
                          } ${isMatching ? 'animate-ping opacity-75' : ''}`}
                          title={`${item.name} (${r},${c})`}
                        >
                          <span className="transform transition-transform">{item.icon}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Game Helper / Instructions */}
              <div className="mt-3 p-2.5 rounded-2xl bg-slate-50 border border-red-200 text-[10px] text-slate-600 flex items-start space-x-2">
                <HelpCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">
                    Cara Main: Klik 2 kotak bersebelahan untuk menukar posisi!
                  </p>
                  <p className="text-slate-500 mt-0.5">
                    Cocokkan 3 atau lebih simbol sejajar. Capai target 1.500 poin dalam 12 langkah untuk klaim Koin Diskon!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-5 py-3 bg-white border-t border-red-200 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-slate-500">
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px]">1 Koin = Rp 1.000 Potongan Belanja</span>
          </div>

          <button
            onClick={initBoard}
            className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center space-x-1 hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Papan Game</span>
          </button>
        </div>
      </div>
    </div>
  );
}
