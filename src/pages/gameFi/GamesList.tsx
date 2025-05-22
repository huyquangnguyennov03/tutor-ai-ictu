import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Button,
  Rating,
  Divider,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  useMediaQuery,
  useTheme,
  LinearProgress,
  Tooltip,
  Dialog,
  DialogContent,
  IconButton,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import { Game, GameCategory, DifficultyLevel, GameType } from '@/mockData/mockGameFi';

// Import game components
import QuizGame from './games/QuizGame';
import MemoryGame from './games/MemoryGame';
import CodingGame from './games/CodingGame';

interface GamesListProps {
  games: Game[];
  onStartGame: (gameId: string) => void;
}

const GamesList: React.FC<GamesListProps> = ({ games, onStartGame }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('rating');

  // State for game dialog
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [gameCompleted, setGameCompleted] = useState<{[key: string]: boolean}>({});
  const [earnedTokens, setEarnedTokens] = useState<{[key: string]: number}>({});

  // Playable games mapping
  const playableGames: {[key: string]: React.ComponentType<any>} = {
    'quiz-game': QuizGame,
    'memory-game': MemoryGame,
    'coding-game': CodingGame,
    // Add direct mappings for game types
    [GameType.QUIZ]: QuizGame,
    [GameType.MEMORY_GAME]: MemoryGame,
    [GameType.CODE_CHALLENGE]: CodingGame
  };

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle category filter change
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
  };

  // Handle difficulty filter change
  const handleDifficultyChange = (event: SelectChangeEvent) => {
    setDifficultyFilter(event.target.value);
  };

  // Handle type filter change
  const handleTypeChange = (event: SelectChangeEvent) => {
    setTypeFilter(event.target.value);
  };

  // Handle sort by change
  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  // Filter and sort games
  const filteredGames = games.filter(game => {
    // Search term filter
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    // Category filter
    const matchesCategory = categoryFilter === '' || game.category === categoryFilter;

    // Difficulty filter
    const matchesDifficulty = difficultyFilter === '' || game.difficulty === difficultyFilter;

    // Type filter
    const matchesType = typeFilter === '' || game.type === typeFilter;

    return matchesSearch && matchesCategory && matchesDifficulty && matchesType;
  }).sort((a, b) => {
    // Sort by selected criteria
    switch (sortBy) {
      case 'rating':
        return b.averageRating - a.averageRating;
      case 'popularity':
        return b.totalPlays - a.totalPlays;
      case 'completion':
        return b.completionRate - a.completionRate;
      case 'points':
        return b.points - a.points;
      default:
        return 0;
    }
  });

  // Get difficulty color
  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case DifficultyLevel.BEGINNER:
        return theme.palette.success.main;
      case DifficultyLevel.INTERMEDIATE:
        return theme.palette.info.main;
      case DifficultyLevel.ADVANCED:
        return theme.palette.warning.main;
      case DifficultyLevel.EXPERT:
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Box>
      {/* Search and Filters */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search games..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel 
                    id="category-filter-label" 
                    shrink={true}
                    sx={{ 
                      color: 'primary.main', 
                      fontWeight: 'bold',
                      fontSize: '0.85rem'
                    }}
                  >
                    Category
                  </InputLabel>
                  <Select
                    labelId="category-filter-label"
                    value={categoryFilter}
                    label="Category"
                    onChange={handleCategoryChange}
                    displayEmpty
                    notched
                    sx={{ 
                      '& .MuiSelect-select': { 
                        paddingTop: '8px', 
                        paddingBottom: '8px',
                        fontWeight: 'medium'
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.23)'
                      }
                    }}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {Object.values(GameCategory).map((category) => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel 
                    id="difficulty-filter-label" 
                    shrink={true}
                    sx={{ 
                      color: 'primary.main', 
                      fontWeight: 'bold',
                      fontSize: '0.85rem'
                    }}
                  >
                    Difficulty
                  </InputLabel>
                  <Select
                    labelId="difficulty-filter-label"
                    value={difficultyFilter}
                    label="Difficulty"
                    onChange={handleDifficultyChange}
                    displayEmpty
                    notched
                    sx={{ 
                      '& .MuiSelect-select': { 
                        paddingTop: '8px', 
                        paddingBottom: '8px',
                        fontWeight: 'medium'
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.23)'
                      }
                    }}
                  >
                    <MenuItem value="">All Difficulties</MenuItem>
                    {Object.values(DifficultyLevel).map((difficulty) => (
                      <MenuItem key={difficulty} value={difficulty}>{difficulty}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel 
                    id="type-filter-label" 
                    shrink={true}
                    sx={{ 
                      color: 'primary.main', 
                      fontWeight: 'bold',
                      fontSize: '0.85rem'
                    }}
                  >
                    Type
                  </InputLabel>
                  <Select
                    labelId="type-filter-label"
                    value={typeFilter}
                    label="Type"
                    onChange={handleTypeChange}
                    displayEmpty
                    notched
                    sx={{ 
                      '& .MuiSelect-select': { 
                        paddingTop: '8px', 
                        paddingBottom: '8px',
                        fontWeight: 'medium'
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.23)'
                      }
                    }}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    {Object.values(GameType).map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel 
                    id="sort-by-label" 
                    shrink={true}
                    sx={{ 
                      color: 'primary.main', 
                      fontWeight: 'bold',
                      fontSize: '0.85rem'
                    }}
                  >
                    Sort By
                  </InputLabel>
                  <Select
                    labelId="sort-by-label"
                    value={sortBy}
                    label="Sort By"
                    onChange={handleSortChange}
                    displayEmpty
                    notched
                    sx={{ 
                      '& .MuiSelect-select': { 
                        paddingTop: '8px', 
                        paddingBottom: '8px',
                        fontWeight: 'medium'
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.23)'
                      }
                    }}
                  >
                    <MenuItem value="rating">Highest Rated</MenuItem>
                    <MenuItem value="popularity">Most Popular</MenuItem>
                    <MenuItem value="completion">Completion Rate</MenuItem>
                    <MenuItem value="points">Highest Points</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {/* Results count */}
      <Box sx={{
        mb: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1,
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.paper'
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'primary.main' }}>
          Showing <strong>{filteredGames.length}</strong> of <strong>{games.length}</strong> games
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            icon={<FilterListIcon />}
            label={`Sort: ${sortBy === 'rating' ? 'Highest Rated' : 
                          sortBy === 'popularity' ? 'Most Popular' : 
                          sortBy === 'completion' ? 'Completion Rate' : 
                          'Highest Points'}`}
            variant="outlined"
            color="primary"
            size="small"
          />

          {(categoryFilter || difficultyFilter || typeFilter) ? (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {categoryFilter && (
                <Chip
                  label={`Category: ${categoryFilter}`}
                  size="small"
                  color="info"
                />
              )}

              {difficultyFilter && (
                <Chip
                  label={`Difficulty: ${difficultyFilter}`}
                  size="small"
                  color="warning"
                />
              )}

              {typeFilter && (
                <Chip
                  label={`Type: ${typeFilter}`}
                  size="small"
                  color="success"
                />
              )}
            </Box>
          ) : (
            <Chip
              label="All Games"
              size="small"
              variant="outlined"
              color="default"
            />
          )}
        </Box>
      </Box>

      {/* Games Grid */}
      <Grid container spacing={3}>
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <Grid item xs={12} sm={6} md={4} key={game.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={game.imageUrl || 'https://via.placeholder.com/300x140?text=Game+Image'}
                    alt={game.title}
                  />

                  {/* Badges for new and featured games */}
                  <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
                    {game.isNew && (
                      <Chip
                        icon={<NewReleasesIcon />}
                        label="New"
                        size="small"
                        color="secondary"
                      />
                    )}
                    {game.isFeatured && (
                      <Chip
                        icon={<FeaturedPlayListIcon />}
                        label="Featured"
                        size="small"
                        color="primary"
                      />
                    )}
                  </Box>

                  {/* Difficulty badge */}
                  <Chip
                    label={game.difficulty}
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      backgroundColor: getDifficultyColor(game.difficulty),
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {game.title}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      label={game.type}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={game.category}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {game.description.length > 100
                      ? `${game.description.substring(0, 100)}...`
                      : game.description}
                  </Typography>

                  <Box sx={{ mt: 'auto' }}>
                    <Divider sx={{ my: 1 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Tooltip title="Time limit">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {game.timeLimit} min
                          </Typography>
                        </Box>
                      </Tooltip>

                      <Tooltip title="Points reward">
                        <Chip
                          label={`${game.points} pts`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Tooltip>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating
                          value={game.averageRating}
                          precision={0.5}
                          size="small"
                          readOnly
                        />
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                          ({game.averageRating})
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="text.secondary">
                        {game.totalPlays} plays
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Completion Rate
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={game.completionRate}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => {
                        // Call the original onStartGame for tracking
                        onStartGame(game.id);

                        // Use the game type directly as the key
                        // This works because we've added direct mappings in playableGames
                        setSelectedGame(game.type);
                      }}
                      startIcon={<PlayArrowIcon />}
                    >
                      {gameCompleted[game.id] ? 'Play Again' : 'Start Game'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No games found matching your filters.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search criteria or filters.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Game Dialog */}
      <Dialog
        open={selectedGame !== null}
        fullScreen={isMobile}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            height: isMobile ? '100%' : '90vh',
            maxHeight: '90vh',
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={() => setSelectedGame(null)} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent dividers sx={{ p: 0 }}>
          {selectedGame && playableGames[selectedGame] ? (
            React.createElement(playableGames[selectedGame], {
              onFinish: (score: number, total: number) => {
                // Calculate tokens based on score and game
                let tokens = 0;

                if (selectedGame === 'quiz-game') {
                  tokens = score * 50; // 50 tokens per correct answer
                } else if (selectedGame === 'memory-game') {
                  tokens = Math.floor(score / 10); // Based on score calculation in MemoryGame
                } else if (selectedGame === 'coding-game') {
                  tokens = score * 100; // 100 tokens per completed challenge
                }

                // Update game completion status and tokens using game ID
                // Find the game that matches the selected type
                const matchingGame = games.find(g => g.type === selectedGame);
                if (matchingGame) {
                  setGameCompleted(prev => ({
                    ...prev,
                    [matchingGame.id]: true
                  }));

                  setEarnedTokens(prev => ({
                    ...prev,
                    [matchingGame.id]: tokens
                  }));
                } else {
                  // Fallback if no matching game is found
                  setGameCompleted(prev => ({
                    ...prev,
                    [selectedGame]: true
                  }));

                  setEarnedTokens(prev => ({
                    ...prev,
                    [selectedGame]: tokens
                  }));
                }

                // Close the dialog
                setSelectedGame(null);
              },
              onClose: () => setSelectedGame(null)
            })
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                This game is not available in the demo version.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => setSelectedGame(null)}
              >
                Close
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default GamesList;