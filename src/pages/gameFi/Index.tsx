import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Tabs,
  Tab,
  useMediaQuery,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';

// Import components
import GameFiHeader from './GameFiHeader';
import UserProfile from './UserProfile';
import GamesList from './GamesList';
import QuestsList from './QuestsList';
import Leaderboard from './Leaderboard';
import AchievementsList from './AchievementsList';
import DailyChallenges from './DailyChallenges';
import LearningPaths from './LearningPaths';

// Import mock data
import {
  mockGames,
  mockQuests,
  mockAchievements,
  mockLeaderboard,
  mockUserProfile,
  mockDailyChallenges as mockDailyChallengesData,
  mockLearningPaths as mockLearningPathsData
} from '@/mockData/mockGameFi';

// Import types
import { Game, Quest, Achievement, LeaderboardEntry, GameFiProfile } from '@/mockData/mockGameFi';

// Interface for tab panel props
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Tab Panel component
const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`gamefi-tabpanel-${index}`}
      aria-labelledby={`gamefi-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
};

// Function to get props for tabs
const a11yProps = (index: number) => {
  return {
    id: `gamefi-tab-${index}`,
    'aria-controls': `gamefi-tabpanel-${index}`,
  };
};

const GameFi: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  // State for tabs
  const [tabValue, setTabValue] = useState(0);

  // State for data
  const [games, setGames] = useState<Game[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userProfile, setUserProfile] = useState<GameFiProfile | null>(null);
  const [dailyChallenges, setDailyChallenges] = useState<any[]>([]);
  const [learningPaths, setLearningPaths] = useState<any[]>([]);

  // State for loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for notifications
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Show notification
  const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // In a real application, these would be API calls
        // For now, we're using mock data with a timeout to simulate API calls
        setTimeout(() => {
          setGames(mockGames);
          setQuests(mockQuests);
          setAchievements(mockAchievements);
          setLeaderboard(mockLeaderboard);
          setUserProfile(mockUserProfile);
          setDailyChallenges(mockDailyChallengesData);
          setLearningPaths(mockLearningPathsData);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load GameFi data. Please try again later.');
        setLoading(false);
        console.error('Error loading GameFi data:', err);
      }
    };

    fetchData();
  }, []);

  // Handle starting a game
  const handleStartGame = (gameId: string) => {
    showNotification(`Starting game session for game ID: ${gameId}`);
    // In a real application, this would navigate to the game or start a game session
    console.log('Starting game:', gameId);
  };

  // Handle starting a quest
  const handleStartQuest = (questId: string) => {
    showNotification(`Quest started: ${questId}`, 'info');
    // In a real application, this would update the quest status in the backend
    console.log('Starting quest:', questId);
  };

  // Handle claiming an achievement
  const handleClaimAchievement = (achievementId: string) => {
    showNotification('Achievement claimed successfully!');
    // In a real application, this would update the achievement status in the backend
    console.log('Claiming achievement:', achievementId);
  };

  // Handle starting a daily challenge
  const handleStartDailyChallenge = (challengeId: string) => {
    showNotification('Daily challenge started!', 'info');
    // In a real application, this would start the daily challenge
    console.log('Starting daily challenge:', challengeId);
  };

  // Handle joining a learning path
  const handleJoinLearningPath = (pathId: string) => {
    showNotification('You have joined the learning path!', 'success');
    // In a real application, this would enroll the user in the learning path
    console.log('Joining learning path:', pathId);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading GameFi Platform...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error" sx={{ width: '80%', maxWidth: 600 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{
      flexGrow: 1,
      bgcolor: theme => theme.palette.background.default,
      minHeight: '100vh',
      pb: 4
    }}>
      <Container maxWidth="xl" disableGutters>
        <GameFiHeader />

        <Grid container sx={{ mt: 2 }}>
          {!isMobile && (
            <Grid item xs={12} md={3} sx={{ pr: 2 }}>
              <UserProfile profile={userProfile} />
              <Box sx={{ mt: 3 }}>
                <DailyChallenges
                  challenges={dailyChallenges}
                  onStartChallenge={handleStartDailyChallenge}
                />
              </Box>
            </Grid>
          )}

          {/* Main Content Area */}
          <Grid item xs={12} md={9}>
            <Paper sx={{ width: '100%' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant={isMobile ? "scrollable" : "fullWidth"}
                scrollButtons={isMobile ? "auto" : undefined}
                allowScrollButtonsMobile
                aria-label="GameFi navigation tabs"
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: theme.typography.fontWeightMedium,
                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                  }
                }}
              >
                <Tab label="Games" {...a11yProps(0)} />
                <Tab label="Quests" {...a11yProps(1)} />
                <Tab label="Learning Paths" {...a11yProps(2)} />
                <Tab label="Achievements" {...a11yProps(3)} />
                <Tab label="Leaderboard" {...a11yProps(4)} />
                {isMobile && <Tab label="Profile" {...a11yProps(5)} />}
                {isMobile && <Tab label="Daily Challenges" {...a11yProps(6)} />}
              </Tabs>

              {/* Games Tab */}
              <TabPanel value={tabValue} index={0}>
                <GamesList games={games} onStartGame={handleStartGame} />
              </TabPanel>

              {/* Quests Tab */}
              <TabPanel value={tabValue} index={1}>
                <QuestsList quests={quests} onStartQuest={handleStartQuest} />
              </TabPanel>

              {/* Learning Paths Tab */}
              <TabPanel value={tabValue} index={2}>
                <LearningPaths
                  learningPaths={learningPaths}
                  onJoinLearningPath={handleJoinLearningPath}
                />
              </TabPanel>

              {/* Achievements Tab */}
              <TabPanel value={tabValue} index={3}>
                <AchievementsList
                  achievements={achievements}
                  onClaimAchievement={handleClaimAchievement}
                />
              </TabPanel>

              {/* Leaderboard Tab */}
              <TabPanel value={tabValue} index={4}>
                <Leaderboard leaderboard={leaderboard} />
              </TabPanel>

              {/* Mobile-only Profile Tab */}
              {isMobile && (
                <TabPanel value={tabValue} index={5}>
                  <UserProfile profile={userProfile} />
                </TabPanel>
              )}

              {/* Mobile-only Daily Challenges Tab */}
              {isMobile && (
                <TabPanel value={tabValue} index={6}>
                  <DailyChallenges
                    challenges={dailyChallenges}
                    onStartChallenge={handleStartDailyChallenge}
                  />
                </TabPanel>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GameFi;