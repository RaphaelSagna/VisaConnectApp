import { Express, Request, Response } from 'express';
import { authenticateUser } from '../middleware/auth';
import businessService from '../services/businessService';

export default function businessApi(app: Express) {
  // Get user's businesses
  app.get(
    '/api/businesses',
    authenticateUser,
    async (req: Request, res: Response) => {
      try {
        const userId = req.user?.uid;
        if (!userId) {
          return res.status(401).json({ error: 'User not authenticated' });
        }

        const businesses = await businessService.getBusinessesByUserId(userId);
        res.json({ success: true, businesses });
      } catch (error) {
        console.error('Error fetching businesses:', error);
        res.status(500).json({
          error: 'Failed to fetch businesses',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  // Get user's primary business
  app.get(
    '/api/businesses/primary',
    authenticateUser,
    async (req: Request, res: Response) => {
      try {
        const userId = req.user?.uid;
        if (!userId) {
          return res.status(401).json({ error: 'User not authenticated' });
        }

        const business = await businessService.getPrimaryBusinessByUserId(
          userId
        );
        res.json({ success: true, business });
      } catch (error) {
        console.error('Error fetching primary business:', error);
        res.status(500).json({
          error: 'Failed to fetch primary business',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  // Create new business
  app.post(
    '/api/businesses',
    authenticateUser,
    async (req: Request, res: Response) => {
      try {
        const userId = req.user?.uid;
        if (!userId) {
          return res.status(401).json({ error: 'User not authenticated' });
        }

        const { name, description, address, website } = req.body;

        if (!name || name.trim().length === 0) {
          return res.status(400).json({ error: 'Business name is required' });
        }

        const business = await businessService.createBusiness({
          user_id: userId,
          name: name.trim(),
          description: description?.trim(),
          address: address?.trim(),
          website: website?.trim(),
        });

        res.json({ success: true, business });
      } catch (error) {
        console.error('Error creating business:', error);
        res.status(500).json({
          error: 'Failed to create business',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  // Update business
  app.put(
    '/api/businesses/:id',
    authenticateUser,
    async (req: Request, res: Response) => {
      try {
        const userId = req.user?.uid;
        const businessId = parseInt(req.params.id);

        if (!userId) {
          return res.status(401).json({ error: 'User not authenticated' });
        }

        if (isNaN(businessId)) {
          return res.status(400).json({ error: 'Invalid business ID' });
        }

        // Verify the business belongs to the user
        const existingBusiness = await businessService.getBusinessById(
          businessId
        );
        if (!existingBusiness || existingBusiness.user_id !== userId) {
          return res.status(404).json({ error: 'Business not found' });
        }

        const { name, description, address, website } = req.body;

        if (name !== undefined && name.trim().length === 0) {
          return res
            .status(400)
            .json({ error: 'Business name cannot be empty' });
        }

        const business = await businessService.updateBusiness(businessId, {
          name: name?.trim(),
          description: description?.trim(),
          address: address?.trim(),
          website: website?.trim(),
        });

        res.json({ success: true, business });
      } catch (error) {
        console.error('Error updating business:', error);
        res.status(500).json({
          error: 'Failed to update business',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  // Delete business
  app.delete(
    '/api/businesses/:id',
    authenticateUser,
    async (req: Request, res: Response) => {
      try {
        const userId = req.user?.uid;
        const businessId = parseInt(req.params.id);

        if (!userId) {
          return res.status(401).json({ error: 'User not authenticated' });
        }

        if (isNaN(businessId)) {
          return res.status(400).json({ error: 'Invalid business ID' });
        }

        // Verify the business belongs to the user
        const existingBusiness = await businessService.getBusinessById(
          businessId
        );
        if (!existingBusiness || existingBusiness.user_id !== userId) {
          return res.status(404).json({ error: 'Business not found' });
        }

        const deleted = await businessService.deleteBusiness(businessId);
        if (!deleted) {
          return res.status(404).json({ error: 'Business not found' });
        }

        res.json({ success: true, message: 'Business deleted successfully' });
      } catch (error) {
        console.error('Error deleting business:', error);
        res.status(500).json({
          error: 'Failed to delete business',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  // Verify business (admin only - you might want to add admin middleware)
  app.post(
    '/api/businesses/:id/verify',
    authenticateUser,
    async (req: Request, res: Response) => {
      try {
        const businessId = parseInt(req.params.id);

        if (isNaN(businessId)) {
          return res.status(400).json({ error: 'Invalid business ID' });
        }

        const business = await businessService.verifyBusiness(businessId);
        if (!business) {
          return res.status(404).json({ error: 'Business not found' });
        }

        res.json({ success: true, business });
      } catch (error) {
        console.error('Error verifying business:', error);
        res.status(500).json({
          error: 'Failed to verify business',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  // Search businesses (public endpoint)
  app.get('/api/businesses/search', async (req: Request, res: Response) => {
    try {
      const { name, limit = 50 } = req.query;

      if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'Search term is required' });
      }

      const businesses = await businessService.searchBusinessesByName(
        name,
        parseInt(limit as string)
      );
      res.json({ success: true, businesses });
    } catch (error) {
      console.error('Error searching businesses:', error);
      res.status(500).json({
        error: 'Failed to search businesses',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Get verified businesses (public endpoint)
  app.get('/api/businesses/verified', async (req: Request, res: Response) => {
    try {
      const { limit = 50, offset = 0 } = req.query;

      const businesses = await businessService.getVerifiedBusinesses(
        parseInt(limit as string),
        parseInt(offset as string)
      );
      res.json({ success: true, businesses });
    } catch (error) {
      console.error('Error fetching verified businesses:', error);
      res.status(500).json({
        error: 'Failed to fetch verified businesses',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });
}
