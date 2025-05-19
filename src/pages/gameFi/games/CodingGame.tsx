// src/pages/gameFi/games/CodingGame.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Chip,
  Tabs,
  Tab,
  useTheme,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TimerIcon from '@mui/icons-material/Timer';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';

// Styled components
const CodeEditor = styled(TextField)(({ theme }) => ({
  fontFamily: 'monospace',
  '& .MuiInputBase-root': {
    fontFamily: 'monospace',
    fontSize: '14px',
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(2),
  }
}));

const ConsoleOutput = styled(Paper)(({ theme }) => ({
  backgroundColor: '#1e1e1e',
  color: '#ffffff',
  padding: theme.spacing(2),
  fontFamily: 'monospace',
  fontSize: '14px',
  height: '150px',
  overflowY: 'auto',
  '& .success': {
    color: theme.palette.success.light,
  },
  '& .error': {
    color: theme.palette.error.light,
  },
  '& .info': {
    color: theme.palette.info.light,
  }
}));

const TimerChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.warning.main,
  color: theme.palette.warning.contrastText,
  fontWeight: 'bold',
  fontSize: '1rem',
  padding: theme.spacing(1),
  height: 'auto',
}));

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
      id={`coding-tabpanel-${index}`}
      aria-labelledby={`coding-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

// Function to get props for tabs
const a11yProps = (index: number) => {
  return {
    id: `coding-tab-${index}`,
    'aria-controls': `coding-tabpanel-${index}`,
  };
};

// Coding challenges
const codingChallenges = [
  {
    id: 1,
    title: 'Tìm số lớn nhất trong mảng',
    description: 'Viết hàm findMax để tìm số lớn nhất trong một mảng số nguyên.',
    initialCode: 
`function findMax(arr) {
  // Viết code của bạn ở đây
  
}

// Không sửa code bên dưới
return findMax([3, 7, 2, 9, 1, 5]);`,
    expectedOutput: '9',
    hint: 'Bạn có thể sử dụng vòng lặp để duyệt qua mảng và theo dõi giá trị lớn nhất đã tìm thấy.',
    solution: 
`function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

return findMax([3, 7, 2, 9, 1, 5]);`
  },
  {
    id: 2,
    title: 'Đảo ngược chuỗi',
    description: 'Viết hàm reverseString để đảo ngược một chuỗi đầu vào.',
    initialCode: 
`function reverseString(str) {
  // Viết code của bạn ở đây
  
}

// Không sửa code bên dưới
return reverseString("hello");`,
    expectedOutput: 'olleh',
    hint: 'Bạn có thể chuyển chuỗi thành mảng, đảo ngược mảng, sau đó nối lại thành chuỗi.',
    solution: 
`function reverseString(str) {
  return str.split('').reverse().join('');
}

return reverseString("hello");`
  },
  {
    id: 3,
    title: 'Kiểm tra số nguyên tố',
    description: 'Viết hàm isPrime để kiểm tra xem một số có phải là số nguyên tố hay không.',
    initialCode: 
`function isPrime(num) {
  // Viết code của bạn ở đây
  
}

// Không sửa code bên dưới
return isPrime(7) ? "true" : "false";`,
    expectedOutput: 'true',
    hint: 'Một số nguyên tố chỉ chia hết cho 1 và chính nó. Kiểm tra từ 2 đến căn bậc hai của số đó.',
    solution: 
`function isPrime(num) {
  if (num <= 1) return false;
  if (num <= 3) return true;
  
  if (num % 2 === 0 || num % 3 === 0) return false;
  
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  
  return true;
}

return isPrime(7) ? "true" : "false";`
  }
];

interface CodingGameProps {
  onFinish: (score: number, totalChallenges: number) => void;
  onClose: () => void;
}

const CodingGame: React.FC<CodingGameProps> = ({ onFinish, onClose }) => {
  const theme = useTheme();
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<{text: string, type: 'success' | 'error' | 'info'}[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes per challenge
  const [gameOver, setGameOver] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  
  const currentChallenge = codingChallenges[currentChallengeIndex];
  const progress = ((currentChallengeIndex + 1) / codingChallenges.length) * 100;

  // Initialize code when challenge changes
  useEffect(() => {
    setCode(currentChallenge.initialCode);
    setOutput([{ text: 'Console output will appear here...', type: 'info' }]);
    setShowHint(false);
  }, [currentChallengeIndex]);

  // Timer effect
  useEffect(() => {
    if (gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver, currentChallengeIndex]);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle code change
  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

  // Handle time up
  const handleTimeUp = () => {
    if (!completedChallenges.includes(currentChallenge.id)) {
      setOutput(prev => [
        ...prev, 
        { text: 'Hết thời gian! Bạn có thể tiếp tục thử hoặc chuyển sang thử thách tiếp theo.', type: 'error' }
      ]);
    }
  };

  // Handle run code
  const handleRunCode = () => {
    try {
      setOutput([{ text: 'Đang chạy code...', type: 'info' }]);
      
      // Create a function from the code string and execute it
      const result = new Function(code)();
      
      // Check if result matches expected output
      if (result.toString() === currentChallenge.expectedOutput) {
        setOutput([
          { text: `Output: ${result}`, type: 'success' },
          { text: 'Chính xác! Bạn đã giải quyết thử thách này.', type: 'success' }
        ]);
        
        if (!completedChallenges.includes(currentChallenge.id)) {
          setCompletedChallenges(prev => [...prev, currentChallenge.id]);
        }
      } else {
        setOutput([
          { text: `Output: ${result}`, type: 'error' },
          { text: `Kết quả mong đợi: ${currentChallenge.expectedOutput}`, type: 'info' },
          { text: 'Chưa chính xác. Hãy thử lại!', type: 'error' }
        ]);
      }
    } catch (error) {
      setOutput([
        { text: `Lỗi: ${error instanceof Error ? error.message : String(error)}`, type: 'error' },
        { text: 'Kiểm tra lại code của bạn và thử lại.', type: 'error' }
      ]);
    }
  };

  // Handle reset code
  const handleResetCode = () => {
    setCode(currentChallenge.initialCode);
    setOutput([{ text: 'Code đã được reset.', type: 'info' }]);
  };

  // Handle show hint
  const handleShowHint = () => {
    setShowHint(true);
  };

  // Handle show solution
  const handleShowSolution = () => {
    setCode(currentChallenge.solution);
    setOutput(prev => [...prev, { text: 'Đã hiển thị giải pháp.', type: 'info' }]);
  };

  // Handle next challenge
  const handleNextChallenge = () => {
    if (currentChallengeIndex < codingChallenges.length - 1) {
      setCurrentChallengeIndex(prev => prev + 1);
      setTimeLeft(300);
    } else {
      setGameOver(true);
      setShowResults(true);
    }
  };

  // Handle finish game
  const handleFinishGame = () => {
    onFinish(completedChallenges.length, codingChallenges.length);
    onClose();
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      {!showResults ? (
        <>
          {/* Header with progress and timer */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" component="h1" fontWeight="bold">
              Coding Challenge: {currentChallenge.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Chip 
                icon={<CheckCircleIcon />}
                label={`${completedChallenges.length}/${codingChallenges.length} Hoàn thành`} 
                color="success"
              />
              <TimerChip 
                icon={<TimerIcon />} 
                label={formatTime(timeLeft)} 
                color={timeLeft < 60 ? "error" : "default"}
              />
            </Box>
          </Box>

          {/* Progress bar */}
          <Box sx={{ mb: 3 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 10, 
                borderRadius: 5,
                backgroundColor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette.secondary.main,
                }
              }} 
            />
            <Typography variant="body2" sx={{ mt: 1, textAlign: 'right' }}>
              Thử thách {currentChallengeIndex + 1}/{codingChallenges.length}
            </Typography>
          </Box>

          {/* Tabs for Description and Code */}
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="coding challenge tabs"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <Tab label="Mô tả" {...a11yProps(0)} />
              <Tab label="Code" {...a11yProps(1)} />
            </Tabs>
            
            {/* Description Tab */}
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" gutterBottom>
                {currentChallenge.title}
              </Typography>
              <Typography variant="body1" paragraph>
                {currentChallenge.description}
              </Typography>
              
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Kết quả mong đợi:
                </Typography>
                <Paper sx={{ p: 2, bgcolor: theme.palette.grey[100], fontFamily: 'monospace' }}>
                  {currentChallenge.expectedOutput}
                </Paper>
              </Box>
              
              {showHint && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Gợi ý:
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: theme.palette.info.light, color: theme.palette.info.contrastText }}>
                    {currentChallenge.hint}
                  </Paper>
                </Box>
              )}
              
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                {!showHint && (
                  <Button 
                    variant="outlined" 
                    color="info" 
                    startIcon={<LightbulbIcon />}
                    onClick={handleShowHint}
                  >
                    Hiện gợi ý
                  </Button>
                )}
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => setTabValue(1)}
                >
                  Bắt đầu code
                </Button>
              </Box>
            </TabPanel>
            
            {/* Code Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Editor
                </Typography>
                <Box>
                  <Tooltip title="Reset Code">
                    <IconButton onClick={handleResetCode} color="default">
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Show Solution">
                    <IconButton 
                      onClick={handleShowSolution} 
                      color="info"
                      sx={{ ml: 1 }}
                    >
                      <LightbulbIcon />
                    </IconButton>
                  </Tooltip>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<PlayArrowIcon />}
                    onClick={handleRunCode}
                    sx={{ ml: 2 }}
                  >
                    Chạy
                  </Button>
                </Box>
              </Box>
              
              <CodeEditor
                multiline
                fullWidth
                variant="outlined"
                value={code}
                onChange={handleCodeChange}
                minRows={10}
                maxRows={15}
              />
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Console
              </Typography>
              
              <ConsoleOutput>
                {output.map((line, index) => (
                  <div key={index} className={line.type}>
                    {line.text}
                  </div>
                ))}
              </ConsoleOutput>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  variant="outlined"
                  onClick={() => setTabValue(0)}
                >
                  Xem mô tả
                </Button>
                
                <Button 
                  variant="contained" 
                  color="secondary"
                  onClick={handleNextChallenge}
                >
                  {currentChallengeIndex < codingChallenges.length - 1 
                    ? 'Thử thách tiếp theo' 
                    : 'Hoàn thành'}
                </Button>
              </Box>
            </TabPanel>
          </Paper>
        </>
      ) : (
        <Dialog
          open={showResults}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
            <Typography variant="h4" component="div" fontWeight="bold">
              Kết quả Coding Challenge
            </Typography>
          </DialogTitle>
          
          <DialogContent>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h5" gutterBottom>
                Bạn đã hoàn thành {completedChallenges.length}/{codingChallenges.length} thử thách
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                <Chip 
                  icon={<CheckCircleIcon />}
                  label={`${Math.round((completedChallenges.length / codingChallenges.length) * 100)}%`} 
                  color="success"
                  sx={{ px: 3, py: 2, fontSize: '1.2rem' }}
                />
              </Box>
              
              <Typography variant="body1" sx={{ mb: 3 }}>
                {completedChallenges.length === codingChallenges.length 
                  ? 'Tuyệt vời! Bạn đã hoàn thành tất cả các thử thách.' 
                  : completedChallenges.length > 0 
                    ? 'Bạn đã làm tốt! Hãy tiếp tục luyện tập để cải thiện kỹ năng.' 
                    : 'Đừng nản lòng! Hãy tiếp tục học và thử lại.'}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Bạn đã nhận được {completedChallenges.length * 100} tokens cho phần thử thách này!
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
              Hoàn thành
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default CodingGame;