import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Button,
  TextField,
  InputAdornment
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { LeaderboardEntry } from '@/mockData/mockGameFi';

// Styled components
const RankCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  width: '60px',
}));

const UserCell = styled(TableCell)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const ScoreCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
}));

const TopRankChip = styled(Chip)(({ theme, rank }: { theme: any, rank: number }) => {
  let color;
  switch (rank) {
    case 1:
      color = theme.palette.warning.main; // Gold
      break;
    case 2:
      color = theme.palette.grey[400]; // Silver
      break;
    case 3:
      color = theme.palette.warning.light; // Bronze
      break;
    default:
      color = theme.palette.primary.main;
  }
  
  return {
    backgroundColor: color,
    color: '#fff',
    fontWeight: 'bold',
    width: '36px',
    height: '36px',
  };
});

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboard }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for tabs
  const [tabValue, setTabValue] = useState(0);
  
  // State for search
  const [searchTerm, setSearchTerm] = useState('');
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  // Filter leaderboard by search term
  const filteredLeaderboard = leaderboard.filter(entry => 
    entry.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get trophy icon for top 3 ranks
  const getTrophyIcon = (rank: number) => {
    if (rank === 1) {
      return <EmojiEventsIcon sx={{ color: theme.palette.warning.main }} />;
    } else if (rank === 2) {
      return <EmojiEventsIcon sx={{ color: theme.palette.grey[400] }} />;
    } else if (rank === 3) {
      return <EmojiEventsIcon sx={{ color: theme.palette.warning.light }} />;
    }
    return null;
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Leaderboard
        </Typography>
        
        <TextField
          placeholder="Search players..."
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
          sx={{ width: { xs: '100%', sm: '250px' } }}
        />
      </Box>
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : undefined}
          allowScrollButtonsMobile
          aria-label="Leaderboard tabs"
        >
          <Tab label="Global" />
          <Tab label="Friends" />
          <Tab label="Weekly" />
          <Tab label="Monthly" />
        </Tabs>
        
        <TableContainer>
          <Table aria-label="leaderboard table">
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Player</TableCell>
                {!isMobile && <TableCell align="center">Level</TableCell>}
                {!isMobile && <TableCell align="center">Badges</TableCell>}
                <TableCell align="right">Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeaderboard.map((entry) => (
                <TableRow
                  key={entry.id}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    backgroundColor: entry.isCurrentUser ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
                  }}
                >
                  <RankCell>
                    {entry.rank <= 3 ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TopRankChip
                          label={entry.rank}
                          rank={entry.rank}
                        />
                      </Box>
                    ) : (
                      entry.rank
                    )}
                  </RankCell>
                  
                  <UserCell>
                    <Avatar 
                      src={entry.avatarUrl} 
                      alt={entry.username}
                      sx={{ 
                        width: 40, 
                        height: 40,
                        border: entry.isCurrentUser ? `2px solid ${theme.palette.primary.main}` : 'none'
                      }}
                    />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: entry.isCurrentUser ? 'bold' : 'normal' }}>
                        {entry.username}
                      </Typography>
                      {entry.isCurrentUser && (
                        <Typography variant="caption" color="primary">
                          You
                        </Typography>
                      )}
                    </Box>
                  </UserCell>
                  
                  {!isMobile && (
                    <TableCell align="center">
                      <Chip 
                        label={entry.level} 
                        color="primary" 
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                  )}
                  
                  {!isMobile && (
                    <TableCell align="center">
                      <Chip 
                        label={entry.badges} 
                        color="secondary" 
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                  )}
                  
                  <ScoreCell align="right">
                    {entry.score.toLocaleString()}
                  </ScoreCell>
                </TableRow>
              ))}
              
              {filteredLeaderboard.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isMobile ? 3 : 5} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No players found matching your search.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button variant="outlined">
          View Full Leaderboard
        </Button>
      </Box>
    </Box>
  );
};

export default Leaderboard;