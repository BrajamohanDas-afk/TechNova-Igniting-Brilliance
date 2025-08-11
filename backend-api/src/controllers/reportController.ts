import { Request, Response } from 'express';
import { Report, IReport } from '../models/Report';
import { User } from '../models/User';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  user?: any;
}

export const reportController = {
  // Create a new report
  createReport: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const {
        location,
        violationType,
        description,
        images,
        confidence,
      } = req.body;

      const report = new Report({
        reportedBy: req.user._id,
        location,
        violationType,
        description,
        images,
        confidence,
      });

      await report.save();

      // Populate the user details
      await report.populate('reportedBy', 'firstName lastName email');

      logger.info('Report created successfully', {
        reportId: report._id,
        userId: req.user._id,
        violationType,
      });

      res.status(201).json({
        success: true,
        message: 'Report created successfully',
        data: { report },
      });
    } catch (error) {
      logger.error('Create report error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // Get reports with pagination and filters
  getReports: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        violationType,
        startDate,
        endDate,
        search,
      } = req.query;

      // Build filter object
      const filter: any = {};

      if (status) {
        filter.status = status;
      }

      if (violationType) {
        filter.violationType = violationType;
      }

      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) {
          filter.createdAt.$gte = new Date(startDate as string);
        }
        if (endDate) {
          filter.createdAt.$lte = new Date(endDate as string);
        }
      }

      if (search) {
        filter.$or = [
          { 'location.address': { $regex: search, $options: 'i' } },
          { 'location.city': { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      // If user is not admin/moderator, only show their reports
      if (!['admin', 'moderator'].includes(req.user.role)) {
        filter.reportedBy = req.user._id;
      }

      const skip = (Number(page) - 1) * Number(limit);

      const [reports, total] = await Promise.all([
        Report.find(filter)
          .populate('reportedBy', 'firstName lastName email')
          .populate('assignedTo', 'firstName lastName email')
          .populate('resolvedBy', 'firstName lastName email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit)),
        Report.countDocuments(filter),
      ]);

      res.json({
        success: true,
        data: {
          reports,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          },
        },
      });
    } catch (error) {
      logger.error('Get reports error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // Get a single report by ID
  getReportById: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const report = await Report.findById(id)
        .populate('reportedBy', 'firstName lastName email')
        .populate('assignedTo', 'firstName lastName email')
        .populate('resolvedBy', 'firstName lastName email');

      if (!report) {
        res.status(404).json({
          success: false,
          message: 'Report not found',
        });
        return;
      }

      // Check if user has permission to view this report
      if (
        !['admin', 'moderator'].includes(req.user.role) &&
        report.reportedBy._id.toString() !== req.user._id.toString()
      ) {
        res.status(403).json({
          success: false,
          message: 'Access denied',
        });
        return;
      }

      res.json({
        success: true,
        data: { report },
      });
    } catch (error) {
      logger.error('Get report by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // Update report status (admin/moderator only)
  updateReportStatus: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;

      if (!['admin', 'moderator'].includes(req.user.role)) {
        res.status(403).json({
          success: false,
          message: 'Access denied. Admin or moderator role required.',
        });
        return;
      }

      const report = await Report.findById(id);
      if (!report) {
        res.status(404).json({
          success: false,
          message: 'Report not found',
        });
        return;
      }

      // Update report
      report.status = status;
      if (adminNotes) {
        report.adminNotes = adminNotes;
      }

      if (status === 'resolved' || status === 'dismissed') {
        report.resolvedBy = req.user._id;
        report.resolvedAt = new Date();
      }

      await report.save();

      logger.info('Report status updated', {
        reportId: id,
        status,
        updatedBy: req.user._id,
      });

      res.json({
        success: true,
        message: 'Report status updated successfully',
        data: { report },
      });
    } catch (error) {
      logger.error('Update report status error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // Delete a report
  deleteReport: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const report = await Report.findById(id);
      if (!report) {
        res.status(404).json({
          success: false,
          message: 'Report not found',
        });
        return;
      }

      // Check if user has permission to delete this report
      if (
        !['admin'].includes(req.user.role) &&
        report.reportedBy.toString() !== req.user._id.toString()
      ) {
        res.status(403).json({
          success: false,
          message: 'Access denied',
        });
        return;
      }

      await Report.findByIdAndDelete(id);

      logger.info('Report deleted', { reportId: id, deletedBy: req.user._id });

      res.json({
        success: true,
        message: 'Report deleted successfully',
      });
    } catch (error) {
      logger.error('Delete report error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // Get report statistics
  getReportStats: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const stats = await Report.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

      const violationTypeStats = await Report.aggregate([
        {
          $group: {
            _id: '$violationType',
            count: { $sum: 1 },
          },
        },
      ]);

      const monthlyStats = await Report.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { '_id.year': -1, '_id.month': -1 },
        },
        {
          $limit: 12,
        },
      ]);

      const totalReports = await Report.countDocuments();
      const pendingReports = await Report.countDocuments({ status: 'pending' });
      const verifiedReports = await Report.countDocuments({ status: 'verified' });
      const resolvedReports = await Report.countDocuments({ status: 'resolved' });

      res.json({
        success: true,
        data: {
          overview: {
            total: totalReports,
            pending: pendingReports,
            verified: verifiedReports,
            resolved: resolvedReports,
          },
          statusStats: stats,
          violationTypeStats,
          monthlyStats,
        },
      });
    } catch (error) {
      logger.error('Get report stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // Get heatmap data for visualization
  getHeatmapData: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { bounds } = req.query;

      let filter: any = {};

      if (bounds) {
        // Parse bounds: "swLat,swLng,neLat,neLng"
        const [swLat, swLng, neLat, neLng] = bounds.toString().split(',').map(Number);
        filter = {
          'location.latitude': { $gte: swLat, $lte: neLat },
          'location.longitude': { $gte: swLng, $lte: neLng },
        };
      }

      const heatmapData = await Report.find(filter, {
        'location.latitude': 1,
        'location.longitude': 1,
        status: 1,
        violationType: 1,
        createdAt: 1,
      });

      res.json({
        success: true,
        data: { heatmapData },
      });
    } catch (error) {
      logger.error('Get heatmap data error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },
};
