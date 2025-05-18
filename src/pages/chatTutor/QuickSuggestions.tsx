// src/pages/chatTutor/QuickSuggestions.tsx
import React from 'react';
import { Box, Button, Chip, Paper, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ChatIcon from '@mui/icons-material/Chat';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { QuickSuggestion } from '@/redux/slices/chatTutorSlice';

interface QuickSuggestionsProps {
  suggestions: QuickSuggestion[];
  onSelectSuggestion: (suggestion: string) => void;
  variant?: 'grid' | 'chips' | 'mixed';
}

const SuggestionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(3),
  justifyContent: 'center',
}));

const SuggestionButton = styled(Button)(({ theme }) => ({
  borderRadius: '18px',
  padding: theme.spacing(1, 2),
  textTransform: 'none',
  whiteSpace: 'nowrap',
  border: `1px solid ${theme.palette.primary.main}`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2],
  },
}));

const SuggestionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2],
  },
  display: 'flex',
  alignItems: 'center',
  height: '100%',
}));

const SuggestionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[3],
  },
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

// Helper function to get icon based on category
const getCategoryIcon = (category?: string) => {
  switch (category) {
    case 'concept':
      return <SchoolIcon color="primary" />;
    case 'debug':
      return <BugReportIcon color="error" />;
    case 'exercise':
      return <LightbulbIcon color="success" />;
    default:
      return <ChatIcon color="primary" />;
  }
};

const QuickSuggestions: React.FC<QuickSuggestionsProps> = ({
  suggestions,
  onSelectSuggestion,
  variant = 'mixed'
}) => {
  // For mixed variant
  const primarySuggestions = suggestions.slice(0, 2);
  const secondarySuggestions = suggestions.slice(2);

  // Render grid layout
  if (variant === 'grid') {
    return (
      <Grid container spacing={2}>
        {suggestions.map((suggestion) => (
          <Grid item xs={12} sm={6} md={4} key={suggestion.id}>
            <SuggestionCard
              elevation={0}
              onClick={() => onSelectSuggestion(suggestion.text)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {getCategoryIcon(suggestion.category)}
                <Typography 
                  variant="subtitle2" 
                  sx={{ ml: 1, fontWeight: 'medium' }}
                >
                  {suggestion.category === 'concept' ? 'Khái niệm' : 
                   suggestion.category === 'debug' ? 'Gỡ lỗi' : 
                   suggestion.category === 'exercise' ? 'Bài tập' : 'Câu hỏi'}
                </Typography>
              </Box>
              <Typography variant="body2">{suggestion.text}</Typography>
            </SuggestionCard>
          </Grid>
        ))}
      </Grid>
    );
  }

  // Render chips only
  if (variant === 'chips') {
    return (
      <SuggestionsContainer>
        {suggestions.map((suggestion) => (
          <Chip
            key={suggestion.id}
            label={suggestion.text}
            variant="outlined"
            color={
              suggestion.category === 'concept' ? 'primary' :
              suggestion.category === 'debug' ? 'error' :
              suggestion.category === 'exercise' ? 'success' :
              'default'
            }
            icon={getCategoryIcon(suggestion.category)}
            onClick={() => onSelectSuggestion(suggestion.text)}
            sx={{ 
              borderRadius: '16px',
              padding: '4px 0',
              '&:hover': {
                backgroundColor: (theme) => 
                  suggestion.category === 'concept' ? theme.palette.primary.light :
                  suggestion.category === 'debug' ? theme.palette.error.light :
                  suggestion.category === 'exercise' ? theme.palette.success.light :
                  theme.palette.action.hover,
                color: (theme) => 
                  suggestion.category === 'concept' ? theme.palette.primary.contrastText :
                  suggestion.category === 'debug' ? theme.palette.error.contrastText :
                  suggestion.category === 'exercise' ? theme.palette.success.contrastText :
                  theme.palette.text.primary,
              }
            }}
          />
        ))}
      </SuggestionsContainer>
    );
  }

  // Default mixed layout
  return (
    <>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {primarySuggestions.map((suggestion) => (
          <Grid item xs={12} sm={6} key={suggestion.id}>
            <SuggestionPaper
              elevation={0}
              onClick={() => onSelectSuggestion(suggestion.text)}
            >
              {getCategoryIcon(suggestion.category)}
              <Typography variant="body2" sx={{ ml: 1 }}>
                {suggestion.text}
              </Typography>
            </SuggestionPaper>
          </Grid>
        ))}
      </Grid>

      <SuggestionsContainer>
        {secondarySuggestions.map((suggestion) => (
          <Chip
            key={suggestion.id}
            label={suggestion.text}
            variant="outlined"
            color={
              suggestion.category === 'concept' ? 'primary' :
              suggestion.category === 'debug' ? 'error' :
              suggestion.category === 'exercise' ? 'success' :
              'default'
            }
            onClick={() => onSelectSuggestion(suggestion.text)}
            sx={{ 
              borderRadius: '16px',
              '&:hover': {
                backgroundColor: (theme) => 
                  suggestion.category === 'concept' ? theme.palette.primary.light :
                  suggestion.category === 'debug' ? theme.palette.error.light :
                  suggestion.category === 'exercise' ? theme.palette.success.light :
                  theme.palette.action.hover,
                color: (theme) => theme.palette.common.white,
              }
            }}
          />
        ))}
      </SuggestionsContainer>
    </>
  );
};

export default QuickSuggestions;