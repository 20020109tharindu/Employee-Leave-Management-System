Assignment for Software Engineer
(Backend Focused)
Task: Build an Employee Leave Management System
Objective:
Develop a web application where employees can request leave and administrators can
approve or reject them. The primary focus of this assignment is on Backend Architecture,
Authentication, and Business Logic. The Frontend should be functional but simple.
1. Backend Requirements (High Priority)
● Tech Stack: Node.js, Express.js, MongoDB.
● Authentication & Security:
○ Implement JWT (JSON Web Token) based authentication.
○ Password hashing using bcrypt.
● User Roles (Authorization):
○ Employee: Can apply for leave and view their own leave history.
○ Admin: Can view all leave requests and Approve/Reject them.
● API Endpoints:
○ POST /auth/login - Login for both Admin and Employee.
○ POST /leaves - (Employee only) Create a leave request (Start Date, End Date,
Reason).
○ GET /leaves/my-leaves - (Employee only) Get their own history.
○ GET /leaves/all - (Admin only) Get all requests.
○ PUT /leaves/:id/status - (Admin only) Update status to "Approved" or "Rejected".
● Business Logic:
○ Validate that the End Date is not before the Start Date.
○ Calculated fields: Backend should automatically calculate the "Total Days" based on
dates.
2. Frontend Requirements (Low Priority / Minimal)
● Tech Stack: React.js.
● Functionality:
○ Login Page: A simple form to input email/password.
○ Dashboard:
■ If Employee logs in: Show a button to "Apply Leave" and a table of their past
leaves.
■ If Admin logs in: Show a table of all pending requests with "Approve" and
"Reject" buttons.
● UI/UX:
○ No fancy designs required. You can use standard Bootstrap or plain CSS. The focus is
on functionality and data integration.
3. Advanced Requirements (Bonus)
● Validation: Use middleware (like express-validator) to ensure inputs are correct.
● Audit Logging: When an Admin approves a leave, record a log entry (e.g., "Admin X
approved leave Y at [Time]").
4. Submission Guidelines
● Deadline: 3 Days.
● Repository: Public GitHub repo with a clean folder structure (/server, /client).
● README: Must include instructions on how to set up the Admin account (e.g., a
database seeder script or default credentials).