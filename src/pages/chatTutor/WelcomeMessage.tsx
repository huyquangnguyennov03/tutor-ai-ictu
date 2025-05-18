// src/pages/chatTutor/WelcomeMessage.tsx
import React from 'react';
import {
  Box,
  Typography,
  Container,
  Avatar,
  Paper,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SchoolIcon from '@mui/icons-material/School';
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
  paddingTop: theme.spacing(6),
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
  marginBottom: theme.spacing(2),
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

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({
  title,
  subtitle,
  suggestions,
  onSelectSuggestion
}) => {
  return (
    <WelcomeContainer maxWidth="md">
      <LargeAvatar>
        <SmartToyIcon fontSize="large" />
      </LargeAvatar>

      <WelcomeTitle variant="h4" component="h1">
        {title}
      </WelcomeTitle>

      <WelcomeSubtitle variant="body1">
        {subtitle}
      </WelcomeSubtitle>

      <FeatureCard>
        <Typography variant="h6" gutterBottom color="primary">
          Trợ lý AI có thể giúp bạn:
        </Typography>
        
        <Divider sx={{ mb: 2 }} />
        
        <FeatureBox>
          <FeatureIcon>
            <SchoolIcon fontSize="small" />
          </FeatureIcon>
          <Typography variant="body1">Giải thích các khái niệm lập trình</Typography>
        </FeatureBox>
        
        <FeatureBox>
          <FeatureIcon>
            <SchoolIcon fontSize="small" />
          </FeatureIcon>
          <Typography variant="body1">Hỗ trợ gỡ lỗi và sửa code</Typography>
        </FeatureBox>
        
        <FeatureBox>
          <FeatureIcon>
            <SchoolIcon fontSize="small" />
          </FeatureIcon>
          <Typography variant="body1">Gợi ý cách giải quyết bài tập</Typography>
        </FeatureBox>
      </FeatureCard>

      <Box sx={{ mb: 4, width: '100%', maxWidth: '600px' }}>
        <SuggestionHeader variant="subtitle1">
          Bắt đầu cuộc trò chuyện với những câu hỏi gợi ý:
        </SuggestionHeader>

        <QuickSuggestions
          suggestions={suggestions}
          onSelectSuggestion={onSelectSuggestion}
        />
      </Box>
    </WelcomeContainer>
  );
};

export default WelcomeMessage;