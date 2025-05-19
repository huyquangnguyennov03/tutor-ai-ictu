// src/pages/chatTutor/WelcomeMessage.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Avatar,
  Paper,
  Divider,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Tabs,
  Tab,
  Button,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import QuickSuggestions from './QuickSuggestions';
import { QuickSuggestion } from '@/redux/slices/chatTutorSlice';

interface WelcomeMessageProps {
  title: string;
  subtitle: string;
  suggestions: QuickSuggestion[];
  onSelectSuggestion: (suggestion: string) => void;
}

const WelcomeContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(2),
  flexGrow: 1,
  overflowY: 'auto',
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(10),
  height: theme.spacing(10),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.primary.main,
  boxShadow: theme.shadows[3],
}));

const WelcomeTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  color: theme.palette.primary.main,
  fontWeight: 'bold',
}));

const WelcomeSubtitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: theme.palette.text.secondary,
}));

const SuggestionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 'medium',
  marginBottom: theme.spacing(2),
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  backgroundColor: theme.palette.background.paper,
  width: '100%',
  maxWidth: '600px',
}));

const FeatureBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

const FeatureIcon = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(4),
  height: theme.spacing(4),
  marginRight: theme.spacing(2),
  backgroundColor: theme.palette.secondary.light,
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const CategoryIcon = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(6),
  height: theme.spacing(6),
  margin: '0 auto',
  marginBottom: theme.spacing(2),
}));

const ExampleBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
}));

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({
  title,
  subtitle,
  suggestions,
  onSelectSuggestion
}) => {
  const [tabValue, setTabValue] = useState(0);
  
  // Group suggestions by category
  const conceptSuggestions = suggestions.filter(s => s.category === 'concept');
  const debugSuggestions = suggestions.filter(s => s.category === 'debug');
  const exerciseSuggestions = suggestions.filter(s => s.category === 'exercise');
  const generalSuggestions = suggestions.filter(s => !s.category || s.category === 'general');
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleCategoryClick = (category: string) => {
    // Set tab based on category
    switch (category) {
      case 'concept':
        setTabValue(0);
        break;
      case 'debug':
        setTabValue(1);
        break;
      case 'exercise':
        setTabValue(2);
        break;
      default:
        setTabValue(0);
    }
  };
  
  const exampleQuestions = [
    "Giải thích về con trỏ trong C và cách sử dụng",
    "Tại sao chương trình của tôi bị lỗi segmentation fault?",
    "Làm thế nào để tối ưu hóa thuật toán sắp xếp này?",
    "Giúp tôi hiểu cách hoạt động của đệ quy"
  ];
  
  return (
    <WelcomeContainer maxWidth="md">
      <LargeAvatar>
        <SmartToyIcon fontSize="large" />
      </LargeAvatar>

      <WelcomeTitle variant="h4" >
        {title}
      </WelcomeTitle>

      <WelcomeSubtitle variant="body1">
        {subtitle}
      </WelcomeSubtitle>


      {/* Suggestions tabs */}
      <Box sx={{ width: '100%', maxWidth: '800px' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
              }
            }}
          >
            <Tab label="Khái niệm" />
            <Tab label="Gỡ lỗi" />
            <Tab label="Bài tập" />
          </Tabs>
        </Box>
        
        <Box sx={{ p: 2 }}>
          {tabValue === 0 && (
            <>
              <SuggestionHeader variant="subtitle1">
                Câu hỏi về khái niệm lập trình:
              </SuggestionHeader>
              <Box sx={{ mt: 2 }}>
                {(conceptSuggestions.length > 0 ? conceptSuggestions : generalSuggestions).map((suggestion) => (
                  <Chip
                    key={suggestion.id}
                    label={suggestion.text}
                    variant="outlined"
                    color="primary"
                    onClick={() => onSelectSuggestion(suggestion.text)}
                    sx={{ 
                      m: 0.5,
                      borderRadius: '16px',
                      '&:hover': {
                        backgroundColor: theme => theme.palette.primary.light,
                        color: theme => theme.palette.primary.contrastText,
                      }
                    }}
                  />
                ))}
              </Box>
            </>
          )}
          
          {tabValue === 1 && (
            <>
              <SuggestionHeader variant="subtitle1">
                Câu hỏi về gỡ lỗi và sửa code:
              </SuggestionHeader>
              <QuickSuggestions
                suggestions={debugSuggestions.length > 0 ? debugSuggestions : generalSuggestions}
                onSelectSuggestion={onSelectSuggestion}
              />
            </>
          )}
          
          {tabValue === 2 && (
            <>
              <SuggestionHeader variant="subtitle1">
                Câu hỏi về bài tập và thuật toán:
              </SuggestionHeader>
              <QuickSuggestions
                suggestions={exerciseSuggestions.length > 0 ? exerciseSuggestions : generalSuggestions}
                onSelectSuggestion={onSelectSuggestion}
              />
            </>
          )}
        </Box>
      </Box>
    </WelcomeContainer>
  );
};

export default WelcomeMessage;