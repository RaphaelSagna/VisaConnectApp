import pool from '../db/config';

export interface Business {
  id: number;
  user_id: string;
  name: string;
  description?: string;
  address?: string;
  website?: string;
  verified: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateBusinessData {
  user_id: string;
  name: string;
  description?: string;
  address?: string;
  website?: string;
  verified?: boolean;
}

export class BusinessService {
  // Create a new business
  async createBusiness(businessData: CreateBusinessData): Promise<Business> {
    const query = `
      INSERT INTO businesses (user_id, name, description, address, website, verified)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      businessData.user_id,
      businessData.name,
      businessData.description,
      businessData.address,
      businessData.website,
      businessData.verified || false,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Get business by ID
  async getBusinessById(id: number): Promise<Business | null> {
    const query = 'SELECT * FROM businesses WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Get businesses by user ID
  async getBusinessesByUserId(userId: string): Promise<Business[]> {
    const query =
      'SELECT * FROM businesses WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // Get primary business by user ID (first business or verified business)
  async getPrimaryBusinessByUserId(userId: string): Promise<Business | null> {
    const query = `
      SELECT * FROM businesses 
      WHERE user_id = $1 
      ORDER BY verified DESC, created_at ASC 
      LIMIT 1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  }

  // Update business
  async updateBusiness(
    id: number,
    updates: Partial<Omit<Business, 'id' | 'user_id' | 'created_at'>>
  ): Promise<Business | null> {
    const setClause: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updates.name !== undefined) {
      setClause.push(`name = $${paramCount++}`);
      values.push(updates.name);
    }
    if (updates.description !== undefined) {
      setClause.push(`description = $${paramCount++}`);
      values.push(updates.description);
    }
    if (updates.address !== undefined) {
      setClause.push(`address = $${paramCount++}`);
      values.push(updates.address);
    }
    if (updates.website !== undefined) {
      setClause.push(`website = $${paramCount++}`);
      values.push(updates.website);
    }
    if (updates.verified !== undefined) {
      setClause.push(`verified = $${paramCount++}`);
      values.push(updates.verified);
    }

    if (setClause.length === 0) {
      return this.getBusinessById(id);
    }

    values.push(id);
    const query = `
      UPDATE businesses 
      SET ${setClause.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // Delete business
  async deleteBusiness(id: number): Promise<boolean> {
    const query = 'DELETE FROM businesses WHERE id = $1';
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Delete all businesses for a user
  async deleteBusinessesByUserId(userId: string): Promise<boolean> {
    const query = 'DELETE FROM businesses WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return (result.rowCount ?? 0) > 0;
  }

  // Verify business
  async verifyBusiness(id: number): Promise<Business | null> {
    return this.updateBusiness(id, { verified: true });
  }

  // Unverify business
  async unverifyBusiness(id: number): Promise<Business | null> {
    return this.updateBusiness(id, { verified: false });
  }

  // Search businesses by name
  async searchBusinessesByName(
    name: string,
    limit: number = 50
  ): Promise<Business[]> {
    const query = `
      SELECT * FROM businesses 
      WHERE name ILIKE $1 
      ORDER BY verified DESC, name ASC 
      LIMIT $2
    `;
    const result = await pool.query(query, [`%${name}%`, limit]);
    return result.rows;
  }

  // Get all verified businesses
  async getVerifiedBusinesses(
    limit: number = 50,
    offset: number = 0
  ): Promise<Business[]> {
    const query = `
      SELECT * FROM businesses 
      WHERE verified = true 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }
}

export default new BusinessService();
