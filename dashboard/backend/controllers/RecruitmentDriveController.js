class RecruitmentDriveController {
    constructor(db) {
        this.db = db;
    }

    async getClubDrives(req, res) {
        try {
            const { clubId } = req.params;
            
            // Verify user owns this club
            const club = await this.db.query(
                'SELECT * FROM clubs WHERE id = ? AND club_head_id = ?',
                [clubId, req.user.id]
            );

            if (club.length === 0) {
                return res.status(403).json({ message: 'Access denied' });
            }

            const drives = await this.db.query(`
                SELECT rd.*, 
                       COUNT(a.id) as current_applications
                FROM recruitment_drives rd
                LEFT JOIN applications a ON rd.id = a.recruitment_drive_id
                WHERE rd.club_id = ?
                GROUP BY rd.id
                ORDER BY rd.created_at DESC
            `, [clubId]);

            // Get questions for each drive
            for (let drive of drives) {
                const questions = await this.db.query(`
                    SELECT * FROM recruitment_questions 
                    WHERE recruitment_drive_id = ? 
                    ORDER BY order_index ASC
                `, [drive.id]);
                
                drive.questions = questions.map(q => ({
                    ...q,
                    options: q.options ? JSON.parse(q.options) : []
                }));
            }

            res.json({ drives });
        } catch (error) {
            console.error('Get club drives error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createDrive(req, res) {
        try {
            const {
                title,
                description,
                startDate,
                endDate,
                maxApplications,
                questions
            } = req.body;

            // Validation
            if (!title || !description || !startDate || !endDate) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            if (new Date(startDate) >= new Date(endDate)) {
                return res.status(400).json({ message: 'End date must be after start date' });
            }

            // Get user's club
            const clubs = await this.db.query(
                'SELECT * FROM clubs WHERE club_head_id = ?',
                [req.user.id]
            );

            if (clubs.length === 0) {
                return res.status(400).json({ message: 'No club found for this user' });
            }

            const clubId = clubs[0].id;

            // Insert recruitment drive
            const driveResult = await this.db.query(`
                INSERT INTO recruitment_drives 
                (title, description, club_id, club_head_id, start_date, end_date, max_applications, is_active)
                VALUES (?, ?, ?, ?, ?, ?, ?, true)
            `, [title, description, clubId, req.user.id, startDate, endDate, maxApplications || 50]);

            const driveId = driveResult.insertId;

            // Insert questions
            if (questions && questions.length > 0) {
                for (let i = 0; i < questions.length; i++) {
                    const question = questions[i];
                    await this.db.query(`
                        INSERT INTO recruitment_questions 
                        (recruitment_drive_id, question_text, question_type, is_required, options, order_index)
                        VALUES (?, ?, ?, ?, ?, ?)
                    `, [
                        driveId,
                        question.question,
                        question.type,
                        question.required || false,
                        question.options ? JSON.stringify(question.options) : null,
                        i
                    ]);
                }
            }

            // Return the created drive
            const newDrive = await this.db.query(
                'SELECT * FROM recruitment_drives WHERE id = ?',
                [driveId]
            );

            res.status(201).json({ 
                message: 'Recruitment drive created successfully',
                drive: newDrive[0]
            });
        } catch (error) {
            console.error('Create drive error:', error);
            res.status(500).json({ message: 'Failed to create recruitment drive' });
        }
    }

    async updateDrive(req, res) {
        try {
            const { driveId } = req.params;
            const {
                title,
                description,
                startDate,
                endDate,
                maxApplications,
                questions
            } = req.body;

            // Verify user owns this drive
            const drive = await this.db.query(
                'SELECT * FROM recruitment_drives WHERE id = ? AND club_head_id = ?',
                [driveId, req.user.id]
            );

            if (drive.length === 0) {
                return res.status(403).json({ message: 'Access denied' });
            }

            // Update drive
            await this.db.query(`
                UPDATE recruitment_drives 
                SET title = ?, description = ?, start_date = ?, end_date = ?, max_applications = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [title, description, startDate, endDate, maxApplications, driveId]);

            // Update questions - delete existing and insert new ones
            await this.db.query('DELETE FROM recruitment_questions WHERE recruitment_drive_id = ?', [driveId]);

            if (questions && questions.length > 0) {
                for (let i = 0; i < questions.length; i++) {
                    const question = questions[i];
                    await this.db.query(`
                        INSERT INTO recruitment_questions 
                        (recruitment_drive_id, question_text, question_type, is_required, options, order_index)
                        VALUES (?, ?, ?, ?, ?, ?)
                    `, [
                        driveId,
                        question.question,
                        question.type,
                        question.required || false,
                        question.options ? JSON.stringify(question.options) : null,
                        i
                    ]);
                }
            }

            res.json({ message: 'Drive updated successfully' });
        } catch (error) {
            console.error('Update drive error:', error);
            res.status(500).json({ message: 'Failed to update recruitment drive' });
        }
    }

    async deleteDrive(req, res) {
        try {
            const { driveId } = req.params;

            // Verify user owns this drive
            const drive = await this.db.query(
                'SELECT * FROM recruitment_drives WHERE id = ? AND club_head_id = ?',
                [driveId, req.user.id]
            );

            if (drive.length === 0) {
                return res.status(403).json({ message: 'Access denied' });
            }

            // Check if there are applications
            const applications = await this.db.query(
                'SELECT COUNT(*) as count FROM applications WHERE recruitment_drive_id = ?',
                [driveId]
            );

            if (applications[0].count > 0) {
                return res.status(400).json({ 
                    message: 'Cannot delete drive with existing applications' 
                });
            }

            // Delete questions first (foreign key constraint)
            await this.db.query('DELETE FROM recruitment_questions WHERE recruitment_drive_id = ?', [driveId]);
            
            // Delete drive
            await this.db.query('DELETE FROM recruitment_drives WHERE id = ?', [driveId]);

            res.json({ message: 'Drive deleted successfully' });
        } catch (error) {
            console.error('Delete drive error:', error);
            res.status(500).json({ message: 'Failed to delete recruitment drive' });
        }
    }

    async toggleDriveStatus(req, res) {
        try {
            const { driveId } = req.params;

            // Verify user owns this drive
            const drive = await this.db.query(
                'SELECT * FROM recruitment_drives WHERE id = ? AND club_head_id = ?',
                [driveId, req.user.id]
            );

            if (drive.length === 0) {
                return res.status(403).json({ message: 'Access denied' });
            }

            // Toggle status
            await this.db.query(`
                UPDATE recruitment_drives 
                SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [driveId]);

            const updatedDrive = await this.db.query(
                'SELECT * FROM recruitment_drives WHERE id = ?',
                [driveId]
            );

            res.json({ 
                message: 'Drive status updated successfully',
                drive: updatedDrive[0]
            });
        } catch (error) {
            console.error('Toggle drive status error:', error);
            res.status(500).json({ message: 'Failed to toggle drive status' });
        }
    }

    async getActiveDrives(req, res) {
        try {
            const drives = await this.db.query(`
                SELECT rd.*, c.name as club_name, c.category, c.description as club_description,
                       COUNT(a.id) as current_applications
                FROM recruitment_drives rd
                JOIN clubs c ON rd.club_id = c.id
                LEFT JOIN applications a ON rd.id = a.recruitment_drive_id
                WHERE rd.is_active = true 
                  AND rd.start_date <= CURDATE() 
                  AND rd.end_date >= CURDATE()
                GROUP BY rd.id
                ORDER BY rd.created_at DESC
            `);

            res.json({ drives });
        } catch (error) {
            console.error('Get active drives error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async submitApplication(req, res) {
        try {
            const { recruitmentDriveId, responses } = req.body;

            // Verify drive exists and is active
            const drive = await this.db.query(`
                SELECT * FROM recruitment_drives 
                WHERE id = ? AND is_active = true 
                  AND start_date <= CURDATE() 
                  AND end_date >= CURDATE()
            `, [recruitmentDriveId]);

            if (drive.length === 0) {
                return res.status(400).json({ message: 'Drive not found or not active' });
            }

            // Check if user already applied
            const existingApplication = await this.db.query(
                'SELECT * FROM applications WHERE recruitment_drive_id = ? AND student_id = ?',
                [recruitmentDriveId, req.user.id]
            );

            if (existingApplication.length > 0) {
                return res.status(400).json({ message: 'You have already applied to this drive' });
            }

            // Check application limit
            const currentApplications = await this.db.query(
                'SELECT COUNT(*) as count FROM applications WHERE recruitment_drive_id = ?',
                [recruitmentDriveId]
            );

            if (currentApplications[0].count >= drive[0].max_applications) {
                return res.status(400).json({ message: 'Application limit reached' });
            }

            // Create application
            const applicationResult = await this.db.query(`
                INSERT INTO applications 
                (recruitment_drive_id, student_id, club_id, status)
                VALUES (?, ?, ?, 'pending')
            `, [recruitmentDriveId, req.user.id, drive[0].club_id]);

            const applicationId = applicationResult.insertId;

            // Save responses
            if (responses && Array.isArray(responses)) {
                for (const response of responses) {
                    await this.db.query(`
                        INSERT INTO application_responses 
                        (application_id, question_id, response_text)
                        VALUES (?, ?, ?)
                    `, [applicationId, response.questionId, response.answer]);
                }
            }

            res.status(201).json({
                message: 'Application submitted successfully',
                applicationId
            });
        } catch (error) {
            console.error('Submit application error:', error);
            res.status(500).json({ message: 'Failed to submit application' });
        }
    }
}

module.exports = RecruitmentDriveController;