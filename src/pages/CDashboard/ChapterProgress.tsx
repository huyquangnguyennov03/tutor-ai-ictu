import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  LinearProgress,
  Grid,
  Popover
} from '@mui/material';
import { useSelector } from 'react-redux';
import { Chapter, selectChapters } from "@/redux/slices/teacherDashboardSlice"

// Định nghĩa kiểu dữ liệu cho Chapter khi hiển thị tooltip
interface HoveredChapter extends Chapter {
  index: number;
}

const ChapterProgress: React.FC = () => {
  const chapters = useSelector(selectChapters) as Chapter[];

  // State for tooltip/popover
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [hoveredChapter, setHoveredChapter] = useState<HoveredChapter | null>(null);

  // Sort chapters by id for consistent ordering
  const sortedChapters = [...chapters].sort((a, b) => a.id - b.id);

  // Color mapping based on completion rate
  const getBarColor = (rate: number): string => {
    if (rate >= 85) return '#4caf50'; // Green
    if (rate >= 65) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  // Handle mouse events for tooltip
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, chapter: Chapter, index: number): void => {
    setAnchorEl(event.currentTarget);
    setHoveredChapter({...chapter, index: index + 1});
  };

  const handlePopoverClose = (): void => {
    setAnchorEl(null);
    setHoveredChapter(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 500, color: '#1976d2', mb: 2 }}>
              Tiến độ theo chương
            </Typography>

            {/* Bar Chart */}
            <Box sx={{
              height: 280,
              mt: 2,
              mb: 4,
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              padding: 2,
              background: '#ffffff'
            }}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}>
                {/* Chart Labels */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    <Box sx={{ width: 12, height: 12, backgroundColor: '#4caf50', mr: 1 }}></Box>
                    <Typography variant="caption">Hoàn thành (%)</Typography>
                  </Box>
                </Box>

                {/* Horizontal grid lines */}
                <Box sx={{ flex: 1, position: 'relative' }}>
                  {[0, 20, 40, 60, 80, 100].reverse().map((value) => (
                    <Box
                      key={value}
                      sx={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: `${100 - value}%`,
                        borderTop: value > 0 ? '1px dashed #e0e0e0' : 'none',
                        height: '1px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          position: 'absolute',
                          left: -25,
                          color: '#757575',
                          fontSize: '0.7rem'
                        }}
                      >
                        {value}
                      </Typography>
                    </Box>
                  ))}

                  {/* Bars */}
                  <Box
                    sx={{
                      display: 'flex',
                      height: '100%',
                      alignItems: 'flex-end',
                      position: 'relative',
                      paddingLeft: 3
                    }}
                  >
                    {sortedChapters.map((chapter, index) => (
                      <Box
                        key={index}
                        sx={{
                          flex: 1,
                          mx: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          height: '100%',
                          justifyContent: 'flex-end',
                          cursor: 'pointer'
                        }}
                        aria-owns={open ? 'mouse-over-popover' : undefined}
                        aria-haspopup="true"
                        onMouseEnter={(e) => handlePopoverOpen(e, chapter, index)}
                        onMouseLeave={handlePopoverClose}
                      >
                        <Box
                          sx={{
                            width: '75%',
                            bgcolor: getBarColor(chapter.completionRate),
                            height: `${chapter.completionRate}%`,
                            maxHeight: '100%',
                            position: 'relative',
                          }}
                        />
                        <Typography variant="caption" sx={{ mt: 1, color: '#555555' }}>
                          Ch.{index + 1}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Popover for hover info */}
          <Popover
            id="mouse-over-popover"
            sx={{
              pointerEvents: 'none',
              '& .MuiPopover-paper': {
                backgroundColor: '#333',
                color: 'white',
                padding: 1.5,
                maxWidth: 200,
                borderRadius: 1
              }
            }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
            {hoveredChapter && (
              <Box>
                <Typography sx={{ fontWeight: 'bold' }}>Ch.{hoveredChapter.index}</Typography>
                <Typography>Hoàn thành (%): {hoveredChapter.completionRate}</Typography>
              </Box>
            )}
          </Popover>

          {/* Chapter Progress Table */}
          <TableContainer component={Paper} sx={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <Table sx={{ minWidth: 650 }} aria-label="chapter progress table">
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>Chương</TableCell>
                  <TableCell>Hoàn thành TB</TableCell>
                  <TableCell>Điểm TB</TableCell>
                  <TableCell>SV đã hoàn thành</TableCell>
                  <TableCell>Thời gian TB (phút)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedChapters.map((chapter, index) => (
                  <TableRow key={chapter.id} hover>
                    <TableCell>{index + 1}. {chapter.name}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', maxWidth: 120, mr: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={chapter.completionRate}
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              backgroundColor: '#e0e0e0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getBarColor(chapter.completionRate)
                              }
                            }}
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="text.secondary">{chapter.completionRate}%</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{chapter.averageScore.toFixed(1)}</TableCell>
                    <TableCell>{chapter.studentsCompleted}{chapter.totalStudents}</TableCell>
                    <TableCell>{chapter.estimatedTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChapterProgress;