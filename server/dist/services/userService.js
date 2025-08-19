"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const config_1 = __importDefault(require("../db/config"));
const uuid_1 = require("uuid");
class UserService {
    // Create a new user
    async createUser(userData) {
        const id = (0, uuid_1.v4)();
        const query = `
      INSERT INTO users (id, full_name, email, visa_type, current_location, interests, profile_answers)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
        const values = [
            id,
            userData.full_name,
            userData.email,
            userData.visa_type,
            userData.current_location
                ? JSON.stringify(userData.current_location)
                : null,
            userData.interests,
            userData.profile_answers
                ? JSON.stringify(userData.profile_answers)
                : null,
        ];
        const result = await config_1.default.query(query, values);
        return result.rows[0];
    }
    // Get user by ID
    async getUserById(id) {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await config_1.default.query(query, [id]);
        return result.rows[0] || null;
    }
    // Get user by email
    async getUserByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await config_1.default.query(query, [email]);
        return result.rows[0] || null;
    }
    // Update user
    async updateUser(id, updates) {
        const setClause = [];
        const values = [];
        let paramCount = 1;
        if (updates.full_name !== undefined) {
            setClause.push(`full_name = $${paramCount++}`);
            values.push(updates.full_name);
        }
        if (updates.visa_type !== undefined) {
            setClause.push(`visa_type = $${paramCount++}`);
            values.push(updates.visa_type);
        }
        if (updates.current_location !== undefined) {
            setClause.push(`current_location = $${paramCount++}`);
            values.push(JSON.stringify(updates.current_location));
        }
        if (updates.interests !== undefined) {
            setClause.push(`interests = $${paramCount++}`);
            values.push(updates.interests);
        }
        if (updates.profile_answers !== undefined) {
            setClause.push(`profile_answers = $${paramCount++}`);
            values.push(JSON.stringify(updates.profile_answers));
        }
        if (setClause.length === 0) {
            return this.getUserById(id);
        }
        values.push(id);
        const query = `
      UPDATE users 
      SET ${setClause.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING *
    `;
        const result = await config_1.default.query(query, values);
        return result.rows[0] || null;
    }
    // Update specific profile section
    async updateProfileSection(id, section, data) {
        const query = `
      UPDATE users 
      SET profile_answers = COALESCE(profile_answers, '{}'::jsonb) || $1::jsonb,
          updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
        const sectionData = { [section]: data };
        const result = await config_1.default.query(query, [JSON.stringify(sectionData), id]);
        return result.rows[0] || null;
    }
    // Delete user
    async deleteUser(id) {
        const query = 'DELETE FROM users WHERE id = $1';
        const result = await config_1.default.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
    // Get all users (with pagination)
    async getAllUsers(limit = 50, offset = 0) {
        const query = 'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2';
        const result = await config_1.default.query(query, [limit, offset]);
        return result.rows;
    }
    // Search users by criteria
    async searchUsers(criteria) {
        let query = 'SELECT * FROM users WHERE 1=1';
        const values = [];
        let paramCount = 1;
        if (criteria.visa_type) {
            query += ` AND visa_type = $${paramCount++}`;
            values.push(criteria.visa_type);
        }
        if (criteria.location) {
            if (criteria.location.country) {
                query += ` AND current_location->>'country' = $${paramCount++}`;
                values.push(criteria.location.country);
            }
            if (criteria.location.state) {
                query += ` AND current_location->>'state' = $${paramCount++}`;
                values.push(criteria.location.state);
            }
            if (criteria.location.city) {
                query += ` AND current_location->>'city' = $${paramCount++}`;
                values.push(criteria.location.city);
            }
        }
        if (criteria.interests && criteria.interests.length > 0) {
            query += ` AND interests && $${paramCount++}`;
            values.push(criteria.interests);
        }
        query += ' ORDER BY created_at DESC';
        const result = await config_1.default.query(query, values);
        return result.rows;
    }
}
exports.UserService = UserService;
exports.default = new UserService();
