// src/pages/chatTutor/QuickSuggestions.tsx
import React from 'react';
import { Box, Button, Chip, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import ChatIcon from '@mui/icons-material/Chat';
import { QuickSuggestion } from '@/redux/slices/chatTutorSlice';

interface QuickSuggestionsProps {
  suggestions: QuickSuggestion[];
  onSelectSuggestion: (suggestion: string) => void;
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
  maxWidth: '280px',
}));

const QuickSuggestions: React.FC<QuickSuggestionsProps> = ({
  suggestions,
  onSelectSuggestion
}) => {
  // Hiển thị gợi ý dưới dạng card cho 2 gợi ý đầu tiên
  const primarySuggestions = suggestions.slice(0, 2);
  // Hiển thị gợi ý dưới dạng chip cho các gợi ý còn lại
  const secondarySuggestions = suggestions.slice(2);

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mb: 3 }}>
        {primarySuggestions.map((suggestion) => (
          <SuggestionPaper
            key={suggestion.id}
            elevation={0}
            onClick={() => onSelectSuggestion(suggestion.text)}
          >
            <ChatIcon color="primary" sx={{ mr: 1, fontSize: '1.2rem' }} />
            {suggestion.text}
          </SuggestionPaper>
        ))}
      </Box>

      <SuggestionsContainer>
        {secondarySuggestions.map((suggestion) => (
          <Chip
            key={suggestion.id}
            label={suggestion.text}
            variant="outlined"
            color="primary"
            onClick={() => onSelectSuggestion(suggestion.text)}
            sx={{ 
              borderRadius: '16px',
              '&:hover': {
                backgroundColor: (theme) => theme.palette.primary.light,
                color: (theme) => theme.palette.primary.contrastText,
              }
            }}
          />
        ))}
      </SuggestionsContainer>
    </>
  );
};

export default QuickSuggestions;