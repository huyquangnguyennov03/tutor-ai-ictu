// src/pages/gameFi/games/MemoryGame.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Chip,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TimerIcon from '@mui/icons-material/Timer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { v4 as uuidv4 } from 'uuid';

// Styled components
const MemoryCard = styled(Card)<{ flipped: boolean; matched: boolean }>(
  ({ theme, flipped, matched }) => ({
    height: 120,
    cursor: matched ? 'default' : 'pointer',
    transition: 'all 0.3s ease',
    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
    transformStyle: 'preserve-3d',
    position: 'relative',
    backgroundColor: matched ? 'rgba(76, 175, 80, 0.1)' : theme.palette.background.paper,
    border: matched ? `1px solid ${theme.palette.success.main}` : `1px solid ${theme.palette.divider}`,
    '&:hover': {
      boxShadow: matched ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.1)',
      transform: flipped ? 'rotateY(180deg)' : matched ? 'rotateY(0)' : 'rotateY(10deg)',
    },
  })
);

const CardFront = styled(CardContent)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));

const CardBack = styled(CardContent)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  transform: 'rotateY(180deg)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  fontSize: '2rem',
}));

const ScoreChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  fontWeight: 'bold',
  fontSize: '1rem',
  padding: theme.spacing(2),
  height: 'auto',
}));

const TimerChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.warning.main,
  color: theme.palette.warning.contrastText,
  fontWeight: 'bold',
  fontSize: '1rem',
  padding: theme.spacing(2),
  height: 'auto',
}));

// Memory game items
const memoryItems = [
  { id: 1, content: '🚀', name: 'rocket' },
  { id: 2, content: '💻', name: 'computer' },
  { id: 3, content: '🔍', name: 'search' },
  { id: 4, content: '⚡', name: 'lightning' },
  { id: 5, content: '📱', name: 'mobile' },
  { id: 6, content: '⚙️', name: 'gear' },
  { id: 7, content: '📚', name: 'books' },
  { id: 8, content: '🔒', name: 'lock' },
];

// Create pairs of cards
const createMemoryCards = () => {
  const cards = [...memoryItems, ...memoryItems].map(item => ({
    ...item,
    uniqueId: uuidv4(),
    flipped: false,
    matched: false
  }));
  
  // Shuffle cards
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  
  return cards;
};

interface MemoryGameProps {
  onFinish: (score: number, totalPairs: number) => void;
  onClose: () => void;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ onFinish, onClose }) => {
  const theme = useTheme();
  const [cards, setCards] = useState(createMemoryCards());
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [gameOver, setGameOver] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const totalPairs = memoryItems.length;
  const progress = (matchedPairs / totalPairs) * 100;

  // Timer effect
  useEffect(() => {
    if (gameOver) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          setShowResults(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameOver]);
  
  // Check for game completion
  useEffect(() => {
    if (matchedPairs === totalPairs && !gameOver) {
      setGameOver(true);
      setShowResults(true);
    }
  }, [matchedPairs, totalPairs, gameOver]);
  
  // Handle card click
  const handleCardClick = (uniqueId: string) => {
    if (gameOver) return;
    
    // Don't allow clicking if two cards are already flipped and not yet processed
    if (flippedCards.length === 2) return;
    
    // Find the clicked card
    const clickedCard = cards.find(card => card.uniqueId === uniqueId);
    
    // Don't allow clicking if card is already flipped or matched
    if (!clickedCard || clickedCard.flipped || clickedCard.matched) return;
    
    // Flip the card
    setCards(prevCards => 
      prevCards.map(card => 
        card.uniqueId === uniqueId ? { ...card, flipped: true } : card
      )
    );
    
    // Add to flipped cards
    setFlippedCards(prev => [...prev, uniqueId]);
    
    // If this is the second card flipped, check for a match
    if (flippedCards.length === 1) {
      setMoves(prev => prev + 1);
      
      // Get the first flipped card
      const firstId = flippedCards[0];
      const firstCard = cards.find(card => card.uniqueId === firstId);
      
      // Check if the cards match
      if (firstCard && clickedCard.id === firstCard.id) {
        // Match found
        setCards(prevCards => 
          prevCards.map(card => 
            card.uniqueId === uniqueId || card.uniqueId === firstId
              ? { ...card, matched: true }
              : card
          )
        );
        setMatchedPairs(prev => prev + 1);
        setFlippedCards([]);
      } else {
        // No match, flip cards back after delay
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(card => 
              card.uniqueId === uniqueId || card.uniqueId === firstId
                ? { ...card, flipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };
  
  // Calculate score based on moves and time
  const calculateScore = () => {
    const baseScore = 1000;
    const timeBonus = timeLeft * 5;
    const movePenalty = moves * 10;
    
    return Math.max(0, baseScore + timeBonus - movePenalty);
  };
  
  // Handle restart game
  const handleRestartGame = () => {
    setCards(createMemoryCards());
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTimeLeft(120);
    setGameOver(false);
    setShowResults(false);
  };
  
  // Handle finish game
  const handleFinishGame = () => {
    onFinish(calculateScore(), totalPairs);
    onClose();
  };
  
  return (
    <Box sx={{ p: 3 }}>
      {!showResults ? (
        <>
          {/* Header with progress and score */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" component="h1" fontWeight="bold">
              Memory Game
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TimerChip 
                icon={<TimerIcon />} 
                label={`${timeLeft}s`} 
              />
              
              <Chip 
                label={`Moves: ${moves}`} 
                color="primary" 
                variant="outlined"
              />
              
              <Chip 
                label={`Pairs: ${matchedPairs}/${totalPairs}`} 
                color="secondary" 
                variant="outlined"
              />
            </Box>
          </Box>
          
          {/* Progress bar */}
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 8, borderRadius: 4, mb: 3 }}
          />
          
          {/* Game grid */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {cards.map((card) => (
              <Grid item xs={6} sm={3} md={3} key={card.uniqueId}>
                <MemoryCard 
                  flipped={card.flipped} 
                  matched={card.matched}
                  onClick={() => handleCardClick(card.uniqueId)}
                >
                  <CardFront>
                    <Typography variant="h4" color="text.secondary">?</Typography>
                  </CardFront>
                  <CardBack>
                    {card.content}
                  </CardBack>
                </MemoryCard>
              </Grid>
            ))}
          </Grid>
          
          {/* Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              variant="outlined" 
              onClick={onClose}
            >
              Quit Game
            </Button>
            
            <Button 
              variant="outlined" 
              color="secondary"
              onClick={handleRestartGame}
            >
              Restart Game
            </Button>
          </Box>
        </>
      ) : (
        <Dialog
          open={showResults}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
            <Typography variant="h4" component="div" fontWeight="bold">
              Game Over!
            </Typography>
          </DialogTitle>
          
          <DialogContent sx={{ textAlign: 'center', py: 3 }}>
            <Box>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {matchedPairs === totalPairs ? 'Congratulations!' : 'Time\'s up!'}
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 3 }}>
                {matchedPairs === totalPairs 
                  ? `You matched all ${totalPairs} pairs in ${moves} moves with ${timeLeft} seconds left!` 
                  : `You matched ${matchedPairs} out of ${totalPairs} pairs in ${moves} moves.`}
              </Typography>
              
              <ScoreChip 
                icon={<EmojiEventsIcon />} 
                label={`Score: ${calculateScore()}`} 
                sx={{ px: 3, py: 2, mb: 3 }}
              />
              
              <Typography variant="h6" sx={{ mb: 3 }}>
                Score: {calculateScore()}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                You've earned {Math.floor(calculateScore() / 10)} tokens!
              </Typography>
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={handleFinishGame}
            >
              Claim Rewards
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default MemoryGame;