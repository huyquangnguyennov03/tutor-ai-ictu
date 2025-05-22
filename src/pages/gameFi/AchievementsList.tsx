import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Button,
  Avatar,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Divider,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Achievement } from '@/mockData/mockGameFi';

// Styled components
const AchievementCard = styled(Card)(({ theme, unlocked }: { theme: any, unlocked: boolean }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  opacity: unlocked ? 1 : 0.7,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  }
}));

const AchievementAvatar = styled(Avatar)(({ theme, unlocked, rarity }: { theme: any, unlocked: boolean, rarity: string }) => {
  let borderColor;
  switch (rarity) {
    case 'Common':
      borderColor = theme.palette.success.main;
      break;
    case 'Uncommon':
      borderColor = theme.palette.info.main;
      break;
    case 'Rare':
      borderColor = theme.palette.primary.main;
      break;
    case 'Epic':
      borderColor = theme.palette.secondary.main;
      break;
    case 'Legendary':
      borderColor = theme.palette.warning.main;
      break;
    default:
      borderColor = theme.palette.grey[500];
  }
  
  return {
    width: 80,
    height: 80,
    margin: '0 auto',
    marginBottom: theme.spacing(2),
    border: `3px solid ${borderColor}`,
    boxShadow: unlocked ? `0 0 10px ${borderColor}` : 'none',
    filter: unlocked ? 'none' : 'grayscale(100%)',
  };
});

const RarityChip = styled(Chip)(({ theme, rarity }: { theme: any, rarity: string }) => {
  let color;
  switch (rarity) {
    case 'Common':
      color = theme.palette.success.main;
      break;
    case 'Uncommon':
      color = theme.palette.info.main;
      break;
    case 'Rare':
      color = theme.palette.primary.main;
      break;
    case 'Epic':
      color = theme.palette.secondary.main;
      break;
    case 'Legendary':
      color = theme.palette.warning.main;
      break;
    default:
      color = theme.palette.grey[500];
  }
  
  return {
    backgroundColor: color,
    color: '#fff',
    fontWeight: 'bold',
  };
});

interface AchievementsListProps {
  achievements: Achievement[];
  onClaimAchievement: (achievementId: string) => void;
}

const AchievementsList: React.FC<AchievementsListProps> = ({ achievements, onClaimAchievement }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for tabs
  const [tabValue, setTabValue] = useState(0);
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [rarityFilter, setRarityFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Update status filter based on tab selection
    switch (newValue) {
      case 0: // All
        setStatusFilter('all');
        break;
      case 1: // Unlocked
        setStatusFilter('unlocked');
        break;
      case 2: // In Progress
        setStatusFilter('in_progress');
        break;
      case 3: // Locked
        setStatusFilter('locked');
        break;
    }
  };
  
  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  // Handle category filter change
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
  };
  
  // Handle rarity filter change
  const handleRarityChange = (event: SelectChangeEvent) => {
    setRarityFilter(event.target.value);
  };
  
  // Handle status filter change
  const handleStatusChange = (event: SelectChangeEvent) => {
    const newStatus = event.target.value;
    setStatusFilter(newStatus);
    
    // Update tab value based on status filter
    switch (newStatus) {
      case 'all':
        setTabValue(0);
        break;
      case 'unlocked':
        setTabValue(1);
        break;
      case 'in_progress':
        setTabValue(2);
        break;
      case 'locked':
        setTabValue(3);
        break;
    }
  };
  
  // Get unique categories
  const categories = [...new Set(achievements.map(achievement => achievement.category))];
  
  // Get unique rarities
  const rarities = [...new Set(achievements.map(achievement => achievement.rarity))];
  
  // Filter achievements
  const filteredAchievements = achievements.filter(achievement => {
    // Search term filter
    const matchesSearch = achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === '' || achievement.category === categoryFilter;
    
    // Rarity filter
    const matchesRarity = rarityFilter === '' || achievement.rarity === rarityFilter;
    
    // Status filter
    const isInProgress = !achievement.isUnlocked && achievement.progress > 0 && achievement.progress < 100;
    const matchesStatus = statusFilter === 'all' ||
                          (statusFilter === 'unlocked' && achievement.isUnlocked) ||
                          (statusFilter === 'in_progress' && isInProgress) ||
                          (statusFilter === 'locked' && !achievement.isUnlocked && achievement.progress === 0);
    
    return matchesSearch && matchesCategory && matchesRarity && matchesStatus;
  });
  
  // Get achievement counts
  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(achievement => achievement.isUnlocked).length;
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Achievements
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Progress:
          </Typography>
          <Chip 
            label={`${unlockedAchievements}/${totalAchievements}`} 
            color="primary" 
            size="small"
          />
        </Box>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search achievements..."
              size="small"
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
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="category-filter-label">Category</InputLabel>
                  <Select
                    labelId="category-filter-label"
                    value={categoryFilter}
                    label="Category"
                    onChange={handleCategoryChange}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="rarity-filter-label">Rarity</InputLabel>
                  <Select
                    labelId="rarity-filter-label"
                    value={rarityFilter}
                    label="Rarity"
                    onChange={handleRarityChange}
                  >
                    <MenuItem value="">All Rarities</MenuItem>
                    {rarities.map((rarity) => (
                      <MenuItem key={rarity} value={rarity}>{rarity}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    value={statusFilter}
                    label="Status"
                    onChange={handleStatusChange}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="unlocked">Unlocked</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="locked">Locked</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant={isMobile ? "scrollable" : "fullWidth"}
        scrollButtons={isMobile ? "auto" : undefined}
        allowScrollButtonsMobile
        aria-label="achievement tabs"
        sx={{ mb: 3 }}
      >
        <Tab label="All" />
        <Tab label="Unlocked" />
        <Tab label="In Progress" />
        <Tab label="Locked" />
      </Tabs>
      
      <Grid container spacing={3}>
        {filteredAchievements.length > 0 ? (
          filteredAchievements.map((achievement) => (
            <Grid item xs={12} sm={6} md={4} key={achievement.id}>
              <AchievementCard unlocked={achievement.isUnlocked}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <Box sx={{ position: 'relative' }}>
                    <AchievementAvatar
                      src={achievement.imageUrl || 'https://via.placeholder.com/80?text=Achievement'}
                      alt={achievement.name}
                      unlocked={achievement.isUnlocked}
                      rarity={achievement.rarity}
                    />
                    {!achievement.isUnlocked && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          borderRadius: '50%',
                          width: 40,
                          height: 40,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <LockIcon sx={{ color: 'white' }} />
                      </Box>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <RarityChip
                      label={achievement.rarity}
                      size="small"
                      rarity={achievement.rarity}
                    />
                  </Box>
                  
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {achievement.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {achievement.description}
                  </Typography>
                  
                  <Divider sx={{ width: '100%', my: 1 }} />
                  
                  <Box sx={{ width: '100%', mt: 1, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        Progress
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {achievement.currentValue}/{achievement.requiredValue}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={achievement.progress} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  
                  <Button
                    variant="contained"
                    color={achievement.isUnlocked ? "success" : "primary"}
                    startIcon={achievement.isUnlocked ? <LockOpenIcon /> : <LockIcon />}
                    disabled={!achievement.isUnlocked}
                    onClick={() => onClaimAchievement(achievement.id)}
                    fullWidth
                  >
                    {achievement.isUnlocked ? 'Claim Reward' : 'Locked'}
                  </Button>
                </CardContent>
              </AchievementCard>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No achievements found matching your filters.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search criteria or filters.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AchievementsList;