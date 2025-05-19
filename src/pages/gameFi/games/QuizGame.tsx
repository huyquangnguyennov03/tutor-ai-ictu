// src/pages/gameFi/games/QuizGame.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TimerIcon from '@mui/icons-material/Timer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Styled components
const QuestionCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  borderRadius: theme.shape.borderRadius,
  overflow: 'visible',
  position: 'relative',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  }
}));

const OptionButton = styled(Button)<{ correct?: boolean; selected?: boolean; revealed?: boolean }>(
  ({ theme, correct, selected, revealed }) => ({
    justifyContent: 'flex-start',
    textAlign: 'left',
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1.5, 2),
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.2s ease',
    position: 'relative',
    fontWeight: selected ? 'bold' : 'normal',
    backgroundColor: revealed
      ? correct
        ? theme.palette.success.light
        : selected
        ? theme.palette.error.light
        : theme.palette.background.paper
      : selected
      ? theme.palette.primary.light
      : theme.palette.background.paper,
    color: revealed
      ? correct
        ? theme.palette.success.contrastText
        : selected
        ? theme.palette.error.contrastText
        : theme.palette.text.primary
      : selected
      ? theme.palette.primary.contrastText
      : theme.palette.text.primary,
    '&:hover': {
      backgroundColor: revealed
        ? correct
          ? theme.palette.success.light
          : selected
          ? theme.palette.error.light
          : theme.palette.action.hover
        : theme.palette.action.hover,
    },
    '&::before': revealed && correct && !selected
      ? {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '4px',
          backgroundColor: theme.palette.success.main,
          borderTopLeftRadius: theme.shape.borderRadius,
          borderBottomLeftRadius: theme.shape.borderRadius,
        }
      : {},
  })
);

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

// Quiz questions data
const quizQuestions = [
  {
    id: 1,
    question: 'Thuật toán nào sau đây có độ phức tạp tốt nhất trong trường hợp xấu nhất?',
    options: [
      'Bubble Sort - O(n²)',
      'Quick Sort - O(n²)',
      'Merge Sort - O(n log n)',
      'Selection Sort - O(n²)'
    ],
    correctAnswer: 2, // Index of the correct answer (0-based)
    explanation: 'Merge Sort có độ phức tạp O(n log n) trong mọi trường hợp, trong khi các thuật toán khác có thể có độ phức tạp O(n²) trong trường hợp xấu nhất.'
  },
  {
    id: 2,
    question: 'Trong lập trình hướng đối tượng, khái niệm nào cho phép một lớp kế thừa thuộc tính và phương thức từ một lớp khác?',
    options: [
      'Encapsulation (Đóng gói)',
      'Inheritance (Kế thừa)',
      'Polymorphism (Đa hình)',
      'Abstraction (Trừu tượng)'
    ],
    correctAnswer: 1,
    explanation: 'Inheritance (Kế thừa) là khái niệm cho phép một lớp (lớp con) kế thừa thuộc tính và phương thức từ một lớp khác (lớp cha).'
  },
  {
    id: 3,
    question: 'Cấu trúc dữ liệu nào hoạt động theo nguyên tắc LIFO (Last In First Out)?',
    options: [
      'Queue (Hàng đợi)',
      'Stack (Ngăn xếp)',
      'Linked List (Danh sách liên kết)',
      'Tree (Cây)'
    ],
    correctAnswer: 1,
    explanation: 'Stack (Ngăn xếp) hoạt động theo nguyên tắc LIFO - Last In First Out, nghĩa là phần tử được thêm vào cuối cùng sẽ được lấy ra đầu tiên.'
  },
  {
    id: 4,
    question: 'Trong mạng máy tính, giao thức nào được sử dụng để truyền trang web?',
    options: [
      'FTP (File Transfer Protocol)',
      'SMTP (Simple Mail Transfer Protocol)',
      'HTTP (Hypertext Transfer Protocol)',
      'SSH (Secure Shell)'
    ],
    correctAnswer: 2,
    explanation: 'HTTP (Hypertext Transfer Protocol) là giao thức được sử dụng để truyền trang web từ máy chủ web đến trình duyệt của người dùng.'
  },
  {
    id: 5,
    question: 'Trong SQL, lệnh nào được sử dụng để lấy dữ liệu từ một bảng?',
    options: [
      'INSERT',
      'UPDATE',
      'DELETE',
      'SELECT'
    ],
    correctAnswer: 3,
    explanation: 'Lệnh SELECT được sử dụng để lấy dữ liệu từ một hoặc nhiều bảng trong cơ sở dữ liệu SQL.'
  }
];

interface QuizGameProps {
  onFinish: (score: number, totalQuestions: number) => void;
  onClose: () => void;
}

const QuizGame: React.FC<QuizGameProps> = ({ onFinish, onClose }) => {
  const theme = useTheme();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const [gameOver, setGameOver] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<Array<number | null>>([]);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  // Timer effect
  useEffect(() => {
    if (gameOver || revealed) return;

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
  }, [currentQuestionIndex, revealed, gameOver]);

  // Handle time up
  const handleTimeUp = () => {
    if (!revealed) {
      setRevealed(true);
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = selectedOption;
      setAnswers(newAnswers);
    }
  };

  // Handle option selection
  const handleOptionSelect = (optionIndex: number) => {
    if (!revealed) {
      setSelectedOption(optionIndex);
    }
  };

  // Handle checking answer
  const handleCheckAnswer = () => {
    setRevealed(true);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedOption;
    setAnswers(newAnswers);

    if (selectedOption === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setRevealed(false);
      setTimeLeft(30);
    } else {
      setGameOver(true);
      setShowResults(true);
    }
  };

  // Handle finish game
  const handleFinishGame = () => {
    onFinish(score, quizQuestions.length);
    onClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      {!gameOver ? (
        <>
          {/* Header with progress and score */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" component="h1" fontWeight="bold">
              Quiz: Kiến thức lập trình
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <ScoreChip 
                icon={<EmojiEventsIcon />} 
                label={`Điểm: ${score}/${quizQuestions.length}`} 
              />
              <TimerChip 
                icon={<TimerIcon />} 
                label={`${timeLeft}s`} 
                color={timeLeft < 10 ? "error" : "default"}
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
              Câu hỏi {currentQuestionIndex + 1}/{quizQuestions.length}
            </Typography>
          </Box>

          {/* Question card */}
          <QuestionCard>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                {currentQuestion.question}
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                {currentQuestion.options.map((option, index) => (
                  <OptionButton
                    key={index}
                    fullWidth
                    variant="outlined"
                    onClick={() => handleOptionSelect(index)}
                    selected={selectedOption === index}
                    correct={index === currentQuestion.correctAnswer}
                    revealed={revealed}
                    sx={{ mb: 2 }}
                  >
                    <Typography variant="body1">
                      {option}
                    </Typography>
                    {revealed && index === currentQuestion.correctAnswer && (
                      <CheckCircleOutlineIcon 
                        sx={{ 
                          ml: 'auto', 
                          color: theme.palette.success.main 
                        }} 
                      />
                    )}
                  </OptionButton>
                ))}
              </Box>

              {revealed && (
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    mt: 2, 
                    bgcolor: theme.palette.info.light,
                    color: theme.palette.info.contrastText,
                    borderRadius: 2
                  }}
                >
                  <Typography variant="body1">
                    <strong>Giải thích:</strong> {currentQuestion.explanation}
                  </Typography>
                </Paper>
              )}
            </CardContent>
            
            <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
              {!revealed ? (
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  disabled={selectedOption === null}
                  onClick={handleCheckAnswer}
                  sx={{ minWidth: 120 }}
                >
                  Kiểm tra
                </Button>
              ) : (
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="large"
                  onClick={handleNextQuestion}
                  sx={{ minWidth: 120 }}
                >
                  {currentQuestionIndex < quizQuestions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
                </Button>
              )}
            </CardActions>
          </QuestionCard>
        </>
      ) : (
        <Dialog
          open={showResults}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
            <Typography variant="h4" component="div" fontWeight="bold">
              Kết quả Quiz
            </Typography>
          </DialogTitle>
          
          <DialogContent>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h5" gutterBottom>
                Bạn đã trả lời đúng {score}/{quizQuestions.length} câu hỏi
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                <ScoreChip 
                  icon={<EmojiEventsIcon />} 
                  label={`${Math.round((score / quizQuestions.length) * 100)}%`} 
                  sx={{ px: 3, py: 2 }}
                />
              </Box>
              
              <Typography variant="body1" sx={{ mb: 3 }}>
                {score === quizQuestions.length 
                  ? 'Tuyệt vời! Bạn đã trả lời đúng tất cả các câu hỏi.' 
                  : score >= quizQuestions.length / 2 
                    ? 'Tốt lắm! Bạn đã làm rất tốt.' 
                    : 'Hãy tiếp tục cố gắng để cải thiện kết quả nhé!'}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Bạn đã nhận được {score * 50} tokens cho bài quiz này!
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

export default QuizGame;