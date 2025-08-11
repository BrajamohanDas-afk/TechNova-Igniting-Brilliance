import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Report as ReportIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Pending as PendingIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import 'leaflet/dist/leaflet.css';

interface Report {
  id: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: 'pending' | 'verified' | 'resolved';
  violationType: string;
  timestamp: string;
  imageUrl: string;
  reportedBy: string;
  confidence: number;
}

const Dashboard: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    resolved: 0,
  });
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, []);

  const fetchReports = async () => {
    try {
      // Mock data for demo - replace with actual API call
      const mockReports: Report[] = [
        {
          id: '1',
          location: { latitude: 28.6139, longitude: 77.2090, address: 'Connaught Place, New Delhi' },
          status: 'pending',
          violationType: 'Size Violation',
          timestamp: '2024-08-11T10:30:00Z',
          imageUrl: '/api/images/billboard1.jpg',
          reportedBy: 'citizen123',
          confidence: 0.85,
        },
        {
          id: '2',
          location: { latitude: 28.6230, longitude: 77.2050, address: 'Khan Market, New Delhi' },
          status: 'verified',
          violationType: 'Location Violation',
          timestamp: '2024-08-11T09:15:00Z',
          imageUrl: '/api/images/billboard2.jpg',
          reportedBy: 'citizen456',
          confidence: 0.92,
        },
        {
          id: '3',
          location: { latitude: 28.6100, longitude: 77.2200, address: 'India Gate, New Delhi' },
          status: 'resolved',
          violationType: 'Content Violation',
          timestamp: '2024-08-10T14:20:00Z',
          imageUrl: '/api/images/billboard3.jpg',
          reportedBy: 'citizen789',
          confidence: 0.78,
        },
      ];
      setReports(mockReports);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Mock stats - replace with actual API call
      setStats({
        total: 247,
        pending: 58,
        verified: 102,
        resolved: 87,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'verified':
        return 'error';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <PendingIcon />;
      case 'verified':
        return <WarningIcon />;
      case 'resolved':
        return <CheckIcon />;
      default:
        return <ReportIcon />;
    }
  };

  const chartData = [
    { name: 'Pending', count: stats.pending, color: '#ff9800' },
    { name: 'Verified', count: stats.verified, color: '#f44336' },
    { name: 'Resolved', count: stats.resolved, color: '#4caf50' },
  ];

  const violationTypeData = [
    { name: 'Size Violation', value: 35, color: '#8884d8' },
    { name: 'Location Violation', value: 28, color: '#82ca9d' },
    { name: 'Content Violation', value: 22, color: '#ffc658' },
    { name: 'Structural Hazard', value: 15, color: '#ff7300' },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#2196F3' }}>
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Billboard Monitoring Dashboard
          </Typography>
          <Typography variant="body2">
            TechNova Competition | Admin Portal
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ReportIcon sx={{ fontSize: 40, color: '#2196F3', mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Reports
                    </Typography>
                    <Typography variant="h5">{stats.total}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PendingIcon sx={{ fontSize: 40, color: '#ff9800', mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Pending Review
                    </Typography>
                    <Typography variant="h5">{stats.pending}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <WarningIcon sx={{ fontSize: 40, color: '#f44336', mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Verified Violations
                    </Typography>
                    <Typography variant="h5">{stats.verified}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckIcon sx={{ fontSize: 40, color: '#4caf50', mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Resolved
                    </Typography>
                    <Typography variant="h5">{stats.resolved}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Report Status Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Violation Types
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={violationTypeData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {violationTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Map */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Violation Heatmap
                </Typography>
                <Box sx={{ height: 400, width: '100%' }}>
                  <MapContainer 
                    center={[28.6139, 77.2090]} 
                    zoom={11} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {reports.map(report => (
                      <Marker 
                        key={report.id} 
                        position={[report.location.latitude, report.location.longitude]}
                      >
                        <Popup>
                          <Box>
                            <Typography variant="subtitle2">
                              {report.violationType}
                            </Typography>
                            <Typography variant="body2">
                              Status: {report.status}
                            </Typography>
                            <Typography variant="body2">
                              Confidence: {(report.confidence * 100).toFixed(0)}%
                            </Typography>
                            <Typography variant="body2">
                              Location: {report.location.address}
                            </Typography>
                          </Box>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Reports Table */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Reports
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Violation Type</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Confidence</TableCell>
                        <TableCell>Reported By</TableCell>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reports.slice(0, 10).map(report => (
                        <TableRow key={report.id}>
                          <TableCell>{report.id}</TableCell>
                          <TableCell>{report.location.address}</TableCell>
                          <TableCell>{report.violationType}</TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(report.status)}
                              label={report.status}
                              color={getStatusColor(report.status) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {(report.confidence * 100).toFixed(0)}%
                          </TableCell>
                          <TableCell>{report.reportedBy}</TableCell>
                          <TableCell>
                            {new Date(report.timestamp).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => setSelectedReport(report)}
                            >
                              <ViewIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Report Detail Dialog */}
      <Dialog
        open={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Report Details - {selectedReport?.id}
        </DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedReport.violationType}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Location:</strong> {selectedReport.location.address}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Status:</strong> {selectedReport.status}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Confidence:</strong> {(selectedReport.confidence * 100).toFixed(0)}%
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Reported By:</strong> {selectedReport.reportedBy}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Timestamp:</strong> {new Date(selectedReport.timestamp).toLocaleString()}
              </Typography>
              {/* Image would be displayed here in real implementation */}
              <Box
                sx={{
                  width: '100%',
                  height: 200,
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px dashed #ccc',
                  borderRadius: 1,
                }}
              >
                <Typography color="textSecondary">
                  Billboard Image Placeholder
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
